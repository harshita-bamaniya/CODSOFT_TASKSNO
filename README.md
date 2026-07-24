# TIC TAC MIND 🎮⚡ (Web Edition)

> A modern, dark-themed, glassmorphic Web Tic Tac Toe experience featuring an **unbeatable Minimax AI**, Web Audio API synthesizer, and zero asset dependencies — ready for instant deployment on **GitHub Pages**.

---

## ✨ Web Features

- **Invincible Minimax AI**:
  - Implements **Minimax with Alpha-Beta Pruning** directly in JavaScript.
  - Impossible mode evaluates all 255,168 game states to guarantee 0 human wins.
- **Glassmorphism CSS Design**:
  - Translucent panels with backdrop blur (`backdrop-filter`).
  - Neon Cyan (`#00F0FF`) for Player X and Neon Purple (`#A855F7`) for Player O.
- **Native Web Audio API**:
  - Synthesizes all audio effects (move tones, click pops, victory chords) directly in browser memory.
- **LocalStorage Stats Persistence**:
  - Tracks Games Played, Human Wins, AI Wins, and Draws across page reloads.
- **Zero Build Tools Required**:
  - Built with vanilla HTML5, CSS3, and modern JavaScript.

---

## 🚀 How to Deploy on GitHub Pages

You can publish this web application to the internet in **3 simple steps**:

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and create a new public repository (e.g. `tic-tac-mind`).

### Step 2: Push Files to GitHub
Open your terminal in this directory (`tic_tac_mind_web`) and run:

```bash
git init
git add .
git commit -m "Initial commit - TIC TAC MIND Web Edition"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tic-tac-mind.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
4. Choose **main** branch and `/ (root)` folder, then click **Save**.
5. Your live link will be ready in 1-2 minutes at:
   `https://YOUR_USERNAME.github.io/tic-tac-mind/`

---

## 💻 How to Run Locally

Simply open `index.html` in any web browser, or launch a local dev server:

```bash
# Using Node.js npx serve
npx serve .
```

Or open `index.html` directly in Chrome, Edge, Firefox, or Safari!
