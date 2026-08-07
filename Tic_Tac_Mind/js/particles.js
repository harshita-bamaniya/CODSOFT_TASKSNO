/**
 * particles.js - HTML5 Canvas background particle system for ambient visual atmosphere.
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.enabled = true;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }

        this.loop();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 2.5 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4 - 0.2,
            color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7',
            alpha: Math.random() * 0.5 + 0.2,
            phase: Math.random() * Math.PI * 2
        };
    }

    loop() {
        if (this.enabled && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.phase += 0.02;
                const currentAlpha = p.alpha + Math.sin(p.phase) * 0.2;

                if (p.y < 0 || p.x < 0 || p.x > this.canvas.width) {
                    p.x = Math.random() * this.canvas.width;
                    p.y = this.canvas.height + 10;
                }

                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0.1, Math.min(0.8, currentAlpha));
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();
                this.ctx.restore();
            }
        }
        requestAnimationFrame(() => this.loop());
    }
}

let particleEngine;
window.addEventListener('DOMContentLoaded', () => {
    particleEngine = new ParticleEngine('particleCanvas');
});
