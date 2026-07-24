/**
 * app.js - Main Application Controller, Event Routing, and DOM UI Render Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const views = {
        start: document.getElementById('startView'),
        difficulty: document.getElementById('difficultyView'),
        game: document.getElementById('gameView')
    };

    const modals = {
        pause: document.getElementById('pauseModal'),
        settings: document.getElementById('settingsModal'),
        gameOver: document.getElementById('gameOverModal')
    };

    const boardEl = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const turnStatusEl = document.getElementById('turnStatus');
    const turnCardEl = document.getElementById('turnCard');
    const gameDiffBadgeEl = document.getElementById('gameDiffBadge');
    const currentDiffLabelEl = document.getElementById('currentDiffLabel');
    const winningLineEl = document.getElementById('winningLine');

    // Stat Label Elements
    const statPlayed = document.getElementById('statPlayed');
    const statHumanWins = document.getElementById('statHumanWins');
    const statAiWins = document.getElementById('statAiWins');
    const statDraws = document.getElementById('statDraws');

    // --- State Variables ---
    let board = Array(9).fill(null);
    let history = []; // Array of board snapshots
    let currentPlayer = 'X'; // Human = 'X', AI = 'O'
    let difficulty = 'Impossible';
    let isGameActive = false;
    let isAiThinking = false;

    // --- Initialize ---
    updateStatsDisplay();

    // --- Navigation & View Routers ---
    function showView(targetView) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        Object.values(views).forEach(v => v.classList.add('hidden'));
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }

    function showModal(modal) {
        modal.classList.remove('hidden');
    }

    function hideModals() {
        Object.values(modals).forEach(m => m.classList.add('hidden'));
    }

    function updateStatsDisplay() {
        const s = statsManager.stats;
        statPlayed.textContent = s.gamesPlayed;
        statHumanWins.textContent = s.humanWins;
        statAiWins.textContent = s.aiWins;
        statDraws.textContent = s.draws;
    }

    // --- Game Logic ---
    function startNewGame(diff = null) {
        if (diff) {
            difficulty = diff;
        }
        board = Array(9).fill(null);
        history = [];
        currentPlayer = 'X';
        isGameActive = true;
        isAiThinking = false;

        // Reset SVG Winning Line
        winningLineEl.classList.remove('draw-active');

        // Reset DOM Cells
        cells.forEach(c => {
            c.className = 'cell';
            c.textContent = '';
        });

        // Update UI Badges
        gameDiffBadgeEl.textContent = difficulty.toUpperCase();
        currentDiffLabelEl.textContent = difficulty.toUpperCase();
        updateTurnDisplay();

        hideModals();
        showView(views.game);
    }

    function updateTurnDisplay() {
        if (currentPlayer === 'X') {
            turnStatusEl.textContent = "YOUR TURN (X)";
            turnStatusEl.style.color = "var(--neon-cyan)";
        } else {
            turnStatusEl.textContent = "AI THINKING... (O)";
            turnStatusEl.style.color = "var(--neon-purple)";
        }
    }

    function handleCellClick(index) {
        if (!isGameActive || isAiThinking || board[index] !== null || currentPlayer !== 'X') {
            return;
        }

        // Save history for Undo
        history.push([...board]);

        // Place Human Move
        executeMove(index, 'X');
        audioEngine.playMoveX();

        const winInfo = MinimaxAI.checkWinner(board);
        if (winInfo.winner) {
            handleGameOver(winInfo);
        } else {
            currentPlayer = 'O';
            updateTurnDisplay();
            triggerAiTurn();
        }
    }

    function triggerAiTurn() {
        isAiThinking = true;
        setTimeout(() => {
            if (!isGameActive) return;

            const aiMove = MinimaxAI.getBestMove(board, difficulty, 'O', 'X');
            if (aiMove !== null) {
                executeMove(aiMove, 'O');
                audioEngine.playMoveO();

                const winInfo = MinimaxAI.checkWinner(board);
                if (winInfo.winner) {
                    handleGameOver(winInfo);
                } else {
                    currentPlayer = 'X';
                    updateTurnDisplay();
                }
            }
            isAiThinking = false;
        }, 350);
    }

    function executeMove(index, symbol) {
        board[index] = symbol;
        const cell = cells[index];
        cell.classList.add('taken', symbol.toLowerCase());
    }

    function handleGameOver(winInfo) {
        isGameActive = false;
        statsManager.recordGame(winInfo.winner);
        updateStatsDisplay();

        if (winInfo.winner !== 'DRAW' && winInfo.line) {
            drawWinningLine(winInfo.line);
        }

        setTimeout(() => {
            const titleEl = document.getElementById('gameOverTitle');
            const subEl = document.getElementById('gameOverSubtitle');

            if (winInfo.winner === 'X') {
                titleEl.textContent = "VICTORY!";
                titleEl.style.color = "var(--neon-green)";
                subEl.textContent = "You accomplished the impossible!";
                audioEngine.playWin();
            } else if (winInfo.winner === 'O') {
                titleEl.textContent = "AI WINS!";
                titleEl.style.color = "var(--neon-pink)";
                subEl.textContent = "Impossible AI Remains Undefeated";
                audioEngine.playLose();
            } else {
                titleEl.textContent = "STALEMATE (DRAW)";
                titleEl.style.color = "var(--neon-amber)";
                subEl.textContent = "Masterclass defense on both sides";
                audioEngine.playDraw();
            }

            showModal(modals.gameOver);
        }, 400);
    }

    function drawWinningLine(line) {
        const [a, b, c] = line;
        const cellA = cells[a].getBoundingClientRect();
        const cellC = cells[c].getBoundingClientRect();
        const boardRect = boardEl.getBoundingClientRect();

        const x1 = cellA.left + cellA.width / 2 - boardRect.left;
        const y1 = cellA.top + cellA.height / 2 - boardRect.top;
        const x2 = cellC.left + cellC.width / 2 - boardRect.left;
        const y2 = cellC.top + cellC.height / 2 - boardRect.top;

        winningLineEl.setAttribute('x1', x1);
        winningLineEl.setAttribute('y1', y1);
        winningLineEl.setAttribute('x2', x2);
        winningLineEl.setAttribute('y2', y2);

        winningLineEl.classList.add('draw-active');
    }

    function handleUndo() {
        if (!isGameActive || history.length === 0 || isAiThinking) return;

        audioEngine.playClick();
        board = history.pop();
        currentPlayer = 'X';
        isGameActive = true;

        // Sync DOM
        cells.forEach((cell, idx) => {
            cell.className = 'cell';
            if (board[idx] === 'X') cell.classList.add('taken', 'x');
            else if (board[idx] === 'O') cell.classList.add('taken', 'o');
        });

        winningLineEl.classList.remove('draw-active');
        updateTurnDisplay();
    }

    // --- EVENT LISTENERS ---
    // Cell clicks
    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => handleCellClick(idx));
    });

    // Start View Buttons
    document.getElementById('btnPlay').addEventListener('click', () => {
        audioEngine.playClick();
        startNewGame();
    });

    document.getElementById('btnDifficulty').addEventListener('click', () => {
        audioEngine.playClick();
        showView(views.difficulty);
    });

    document.getElementById('btnSettings').addEventListener('click', () => {
        audioEngine.playClick();
        showModal(modals.settings);
    });

    // Difficulty View Buttons
    document.querySelectorAll('.btn-diff').forEach(btn => {
        btn.addEventListener('click', (e) => {
            audioEngine.playClick();
            document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');

            const diff = targetBtn.getAttribute('data-diff');
            startNewGame(diff);
        });
    });

    document.getElementById('btnDiffBack').addEventListener('click', () => {
        audioEngine.playClick();
        showView(views.start);
    });

    // Gameplay HUD Action Buttons
    document.getElementById('btnUndo').addEventListener('click', handleUndo);
    document.getElementById('btnRestart').addEventListener('click', () => {
        audioEngine.playClick();
        startNewGame();
    });
    document.getElementById('btnPause').addEventListener('click', () => {
        audioEngine.playClick();
        showModal(modals.pause);
    });

    // Pause Modal Buttons
    document.getElementById('btnResume').addEventListener('click', () => {
        audioEngine.playClick();
        hideModals();
    });
    document.getElementById('btnPauseSettings').addEventListener('click', () => {
        audioEngine.playClick();
        hideModals();
        showModal(modals.settings);
    });
    document.getElementById('btnPauseMainMenu').addEventListener('click', () => {
        audioEngine.playClick();
        hideModals();
        showView(views.start);
    });

    // Settings Modal
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        audioEngine.enabled = e.target.checked;
    });

    document.getElementById('particlesToggle').addEventListener('change', (e) => {
        if (particleEngine) particleEngine.enabled = e.target.checked;
    });

    document.getElementById('btnResetStats').addEventListener('click', () => {
        audioEngine.playClick();
        statsManager.reset();
        updateStatsDisplay();
    });

    document.getElementById('btnCloseSettings').addEventListener('click', () => {
        audioEngine.playClick();
        hideModals();
    });

    // Game Over Modal Buttons
    document.getElementById('btnPlayAgain').addEventListener('click', () => {
        audioEngine.playClick();
        startNewGame();
    });

    document.getElementById('btnGameOverMenu').addEventListener('click', () => {
        audioEngine.playClick();
        hideModals();
        showView(views.start);
    });
});
