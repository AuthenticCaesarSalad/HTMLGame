# GameBox — 15 Offline Games in 1 File

GameBox is a single HTML file (`GameBox.html`) containing 15 complete games. No internet, no installs, no dependencies — open the file in any browser (phone or desktop) and play.

## How to Run

1. Download `GameBox.html`
2. Open it in any modern browser (Chrome, Firefox, Safari, Edge)
3. Pick a game from the menu

Everything runs locally. Best scores are saved in your browser's localStorage.

## Difficulty Modes

There are 4 difficulty levels — **Easy, Medium, Hard, and Impossible** — selectable in the header at any time. The setting is saved and applies to every game. Switch it in the menu, then hit Start/New on a game.

| Level | What changes |
|---|---|
| Easy | Slow speeds, wide gaps, forgiving CPUs, small Minesweeper grid, easy words |
| Medium | The balanced default |
| Hard | Fast speeds, bigger grids, smarter CPUs, early-tap penalties |
| Impossible | Brutal speeds, evil word lists, **perfect AI opponents** (see below) |

Highlights per level:
- **Snake** speeds up from 210ms/tick (Easy) to 78ms/tick (Impossible)
- **Tic-Tac-Toe** on Impossible uses perfect minimax — it is mathematically unbeatable; the best you can achieve is a draw
- **Connect Four** on Impossible uses a depth-4 minimax AI that sees four moves ahead
- **Minesweeper** grows from 9x9 with 8 mines to 11x11 with 24 mines
- **Hangman** on Impossible draws from evil words (RHYTHM, SYNDROME, SPHINX...) and allows only 4 misses
- **Reaction Test** on Hard+ : tapping too early fails the entire set

---

## The Games

### 1. Snake 🐍
Eat the red food, grow longer, don't hit the walls or yourself.

**Controls:** swipe on the board, the D-pad buttons, or arrow keys.

**Walkthrough:**
- Stay near the center early — edges kill more snakes than self-collision does
- Keep your turns predictable: hug a "wall" of your own body in a zig-zag pattern once you're long
- Never turn into a space smaller than your remaining length can U-turn in
- On Impossible (78ms/tick), plan two moves ahead — by the time you see a problem, it's too late to fix

### 2. 2048 🔢
Swipe to slide tiles. Equal tiles merge. Reach 2048.

**Controls:** swipe on the board or arrow keys.

**Walkthrough:**
- Pick one corner (bottom-left is common) and never push your biggest tile away from it
- Build a "snake chain": 512-256-128-64 along the bottom row, continuing up in reverse — merges cascade naturally
- Avoid the Up swipe entirely unless forced; it scatters your bottom row
- On Hard/Impossible, more 4-tiles spawn, so keep more empty space than feels necessary — a clogged board dies fast

### 3. Memory Match 🃏
Flip cards two at a time and find all 8 pairs in as few moves as possible.

**Controls:** tap cards.

**Walkthrough:**
- On Easy you get a 1.5s preview of all cards — memorize one quadrant (4 cards) per glance instead of trying to take in everything
- Always flip a *known* card first, then hunt its twin — never flip two unknowns if you can help it
- Go row by row in a fixed scan order; random hunting doubles your move count

### 4. Tic-Tac-Toe ❌⭕
You (X) vs the computer (O). Win, lose, draw — the scoreboard remembers.

**Controls:** tap a cell.

**Walkthrough:**
- On Easy/Medium the CPU blunders sometimes; on Hard it plays solid basics
- On **Impossible** it plays perfect minimax — you cannot win, ever. Your only goal is the draw: take the center if available (else a corner), and always answer the CPU's threats immediately
- Corner openings give the opponent the most ways to go wrong — on non-Impossible levels, open in a corner

### 5. Whack-a-Mole 🔨
30 seconds. Tap the mole every time it pops up.

**Controls:** tap the mole.

**Walkthrough:**
- Rest your finger over the center hole — the middle row is reachable fastest from there
- Don't watch the whole grid; keep your eyes on the center and rely on peripheral vision for the outer holes
- On Impossible the mole moves every 380ms — you must tap on motion, not on sight

### 6. Breakout 🧱
Drag the paddle, bounce the ball, clear every brick. Multiple levels, and clearing a level speeds the ball up.

**Controls:** drag on the board or arrow keys.

**Walkthrough:**
- Hit the ball with the edge of the paddle to steer it sideways; the middle sends it straight up
- Clear bricks from the columns at the walls first — balls trapped in a side channel clear whole columns for free
- Never let the ball go vertical-and-centered late in a level; you can't steer it from there
- On Impossible you have 1 life and a 44px paddle — treat it as a no-mistake run

### 7. Flappy Tap 🐤
Tap to flap, thread the pipe gaps. One tap too many or too few and it's over.

**Controls:** tap the board, click, or Space/Up arrow.

**Walkthrough:**
- Tap in a steady rhythm to fly level — panic double-taps are the #1 killer
- Aim for the middle of the gap, not just "through" it; entering at the top of one gap sets you up badly for the next
- On Impossible the gaps are 78px and the pipes come fast — start tapping *before* the gap arrives, not when you're at it

### 8. Simon Says 🔴🟡🟢🔵
Watch the pattern flash, tap it back. Each round adds one step.

**Controls:** tap the pads.

**Walkthrough:**
- Convert the sequence into something you can say in your head: colors, positions, or musical tones (each pad has its own note)
- Chunk the sequence in groups of 3-4 — recalling "3 chunks" is easier than "10 flashes"
- On Impossible the flashes are 170ms — don't blink during the show phase, literally

### 9. Minesweeper 💣
Dig all safe cells without hitting a mine. Numbers show how many mines touch that cell.

**Controls:** tap to dig. Long-press (or the Flag button) to mark a mine.

**Walkthrough:**
- Your first dig is always safe — and its neighbors too, so open boldly to start
- If a number equals its count of hidden neighbors, all of them are mines — flag them
- If a number equals its count of *flagged* neighbors, every other hidden neighbor is safe — dig them
- Corners are the safest digs statistically; center cells have up to 8 neighbors
- On Impossible (11x11, 24 mines) flag early and often — the density is ~20%, pure guessing loses

### 10. Hangman 🪢
Guess the hidden word one letter at a time before the figure completes.

**Controls:** tap letter keys.

**Walkthrough:**
- Always start with vowels-in-order: E, A, O, I — consonant-first guessing wastes misses
- Then common consonants: T, N, S, R, H, L
- Watch word length: 5-letter words with no E are usually GHOST/WEIRD/WORDY types
- On Impossible you get only 4 misses and words like RHYTHM and SYNDROME — vowel coverage barely helps there; guess by word shape and letter frequency in *English overall*, not vowels

### 11. Pong 🏓
Classic paddle duel vs the CPU. First to 7 points wins.

**Controls:** drag on the board or arrow keys.

**Walkthrough:**
- Hit the ball with the paddle's edge to add spin — edge hits angle the ball sharply
- The ball speeds up on every paddle hit, so long rallies end in fast kills; keep your returns angled
- The CPU paddle tracks the ball at a fixed speed — on Impossible (7.6px/frame) it barely misses, so you must win with angles, not raw speed. Aim fast balls at the far corner just as it commits

### 12. Connect Four 🔴🔵
Drop discs, line up 4 in a row (any direction) before the CPU does.

**Controls:** tap a column.

**Walkthrough:**
- The center column is the most valuable square on the board — it touches the most 4-in-a-row lines. Take it early, contest it always
- Build "double threats": two intersecting lines of three that share no single blocking square. When you have one, you win next turn no matter what
- Odd/even threat counting: with perfect play the first player wins by creating threats on *odd* rows. In practice: put your horizontal threats on rows 1 and 3
- On Impossible the CPU searches 4 moves deep and will punish any unforced move — play center, never voluntarily fill a cell directly below a CPU win-square

### 13. Lights Out 💡
Tapping a light flips it and its 4 neighbors. Turn every light off.

**Controls:** tap lights.

**Walkthrough:**
- **The guaranteed method ("chase the lights"):** work top to bottom. For each row, tap the cell directly below every light that is still ON in the row above. Chasing row-by-row pushes all lights down until only the bottom row can have lights left
- If the bottom row ends up empty — you've won. If not, the bottom pattern tells you which cells in the TOP row to re-tap: use this table (1 = tap that top cell, then chase again):
  - Lights at bottom cells 1&2 → tap top cell 4
  - Bottom 1&5 → tap top 2
  - Bottom 1&3&5 → tap top 1
  - Bottom 2&4 → tap top 5
  - Bottom 1&2&3 → tap top 3
  - Bottom 2&3&4 → tap top 1
  - Bottom 3&4&5 → tap top 1... 
  - (any pattern: tap the top cells that correspond to the bottom pattern, chase once more, and it clears)
- Every puzzle is generated from a solved board, so it is always solvable — no impossible layouts

### 14. Reaction Test ⚡
The panel is red — wait. The instant it turns green, tap. Sets of runs (3 on Easy, 5 Medium/Hard, 7 Impossible), with best time and average tracked.

**Controls:** tap the panel.

**Walkthrough:**
- Don't stare at the panel — peripheral vision reacts just as fast and is less prone to anticipatory tapping
- The green appears between 0.7s and 4s after the red shows. On Hard+ the window is shorter, and tapping early FAILS the whole set — stay honest
- Human average is ~250ms; under 200ms is excellent. If you're "getting" 120ms consistently, you're guessing the timing, not reacting

### 15. Dodger 🚀
Drag your block to dodge falling red blocks. Every block that passes scores. Speed and spawn rate ramp up with score.

**Controls:** drag on the board (or mouse).

**Walkthrough:**
- Stay near the center horizontally — it keeps both escape routes open; wall-hugging leaves you one
- Watch the *gap*, not the blocks: position yourself where the next opening will be, not where the current one is
- Move early and small — late large movements trap you between spawns
- On Impossible (5.5 base speed) the safe window is tiny; prioritize distance from all blocks over ideal position

---

## Tech Notes

- Single file, zero dependencies, ~85KB. Works offline forever once downloaded
- Touch-first (mobile), with keyboard support on desktop (arrows/Space)
- Best scores persist in localStorage per browser
- Sounds are synthesized with the Web Audio API — no audio files
