# Demon Slayer-Inspired Tutorial Prototype

This repository currently contains a small browser-playable 2D action-combat prototype for the first tutorial fight only: Tanjiro with a short axe versus Giyuu.

## Play

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Tutorial Goal

Break Giyuu's composure once. Giyuu has HP for future expansion, but this tutorial is intentionally cleared by composure break rather than defeating him.

## Controls

- `A` / `D` or arrow keys: move left/right
- `W`, `ArrowUp`, or `Space`: jump
- `J`: light axe attack
- `K`: heavy axe attack
- `L`: block
- `Shift`: short clumsy dodge
- `R`: restart tutorial

## Structure

- `src/player/tanjiroController.js` — beginner Tanjiro movement, HP, block, dodge, light/heavy axe attacks
- `src/enemy/giyuuController.js` — calm tutorial Giyuu AI, HP, composure, slow punishing attack
- `src/systems/combatSystem.js` — hit detection and combat feedback
- `src/systems/composureSystem.js` — reusable composure resource
- `src/systems/rankingSystem.js` — F through S clear grading
- `src/systems/rewardSystem.js` — coin payouts by rank
- `src/systems/difficultySettings.js` — Easy/Medium/Hard/Hardcore rule placeholders
- `src/ui/resultsScreen.js` — clear/fail result screen
- `src/ui/shopPlaceholder.js` — Nezuko shop placeholder

The code is intentionally scoped to this first tutorial fight so later work can expand into Season 1, Season 2, and Season 3 story arcs without turning this prototype into the full game yet.
