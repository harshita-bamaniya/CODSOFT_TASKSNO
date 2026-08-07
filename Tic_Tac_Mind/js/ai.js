/**
 * ai.js - Minimax Algorithm with Alpha-Beta Pruning for TIC TAC MIND Web Edition.
 */

class MinimaxAI {
    constructor(aiSymbol = 'O', humanSymbol = 'X') {
        this.aiSymbol = aiSymbol;
        this.humanSymbol = humanSymbol;
    }

    /**
     * Return best (0-8) index move based on selected difficulty.
     */
    static getBestMove(board, difficulty, aiSymbol = 'O', humanSymbol = 'X') {
        const emptyIndices = this.getEmptyIndices(board);
        if (emptyIndices.length === 0) return null;

        if (difficulty === 'Easy') {
            if (Math.random() < 0.75) {
                return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
            return this.getImpossibleMove(board, aiSymbol, humanSymbol);
        } else if (difficulty === 'Medium') {
            if (Math.random() < 0.40) {
                return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
            return this.minimaxSearch(board, 0, 2, -1000, 1000, true, aiSymbol, humanSymbol).index;
        } else {
            // Impossible Mode (Full Minimax + Alpha-Beta Pruning)
            return this.getImpossibleMove(board, aiSymbol, humanSymbol);
        }
    }

    static getImpossibleMove(board, aiSymbol, humanSymbol) {
        const res = this.minimaxSearch(board, 0, 9, -1000, 1000, true, aiSymbol, humanSymbol);
        if (res.index === null && this.getEmptyIndices(board).length > 0) {
            const empties = this.getEmptyIndices(board);
            return empties[Math.floor(Math.random() * empties.length)];
        }
        return res.index;
    }

    static getEmptyIndices(board) {
        const indices = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) indices.push(i);
        }
        return indices;
    }

    static evaluate(board, depth, aiSymbol, humanSymbol) {
        const winInfo = this.checkWinner(board);
        if (winInfo.winner === aiSymbol) {
            return 10 - depth;
        } else if (winInfo.winner === humanSymbol) {
            return -10 + depth;
        } else if (winInfo.winner === 'DRAW') {
            return 0;
        }
        return null;
    }

    static checkWinner(board) {
        const winLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let i = 0; i < winLines.length; i++) {
            const [a, b, c] = winLines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { winner: board[a], lineIndex: i, line: winLines[i] };
            }
        }

        if (this.getEmptyIndices(board).length === 0) {
            return { winner: 'DRAW', lineIndex: null, line: null };
        }

        return { winner: null, lineIndex: null, line: null };
    }

    static minimaxSearch(board, depth, maxDepth, alpha, beta, isMaximizing, aiSymbol, humanSymbol) {
        const score = this.evaluate(board, depth, aiSymbol, humanSymbol);
        if (score !== null) {
            return { score: score, index: null };
        }

        if (depth >= maxDepth) {
            return { score: 0, index: null };
        }

        const emptyIndices = this.getEmptyIndices(board);
        let bestIndex = null;

        if (isMaximizing) {
            let maxEval = -10000;
            for (let idx of emptyIndices) {
                board[idx] = aiSymbol;
                const result = this.minimaxSearch(board, depth + 1, maxDepth, alpha, beta, false, aiSymbol, humanSymbol);
                board[idx] = null;

                if (result.score > maxEval) {
                    maxEval = result.score;
                    bestIndex = idx;
                }

                alpha = Math.max(alpha, result.score);
                if (beta <= alpha) break; // Beta Cutoff
            }
            return { score: maxEval, index: bestIndex };
        } else {
            let minEval = 10000;
            for (let idx of emptyIndices) {
                board[idx] = humanSymbol;
                const result = this.minimaxSearch(board, depth + 1, maxDepth, alpha, beta, true, aiSymbol, humanSymbol);
                board[idx] = null;

                if (result.score < minEval) {
                    minEval = result.score;
                    bestIndex = idx;
                }

                beta = Math.min(beta, result.score);
                if (beta <= alpha) break; // Alpha Cutoff
            }
            return { score: minEval, index: bestIndex };
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinimaxAI;
}
