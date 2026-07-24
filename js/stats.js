/**
 * stats.js - Tracks and persists gameplay statistics in localStorage.
 */

class StatsManager {
    constructor() {
        this.STORAGE_KEY = 'TIC_TAC_MIND_STATS';
        this.stats = {
            gamesPlayed: 0,
            humanWins: 0,
            aiWins: 0,
            draws: 0
        };
        this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.stats = Object.assign(this.stats, JSON.parse(saved));
            }
        } catch (e) {
            console.warn('[StatsManager] Could not load stats:', e);
        }
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
        } catch (e) {
            console.warn('[StatsManager] Could not save stats:', e);
        }
    }

    recordGame(winner) {
        this.stats.gamesPlayed++;
        if (winner === 'X') {
            this.stats.humanWins++;
        } else if (winner === 'O') {
            this.stats.aiWins++;
        } else if (winner === 'DRAW') {
            this.stats.draws++;
        }
        this.save();
    }

    reset() {
        this.stats = {
            gamesPlayed: 0,
            humanWins: 0,
            aiWins: 0,
            draws: 0
        };
        this.save();
    }
}

const statsManager = new StatsManager();
