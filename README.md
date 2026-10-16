# GameBox — 63 Offline Games in 3 Files

GameBox is three vanilla files kept together — `gamebox.html`, `style.css` and `script.js` — containing 63 complete games. No internet, no installs, no dependencies — keep the files in the same folder and open `gamebox.html` in any browser (phone or desktop) and play.

**Layout:** the menu is a responsive grid — game cards stack in a single column on phones and stand side by side filling the screen on desktops, so the whole list needs minimal scrolling. Game screens stay centered, are wider on desktop, and cap their play areas to the viewport height so boards fit without scrolling.

## How to Run

1. Download the three files (`gamebox.html`, `style.css`, `script.js`) and keep them in the same folder
2. Open `gamebox.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. Pick a game from the menu

Everything runs locally. Best scores are saved in your browser's localStorage.

## Device & Browser Compatibility

Yes — GameBox is playable on essentially any device with a modern browser. It is three plain files in one folder (HTML, CSS and JS): no installation, no app store, no internet connection after downloading, no external libraries, fonts, or images. Every game is touch-first (phones/tablets) with full keyboard support (desktops).

**Confirmed working on:**

| Device | Browser requirement | Notes |
|---|---|---|
| Android phones & tablets | Chrome 88+ (2021), Firefox 89+, Samsung Internet 14+ | Touch controls: tap, drag, swipe, long-press (Minesweeper flags) |
| iPhone & iPad | Safari 15+ (iOS 15, 2021), Chrome/Edge on iOS 15+ | Same touch controls; sound plays after the first tap (iOS autoplay policy) |
| Windows / macOS / Linux desktops | Chrome, Edge, Firefox, Safari — any 2021+ version | Arrow keys move (Snake, Tetris, Pong, Breakout, Invaders), Space flaps/hard-drops |
| Any device with a USB or on-screen keyboard | — | Every touch control has a keyboard equivalent |

**Why 2021+ browsers:** the newest feature the files use is the CSS `aspect-ratio` property (supported everywhere since early 2021) for the game boards. The JavaScript itself is written in ES5 style — no arrow functions, no modules — so the logic runs on even older engines; only the board layout needs a current browser.

**Graceful degradations:**
- **Private/incognito mode** (or cookies blocked): games all run normally — best scores just won't be saved between sessions
- **No sound support**: audio is synthesized with the Web Audio API and wrapped in error handling; if the browser blocks it, games play silently
- **Offline**: after downloading the files, zero network access is ever needed — no CDN, no fonts, no analytics

**Not supported:** Internet Explorer (all versions) and pre-2021 browsers without `aspect-ratio` support — the game boards will render with collapsed/incorrect sizing. Very old smart TVs and console browsers generally fall in this category too.

**Installing it like an app:** on Android, open `gamebox.html` in Chrome → menu → "Add to Home screen"; on iOS, open `gamebox.html` in Safari → Share → "Add to Home Screen". It then launches fullscreen like a native game collection.

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
- **Tetris** drop speed nearly triples, from 700ms to 230ms per row
- **Space Invaders** fleet grows from 18 to 40 aliens, and you get 1 life
- **Mastermind** code grows to 5 pegs from 8 colours in only 6 guesses
- **Reversi** CPU goes from random blunderer to depth-3 minimax searcher
- **RPS** AI levels up from coin-flip to a pattern-learner that counters your habits
- **Stroop Test** on Hard+ randomly flips the rule mid-game between ink and word
- **Aim Trainer** targets shrink faster, move, and live shorter on higher levels
- **Sudoku**, **Flood-It** and **Match Three** don't use clocks — they scale grid size, colour counts and move budgets instead
- **Gomoku** grows to 13x13, and its CPU loses its noise (and its mistakes) on Impossible
- **Hopper** doubles traffic density and drops you to 2 lives; **Dash Runner** and **Block Stacker** simply get faster
- **Nonogram** grows from 5x5 to 10x10 grids
- **Wordle** words grow from 4 to 7 letters and guesses shrink from 6 to 4
- **Checkers** CPU searches 1 to 4 moves deep
- **Mancala** CPU goes from random to a 4-ply lookahead
- **Flow Free** grows from 4x4 with 3 pairs to 7x7 with 6 pairs
- **Typing Test** shrinks from 60s to 20s and uses longer words
- **Air Hockey** CPU paddle speeds up from 3.2 to 6.4 px/frame
- **Slots** starts you with fewer coins and pays out less
- **Quiz** shrinks from 20s to 8s per question and uses a harder pool
- **Bubble Shooter** starts with more rows and faster descent
- **Tower Defense** starts with 250 gold / 30 lives (Easy) down to 100 gold / 8 lives (Impossible)
- **Doom** spawns 6 demons at 60 HP (Easy) up to 18 at 120 HP, hitting harder and moving faster (Impossible)
- **Rogue Dungeon** adds more monsters and multiplies monster damage (0.8x Easy → 1.6x Impossible)
- **Chess** CPU depth grows from random legal moves (Easy) to a 4-ply minimax search (Impossible)
- **Solitaire** goes from draw 1 with unlimited redeals to draw 3 with a single redeal
- **Mahjong** stacks grow from 36 tiles (Easy) to 144 (Impossible)
- **Bowling** adds aim wobble and a stronger hook as the difficulty rises
- **Mini Golf** cup shrinks (12px to 7px) and the layouts get nastier
- **Fruit Slash** fruit flies faster, spawns more often, and bombs go from 5% to 22%
- **Rhythm Tiles** base speed climbs from 2.2 to 4.6 px/frame with faster acceleration
- **Yahtzee** rolls per turn drop from 4 (Easy) to 1 (Impossible)
- **Roulette** starting coins fall from 1000 (Easy) to 100 (Impossible)
- **Word Search** grids grow from 8x8 to 14x14 with more words in all 8 directions

---

## The Games

### 1. Doom 🔥
A first-person raycaster FPS in the spirit of classic Doom. Procedurally carved mazes, demons that chase you and shoot when they have line of sight, health packs, and a hitscan gun. Clear the sector to win.

**Controls:** WASD or arrow keys to move and turn, Space/Enter to fire. On touch: drag on the screen to turn, a quick tap fires, and the on-screen pad works too.

**Walkthrough:**
- Wall shading tells you distance: dark walls are far, bright walls are close — use it to navigate corridors
- Fight one demon at a time: line of sight is a two-way street, so lure enemies around corners to split the pack
- Strafe after a demon shoots — its shot is aimed at where you were, and sidestepping makes it miss
- Health packs heal 25; grab them before a fight, not during one
- Your gun hits whatever is closest within a narrow angle — aim dead-center before firing or you'll damage the wrong demon
- On Impossible, 18 demons at 120 HP hunt you — constant movement is your best defense; standing still is death

### 2. Tower Defense 🏰
Build Gun, Cannon and Frost towers along a winding lane and hold off 15 waves of enemies. Enemies follow a fixed path from left to right; each one that leaks costs lives. Kill them for gold, invest it in upgrades, and don't run out of lives.

**Controls:** tap a free cell to build the selected tower; tap a tower to upgrade it (up to level 3); toggle Sell to refund 70% of what you invested; Next Wave starts the next assault.

**Walkthrough:**
- Place towers on corners first — that's where enemies spend the most time, so every tower there gets maximum coverage
- Mix the three types: Gun for raw DPS, Cannon for splash (great against tank clusters), Frost to slow the pack so the others fire more volleys per pass
- Upgrades beat new towers: a level-3 Gun is cheaper DPS than three level-1 Guns, and the +0.3 range per level doubles a tower's useful zone
- Start the wave as soon as the button says "Next Wave" — don't sit on a full bank of gold, interest is not paid
- Runners (wave 3+) need fast-reacting towers near the exit; tanks (wave 5+) reward Frost + Cannon mid-lane
- On Impossible you start with 100 gold and 8 lives — every placement must count; selling and rebuilding is sometimes the right play

### 3. Rogue Dungeon ⚔️
A turn-based roguelike: procedurally generated dungeons, fog of war, four kinds of monsters, potions, gold, and a staircase down to the next depth. Reach depth 10 to escape.

**Controls:** arrows/WASD move one tile (bumping a monster attacks it), P drinks a potion, Enter or > descends when on the stairs. On-screen D-pad plus Drink/Descend buttons for touch.

**Walkthrough:**
- Bumping is attacking: walk into a monster to hit it. Kill things for XP; each level-up heals you fully and raises max HP
- Depth 1-2 is rats only — bank XP and potions there before the goblins arrive
- Potions heal 40% of max HP. Drink below half, not at the last hit point — monster damage varies, so a single big roll can kill you
- Monsters scale with depth, but so do XP and loot: depth 5 brings orcs, depth 6 adds trolls
- The fog is your friend: monsters only act when they can see you. Break line of sight to reset fights
- Gold is score only — don't die collecting it. On Impossible, monster damage is 1.6x, so kite monsters through corridors one at a time

### 4. Snake 🐍
Eat the red food, grow longer, don't hit the walls or yourself.

**Controls:** swipe on the board, the D-pad buttons, or arrow keys.

**Walkthrough:**
- Stay near the center early — edges kill more snakes than self-collision does
- Keep your turns predictable: hug a "wall" of your own body in a zig-zag pattern once you're long
- Never turn into a space smaller than your remaining length can U-turn in
- On Impossible (78ms/tick), plan two moves ahead — by the time you see a problem, it's too late to fix

### 5. 2048 🔢
Swipe to slide tiles. Equal tiles merge. Reach 2048.

**Controls:** swipe on the board or arrow keys.

**Walkthrough:**
- Pick one corner (bottom-left is common) and never push your biggest tile away from it
- Build a "snake chain": 512-256-128-64 along the bottom row, continuing up in reverse — merges cascade naturally
- Avoid the Up swipe entirely unless forced; it scatters your bottom row
- On Hard/Impossible, more 4-tiles spawn, so keep more empty space than feels necessary — a clogged board dies fast

### 6. Memory Match 🃏
Flip cards two at a time and find all 8 pairs in as few moves as possible.

**Controls:** tap cards.

**Walkthrough:**
- On Easy you get a 1.5s preview of all cards — memorize one quadrant (4 cards) per glance instead of trying to take in everything
- Always flip a *known* card first, then hunt its twin — never flip two unknowns if you can help it
- Go row by row in a fixed scan order; random hunting doubles your move count

### 7. Tic-Tac-Toe ❌⭕
You (X) vs the computer (O). Win, lose, draw — the scoreboard remembers.

**Controls:** tap a cell.

**Walkthrough:**
- On Easy/Medium the CPU blunders sometimes; on Hard it plays solid basics
- On **Impossible** it plays perfect minimax — you cannot win, ever. Your only goal is the draw: take the center if available (else a corner), and always answer the CPU's threats immediately
- Corner openings give the opponent the most ways to go wrong — on non-Impossible levels, open in a corner

### 8. Whack-a-Mole 🔨
30 seconds. Tap the mole every time it pops up.

**Controls:** tap the mole.

**Walkthrough:**
- Rest your finger over the center hole — the middle row is reachable fastest from there
- Don't watch the whole grid; keep your eyes on the center and rely on peripheral vision for the outer holes
- On Impossible the mole moves every 380ms — you must tap on motion, not on sight

### 9. Breakout 🧱
Drag the paddle, bounce the ball, clear every brick. Multiple levels, and clearing a level speeds the ball up.

**Controls:** drag on the board or arrow keys.

**Walkthrough:**
- Hit the ball with the edge of the paddle to steer it sideways; the middle sends it straight up
- Clear bricks from the columns at the walls first — balls trapped in a side channel clear whole columns for free
- Never let the ball go vertical-and-centered late in a level; you can't steer it from there
- On Impossible you have 1 life and a 44px paddle — treat it as a no-mistake run

### 10. Flappy Tap 🐤
Tap to flap, thread the pipe gaps. One tap too many or too few and it's over.

**Controls:** tap the board, click, or Space/Up arrow.

**Walkthrough:**
- Tap in a steady rhythm to fly level — panic double-taps are the #1 killer
- Aim for the middle of the gap, not just "through" it; entering at the top of one gap sets you up badly for the next
- On Impossible the gaps are 78px and the pipes come fast — start tapping *before* the gap arrives, not when you're at it

### 11. Simon Says 🔴🟡🟢🔵
Watch the pattern flash, tap it back. Each round adds one step.

**Controls:** tap the pads.

**Walkthrough:**
- Convert the sequence into something you can say in your head: colors, positions, or musical tones (each pad has its own note)
- Chunk the sequence in groups of 3-4 — recalling "3 chunks" is easier than "10 flashes"
- On Impossible the flashes are 170ms — don't blink during the show phase, literally

### 12. Minesweeper 💣
Dig all safe cells without hitting a mine. Numbers show how many mines touch that cell.

**Controls:** tap to dig. Long-press (or the Flag button) to mark a mine.

**Walkthrough:**
- Your first dig is always safe — and its neighbors too, so open boldly to start
- If a number equals its count of hidden neighbors, all of them are mines — flag them
- If a number equals its count of *flagged* neighbors, every other hidden neighbor is safe — dig them
- Corners are the safest digs statistically; center cells have up to 8 neighbors
- On Impossible (11x11, 24 mines) flag early and often — the density is ~20%, pure guessing loses

### 13. Hangman 🪢
Guess the hidden word one letter at a time before the figure completes.

**Controls:** tap letter keys.

**Walkthrough:**
- Always start with vowels-in-order: E, A, O, I — consonant-first guessing wastes misses
- Then common consonants: T, N, S, R, H, L
- Watch word length: 5-letter words with no E are usually GHOST/WEIRD/WORDY types
- On Impossible you get only 4 misses and words like RHYTHM and SYNDROME — vowel coverage barely helps there; guess by word shape and letter frequency in *English overall*, not vowels

### 14. Pong 🏓
Classic paddle duel vs the CPU. First to 7 points wins.

**Controls:** drag on the board or arrow keys.

**Walkthrough:**
- Hit the ball with the paddle's edge to add spin — edge hits angle the ball sharply
- The ball speeds up on every paddle hit, so long rallies end in fast kills; keep your returns angled
- The CPU paddle tracks the ball at a fixed speed — on Impossible (7.6px/frame) it barely misses, so you must win with angles, not raw speed. Aim fast balls at the far corner just as it commits

### 15. Connect Four 🔴🔵
Drop discs, line up 4 in a row (any direction) before the CPU does.

**Controls:** tap a column.

**Walkthrough:**
- The center column is the most valuable square on the board — it touches the most 4-in-a-row lines. Take it early, contest it always
- Build "double threats": two intersecting lines of three that share no single blocking square. When you have one, you win next turn no matter what
- Odd/even threat counting: with perfect play the first player wins by creating threats on *odd* rows. In practice: put your horizontal threats on rows 1 and 3
- On Impossible the CPU searches 4 moves deep and will punish any unforced move — play center, never voluntarily fill a cell directly below a CPU win-square

### 16. Lights Out 💡
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

### 17. Reaction Test ⚡
The panel is red — wait. The instant it turns green, tap. Sets of runs (3 on Easy, 5 Medium/Hard, 7 Impossible), with best time and average tracked.

**Controls:** tap the panel.

**Walkthrough:**
- Don't stare at the panel — peripheral vision reacts just as fast and is less prone to anticipatory tapping
- The green appears between 0.7s and 4s after the red shows. On Hard+ the window is shorter, and tapping early FAILS the whole set — stay honest
- Human average is ~250ms; under 200ms is excellent. If you're "getting" 120ms consistently, you're guessing the timing, not reacting

### 18. Dodger 🚀
Drag your block to dodge falling red blocks. Every block that passes scores. Speed and spawn rate ramp up with score.

**Controls:** drag on the board (or mouse).

**Walkthrough:**
- Stay near the center horizontally — it keeps both escape routes open; wall-hugging leaves you one
- Watch the *gap*, not the blocks: position yourself where the next opening will be, not where the current one is
- Move early and small — late large movements trap you between spawns
- On Impossible (5.5 base speed) the safe window is tiny; prioritize distance from all blocks over ideal position

### 19. Tetris 🧱
The classic: rotate and place falling pieces, fill rows to clear them. Pieces come from a 7-bag (fair random), speed ramps every 10 lines, and the scoring ladder is 100/300/500/800 for 1/2/3/4-line clears.

**Controls:** the 5 on-screen buttons, or arrow keys (Up = rotate, Down = soft drop, Space = hard drop).

**Walkthrough:**
- Keep the stack FLAT — height is danger, holes are death. A single hole in the middle of your stack can take 20+ pieces to fix
- Save the I-piece (cyan) for 4-line clears ("Tetris"): keep one column open at the wall and drop the I vertically into it for 800 points
- Hard-drop (Space) for speed points, but only when the placement is certain — 2 points per row is nothing compared to a misdrop
- On Impossible (230ms base drop) use hard drop almost exclusively; there's no time for soft adjustments after row 30

### 20. Sliding Puzzle 🔢
Slide tiles into numerical order, 1 to N². The grid grows with difficulty: 3x3 (8-puzzle) up to 6x6 (35-puzzle).

**Controls:** tap any tile adjacent to the gap.

**Walkthrough:**
- Solve row by row, then column by column: position tiles 1..N of the top row, then the first column of what remains, and recurse on the smaller grid
- The classic trap: the last two tiles of a row can end up swapped. Fix it by parking them in the NEXT row's corner slots and rotating them in together
- 3x3 is solvable in under 31 moves always; if you're stuck, re-solve the top row from scratch rather than shuffling randomly
- On Impossible (6x6, 35 tiles) expect hundreds of moves — solve the top row and left column completely before touching the interior

### 21. Math Blitz ➕
60 seconds (45 on Impossible), one sum at a time, 4 answer buttons. Wrong answers cost time.

**Controls:** tap the correct answer.

**Walkthrough:**
- Read the OPERATOR first, then the numbers — under time pressure your brain defaults to addition
- For subtraction, check the options: if the answer feels >10 away, you misread the operator
- On Hard+, multiplication up to 12x12 and division appear — know your squares cold (they cover most of the table)
- Impossible adds ÷ with two-digit operands (it's always exact) and a 5-second penalty per miss: accuracy beats raw speed there

### 22. Space Invaders 👾
Drag your ship (auto-firing) and clear alien waves. The fleet marches faster as it shrinks and as waves advance. Aliens reaching the bottom, or losing all lives, ends the run.

**Controls:** drag on the board, or arrow keys.

**Walkthrough:**
- Kill from the EDGES of the fleet first — fewer aliens at the wall means slower marching (the fleet speeds up as it shrinks)
- Never sit directly under the fleet's center: that's where bomb density is highest. Patrol under the edge columns
- Waves start lower each time (up to a limit), so clear fast in early waves to bank lives
- On Impossible (40 aliens, 1 life, bombs every 450ms) play the margins exclusively and let auto-fire do the work — every extra second under the fleet is a coin flip

### 23. Mastermind 🎨
Crack the hidden colour code. Each guess gets feedback: a black dot per peg that's the right colour in the right spot, a white dot per right colour in the wrong spot. Code lengths, colour counts, and allowed guesses scale with difficulty (up to 5 pegs / 8 colours / 6 guesses).

**Controls:** tap a hole to cycle its colour, then Check.

**Walkthrough:**
- Open with a two-colour guess (e.g. A A B B). The black+white total tells you how many of those two colours are in the code — maximum information per guess
- Track eliminations religiously: every peg you know is NOT in the code removes candidates from every position
- Use "sacrifice rows" mid-game: a guess you know is wrong can still confirm exact positions via its black dots
- Count dots before you guess: black+white can never exceed the code length, and duplicates in the code are possible (but not forced) — assume no duplicates until feedback contradicts you

### 24. Reversi (Othello) ⚫⚪
Classic Othello on an 8x8 board vs the CPU. Place a disc to flank a line of enemy discs — the whole line flips to your colour. Most discs when the board fills wins.

**Controls:** tap any dotted cell (legal moves are marked).

**Walkthrough:**
- Corners are everything: a disc in a corner can never be flipped. Every move that gives the CPU a corner is a gift
- Early game: fewer discs is often BETTER (fewer flipping targets). Don't greedily flip everything
- Avoid the squares adjacent to corners (X-squares and C-squares) unless the corner is already taken or unplayable
- Force passes: if the CPU has no legal move it must pass and you move again — hoard mobility (many legal moves) and starve theirs
- On Impossible the CPU searches 3 moves deep — play the long game: mobility and edges over raw count

### 25. Dots & Boxes ⬜
Take turns drawing lines between dots. Complete a box to claim it and take another turn. Most boxes wins.

**Controls:** tap any undrawn line.

**Walkthrough:**
- The core skill is the **chain rule**: never open a chain of 3+ boxes. Take free boxes, but leave the *last two* of a long chain (double-cross) — you sacrifice 2 boxes but hand the next chain to your opponent
- Count chains late-game: if you can force the opponent to open every chain, you win. If you must open one, open the shortest
- The CPU on Hard/Impossible knows the double-cross too — you must count along with it
- Early game: draw edges that can't complete anything (third sides of boxes are safe; fourth sides are gifts)

### 26. Battleship 🚢
7x7 grids, hidden fleets of 4+3+3+2 cells. Fire at the enemy grid; sink all four ships before the CPU sinks yours.

**Controls:** tap enemy cells to fire.

**Walkthrough:**
- Ships NEVER touch each other (not even diagonally) — every confirmed hit means the 8 surrounding cells are water. Mark them mentally as free misses
- After a hit, fire adjacent cells to determine orientation; once you know the direction, finish the ship before hunting elsewhere
- Hunt in a checkerboard pattern (every 2nd cell) — the smallest ship is 2 long, so a diagonal scan guarantees finding everything
- On Hard+ the CPU fires parity shots too and hunts your wounded ships efficiently — spread your fleet out when placing (well, mentally: your fleet is auto-placed, but the CPU's parity hunting means don't rely on luck)

### 27. Sokoban 📦
Push crates onto gold goals. One level per difficulty, hand-designed and solver-verified.

**Controls:** D-pad, swipe on the board, or arrow keys.

**Walkthrough:**
- The #1 rule: never push a crate into a corner — it can never leave. Before pushing, check the destination has an escape route
- Think backwards from the goals: which crate goes where? Solve the farthest-from-goal crates first
- If stuck, use New to reset — Sokoban states are rarely recoverable once a crate is parked wrong
- Levels are solver-verified solvable (easy in 7 moves, medium 9, hard 24, impossible 20) — a solution always exists, count your moves against those targets

### 28. Maze Escape 🌀
A freshly generated perfect maze (exactly one path between any two cells) each time. Reach the gold exit square at the bottom-right.

**Controls:** D-pad, swipe, or arrow keys.

**Walkthrough:**
- Perfect mazes = tree structure: the direct path is unique, so wall-following (always keep one hand on a wall) will always reach the exit eventually
- Faster method: at each junction prefer the direction that still descends toward the bottom-right corner; backtrack when you hit a dead end (you'll feel the "wrong turn" as extra walls)
- Grid sizes: 8x8 easy up to 20x20 impossible. On 20x20 the solution path is typically 30-60 cells — time and moves are both tracked, best time saved per size

### 29. SameGame 🎨
Tap groups of 2+ same-coloured tiles to remove them. Tiles fall down, columns close left. Bigger groups score exponentially: a group of n scores (n-2)².

**Controls:** tap a group.

**Walkthrough:**
- Score math dominates: a group of 10 = 64 points, but two groups of 5 = 9+9. NEVER split big groups — build them first
- To build: clear the "rubble" around a big cluster so it connects when columns shift
- Plan for the endgame from move one: identical colours in the same column tend to merge when things fall — arrange columns to be single-coloured
- Clearing the whole board is +1000 — on Impossible (12x12, 6 colours) perfect clears are rare; aim to leave under 10 tiles

### 30. Word Scramble 🔤
Unscramble words against the clock. Tap letters in order to fill the slots; tap a filled slot to return a letter. Skip costs 3 seconds.

**Controls:** tap letters.

**Walkthrough:**
- Scan for common endings first: -ING, -TION, -ER, -ED. Slot them at the right side and work backwards
- Vowel placement narrows everything: count vowels and imagine the consonant skeleton around them
- Wrong full guesses are free (you can just re-tap), so commit to a hypothesis instead of staring
- Word pools scale from 3-letter (Easy) to 9-letter adventures like XYLOPHONE (Impossible) — on the big ones, find the rare letters (X, Z, Q, V) first; they anchor the word

### 31. Rock Paper Scissors ✊✋✌️
Best-of-5 (first to 3) vs an AI that studies you.

**Controls:** tap rock, paper, or scissors.

**Walkthrough:**
- Humans are terrible randomness generators: we avoid repeating, we favour certain throws, we "balance" patterns predictably. The AI exploits exactly this
- Easy AI is near-random — just play. Impossible AI tracks your last-2-move patterns and counters your most likely next throw
- To beat it: deliberately break your own habits. If you notice you throw rock after losing a round, do the opposite. Or truly randomize with an external anchor (e.g. alternate based on the second hand of a clock)
- The counter chain: if it played paper last and you expect it to react to your rock... think one level deeper than feels natural, then stop — overthinking is also a pattern

### 32. Stroop Test 👀
A colour word (e.g. "RED") shown in a different ink colour. Normally you tap the INK colour — but on Hard+ the rule can flip to WORD MEANING without much warning. Watch the rule banner.

**Controls:** tap the matching answer button.

**Walkthrough:**
- Reading is automatic; naming ink colour isn't. That lag is the whole test — don't try to "not read", you can't. Instead, defocus your eyes slightly and see the word as a coloured blob
- On Hard+ read the rule banner with your peripheral vision BEFORE looking at the word — the flip is announced by the banner changing
- When the rule is WORD, say the word silently and ignore the ink entirely; switching mental modes quickly is the actual skill
- Wrong answers cost 2 seconds, so on Hard+ speed without verification is negative EV — half a second of rule-check beats a 2-second penalty

### 33. Aim Trainer 🎯
Tap the shrinking target. 30 seconds, targets get smaller/faster/shorter-lived as difficulty rises (they even move on Hard+).

**Controls:** tap the target.

**Walkthrough:**
- Aim with your eyes: look AT the target centre, not at where your finger is. Finger follows eye
- Don't chase the target's edge — the whole circle counts, so tap the moment your fingertip is anywhere inside
- On Hard+, targets drift: lead them slightly, aiming where the centre will be at tap-time
- Misses cost 1 second each — spam-tapping is punished. On Impossible (15px targets living 1s while moving) accuracy IS speed

### 34. Flood-It 🌊
The top-left region is yours. Tap colours to flood it across the board before the move counter runs out.

**Controls:** tap a colour swatch.

**Walkthrough:**
- Count tiles, not vibes: each move should grow your region by the largest blob touching your frontier
- Never waste a move on a colour that touches a single thin edge — you have fewer moves than colours on Hard+
- The endgame is usually forced: alternate between the two biggest remaining blobs
- 6x6 with 3 colours on Easy; 12x12 with 6 colours in 32 moves on Impossible

### 35. Sudoku
The classic 9x9 logic grid. Every puzzle is machine-verified to have exactly one solution.

**Controls:** tap a cell, then tap a digit to place it. ⌫ clears the selected cell (given digits can't be changed).

**Walkthrough:**
- Start with 'singles': cells where only one digit fits. Then scanning: a digit that has only one legal box in a row or column
- Red digits mark conflicts — fix them immediately, they snowball
- When stuck, don't guess: re-scan every box for a digit that appears only once in that box's row or column
- Easy gives 41 starting digits; Impossible only 24, and best time is tracked per level

### 36. Hanoi Towers
Restack every disk on the right peg. One disk at a time, and a bigger disk can never sit on a smaller one.

**Controls:** tap a peg to lift its top disk, tap another to drop it. Tap the same peg again to cancel.

**Walkthrough:**
- Think recursively: to move n disks to the right peg, first move the top n-1 out of the way to the middle, then the big disk, then bring the n-1 on top
- Minimum moves is 2^n − 1: 7 for 3 disks (Easy) up to 63 for 6 (Impossible)
- An illegal drop buzzes and refuses — this game never lets you break the rules
- Best move count is saved per disk count; matching 2^n − 1 gets you "PERFECT!"

### 37. Pipe Flow
Tap pipes to rotate them. Build a continuous path from the green source (top-left) to the gold drain (bottom-right).

**Controls:** tap a pipe.

**Walkthrough:**
- Only pipes connected to the source glow green — build outwards and trust the glow
- Work from the source toward the drain; solving from both ends at once creates dead ends
- A pipe pointing into the border or into a wall can never be part of the path — rotate it away
- Grids grow from 5x5 to 8x8; best (fewest) turn count is saved per size

### 38. Gomoku
Five stones in a row — horizontal, vertical or diagonal — beats the CPU. You're blue, it's red.

**Controls:** tap any empty cell to place your stone.

**Walkthrough:**
- The winning pattern is a double threat: two open lines of three that can't both be blocked
- Answer every CPU open three immediately; single lines are how games get lost
- Build around the centre early; edge lines have fewer directions to grow
- On Impossible the CPU plays a clean, tireless evaluation — beat it with double threats, never single threats

### 39. Blackjack
Beat the dealer to 21 without going over. Deal pays out, Hit takes a card, Stand passes. Blackjack pays 15.

**Controls:** Deal / Hit / Stand buttons.

**Walkthrough:**
- Basic strategy: stand on 12-16 when the dealer shows 2-6, hit everything else below 17, and always hit 11 or less
- The dealer must draw to 17 (and hits soft 17 on Hard+) — that's why standing on a bad hand is often right
- Chips carry across rounds; if you drop below 10, press New to rebuy at the difficulty's starting stack
- Best chip count is saved per difficulty — Easy starts you with 200, Impossible with 20

### 40. Dash Runner
Endless sprint. Tap to jump the blocks; the track speeds up with distance.

**Controls:** tap the track, or Space / ↑.

**Walkthrough:**
- Jump late: clipping a block by a pixel counts as clear, and landing sooner means jumping again sooner
- Watch the track a third of the way ahead of the runner, not the runner itself
- There's no duck — a single clean jump beats a panic double-tap every time
- Speed ramps on every level; Impossible starts fast and doesn't stop getting faster

### 41. Hopper
Cross the traffic to the top row, then do it again — and again, faster each time.

**Controls:** D-pad, swipe on the board, or arrow keys.

**Walkthrough:**
- Never stand still in a lane: move in the gaps, scan two lanes ahead
- The median rows have no traffic — they're your only safe squares mid-board
- Each crossing speeds the cars up; build a rhythm of dash-to-median, wait, dash
- Impossible gives you 2 lives and doubles the traffic density

### 42. Block Stacker
A block slides back and forth over the tower. Drop it — anything hanging over the edge gets sliced off.

**Controls:** tap the board, or Space.

**Walkthrough:**
- Judge the block's left edge against the stack's left edge, not the middle — wide blocks hide the centre
- A perfect drop keeps the full width; chain a few and the tower stays generous
- When the block gets narrow, a small error slices a big fraction — aim with the near edge, not the centre
- Every new block moves faster than the last one — re-learn the timing each drop

### 43. Match Three
Swap neighbouring gems to line up 3 or more. Cascades chain for multiplied score. You only get so many moves.

**Controls:** tap two neighbouring gems to swap — only swaps that create a match are kept.

**Walkthrough:**
- Hunt 'one-move setups': two gems in a row with a matching third gem adjacent to either end
- Cascades multiply points per chain step — a board dense in one colour near the bottom is a jackpot
- Play the low rows: gravity refills from the top and often lines up new matches for you
- The board reshuffles itself when no move exists; your real clock is the move budget (25 on Easy, 15 on Impossible)

### 44. Nonogram 🧩
A picross logic grid. Numbers on each row and column tell you how many consecutive cells are filled. Fill the correct cells to reveal the picture.

**Controls:** tap a cell to fill it, tap again to mark it as empty (X).

**Walkthrough:**
- Start with rows or columns whose clue equals the grid size — the whole line fills
- A clue of "1" in a short line means the middle cells are safe to cross out
- Add up clues with gaps: for "4 2" on a 10-wide row, the blocks can slide — overlap the extremes to find cells that are always filled
- Work the big numbers first; they constrain the most
- Every puzzle is generated from a random solution, so it always has a valid fill

### 45. Wordle 🟩
Guess the hidden word. Each guess colours letters: green = right letter, right spot; yellow = in the word, wrong spot; grey = not in the word.

**Controls:** tap on-screen letter keys, then Enter. ⌫ deletes.

**Walkthrough:**
- Open with a word rich in common letters and vowels (CRANE, SLATE, ADIEU)
- Green letters are locked — keep them in place on every guess
- Use yellows to rearrange: the letter is in the word but not that column
- Grey letters are eliminated — never reuse them
- On Impossible you get only 4 guesses for 7-letter words, so make every guess count

### 46. Checkers ♟️
Classic draughts vs the CPU on an 8x8 board. Jumps are forced — if you can capture, you must. Reach the far row to crown a king, which moves backwards too.

**Controls:** tap a piece, then tap a highlighted destination.

**Walkthrough:**
- Forced jumps are the core tactic: bait the CPU into a position where you can chain multiple captures
- Sacrifice a single piece to set up a double or triple jump
- Keep your back row intact as long as possible — holes there let the CPU crown kings
- Kings are powerful but exposed; trade them only when you win material
- On Impossible the CPU searches 4 moves deep — count the jumps before you commit

### 47. Mancala 🌰
Kalah: sow stones counter-clockwise, one per pit. Land in your store to go again; land in an empty pit on your side to capture. Most stones in your store wins.

**Controls:** tap one of your six pits to sow its stones.

**Walkthrough:**
- Ending on your store gives a free turn — set up moves that land there
- The capture rule (empty pit + opposite pit has stones) swings big swings; guard your empty pits
- Count ahead: a pit with N stones moves N+1 spaces, so plan the landing spot
- Empty your rightmost pit early to chain free turns
- On Impossible the CPU looks 4 plies ahead and will punish greedy captures

### 48. Flow Free 🔗
Connect matching colour pairs with pipes that fill every cell. Pipes can't cross or overlap.

**Controls:** drag from one dot to its matching dot.

**Walkthrough:**
- Start with the pairs that have the fewest open paths — corners and edges first
- A straight line between two close dots is almost never right; route around to fill space
- If a colour is boxed in, every cell it can reach must belong to it — trace the boundary
- Don't leave gaps: a solved board has zero empty cells
- Grids grow from 4x4 (3 pairs) to 7x7 (6 pairs); on the big ones, plan the middle colours before the edges

### 49. Typing Test ⌨️
Type the shown word as fast as you can. A new word appears each time. Your WPM and accuracy are tracked for the round.

**Controls:** type on the keyboard (on-screen input is shown).

**Walkthrough:**
- Keep your fingers on the home row — look at the word, not your fingers
- Accuracy matters as much as speed: typos cost time and drop your WPM
- On higher difficulties the words get longer (up to 8 letters) and the clock shrinks to 20s
- Rhythm beats sprinting: a steady pace with no errors outscores frantic typing
- Best WPM is saved per difficulty

### 50. Air Hockey 🏒
Pong's air-hockey cousin. First to 7 goals wins. Drag your mallet to defend your goal and smack the puck past the CPU.

**Controls:** drag on the table, or move the mouse.

**Walkthrough:**
- Stay between the puck and your goal — angle your mallet to deflect shots
- Hit the puck with the mallet's edge for sharp angles; centre hits are weak
- The CPU anticipates straight shots, so bank off the walls to wrong-foot it
- On Impossible the CPU mallet moves at 6.4px/frame — you must score with angles, not speed
- Don't chase the puck into your own half; a pulled-back mallet covers more goal

### 51. Slots 🎰
Three reels, seven symbols. Match three of a kind to win. Bigger matches pay more; three 7s jackpot.

**Controls:** tap Spin.

**Walkthrough:**
- It's pure chance — the reels are fair and independent every spin
- The payout table is fixed: three of a kind pays by symbol rarity, 7-7-7 is the jackpot
- On Impossible you start with 20 coins and payouts are tighter, so runs are short
- Set a loss limit before you spin; the house edge always wins long-term
- Best coin count is saved per difficulty

### 52. Quiz 🧠
Timed trivia. Four options, one correct. Score grows with streaks; wrong answers reset the streak.

**Controls:** tap an answer.

**Walkthrough:**
- Read all four options before answering — the obvious one is often a trap
- On Easy the pool is general knowledge; Impossible pulls from science, history and geography with less time
- Eliminate two wrong answers and guess — a blank scores nothing
- Streaks multiply your points, so accuracy beats speed
- Best score is saved per difficulty

### 53. Bubble Shooter 🫧
Aim and fire coloured bubbles into the cluster. Three or more of a colour pop. The cluster descends every few shots; if it crosses the line, it's over.

**Controls:** tap the table to aim and fire (or move the mouse and click).

**Walkthrough:**
- Bank shots off the walls to reach bubbles tucked behind others
- Pop clusters, not stragglers — dropping a whole connected group scores far more
- Watch the descent counter: every few shots the ceiling drops one row
- On Impossible the cluster starts 6 rows deep and falls fast — clear the bottom first
- Best score is saved per difficulty

### 54. Chess ♞
The royal game against a minimax CPU. Every rule is in: castling, en passant, promotion, check, stalemate and insufficient-material draws.

**Controls:** tap a piece, then a highlighted square. Pawns promote to queens automatically.

**Walkthrough:**
- Control the centre early — pawns and knights gain reach there
- Develop your knights and bishops before moving the queen twice
- Castle in the first few moves; a tucked-away king survives longer
- Selected pieces glow gold: green dots are moves, red rings are captures
- On Impossible the CPU searches 4 plies deep — trade pieces when you're ahead in material, keep tension when behind
- Draws come from stalemate, bare kings (K-K, K+minor) or 75 moves without a capture or pawn move

### 55. Solitaire ♠
Klondike: sort all 52 cards onto the four foundations, Ace to King by suit.

**Controls:** click the stock to deal, tap a card then its destination, double-tap to send a card to the foundations.

**Walkthrough:**
- Flip the deep face-down stacks first — revealed cards are your move supply
- Empty a column on purpose to park a King and free buried cards
- On Hard+ the stock deals 3 at a time; cycle it once before committing
- Impossible gives a single redeal: work the waste before recycling
- Don't rush Aces up; low cards are more useful in the tableau

### 56. Mahjong 🀄
Match free pairs of identical tiles until the whole stack is gone.

**Controls:** tap a free tile, then tap its match. Tiles that aren't free are dimmed.

**Walkthrough:**
- Clear from the top layers first — covering tiles block everything below
- Edge tiles are precious: the last tiles of a row are the only reachable ones
- Tap Hint when stuck, tap Shuffle when no moves remain at all
- The three coloured suits share numerals — match colour AND glyph
- Impossible stacks 144 tiles in 4 layers; clear symmetrically so you don't strand singles

### 57. Bowling 🎳
Ten frames of drag-and-release bowling with real pin physics.

**Controls:** drag back from the ball to set the angle and power, release to throw.

**Walkthrough:**
- A straight centre ball leaves splits; a little angle pockets the head pin
- The aim line shows the shot, longer drags mean more power
- On harder levels the ball hooks back toward the centre — aim wider to compensate
- Strikes and spares count bonus balls, and the 10th frame can hold three balls
- A ball that crosses into the gutter is lost — no saving it

### 58. Mini Golf ⛳
Nine holes of drag-and-release putting with wall bounces.

**Controls:** pull back from the ball to aim and set power, release to putt.

**Walkthrough:**
- Bank shots are part of the design: walls reflect the ball, so plan angles
- The ball must be slow to drop in the cup — full-speed putts roll straight over
- Shallow-angle hits glide; steep hits waste energy
- Early pars are generous; Impossible picks the trickiest 9 of the 12 layouts
- There is no out-of-bounds — a bad bounce is only a stroke, not a penalty

### 59. Fruit Slash 🍉
Slice the flying fruit before it falls; one touch of a bomb ends the run.

**Controls:** swipe across the fruit; keep the blade moving.

**Walkthrough:**
- Long arcs catch several fruit — three inside a second score combo bonuses
- Read the launch arcs and pre-empt where fruits will cross
- Bombs are dark with a red fuse: never let your blade near one
- A fruit past the bottom costs one of your three lives
- Impossible throws fruit nearly twice as fast — short swipes beat big wind-ups

### 60. Rhythm Tiles 🎵
Piano tiles with an accelerating beat: tap each tile as it crosses the line.

**Controls:** tap the lane on the board, or press keys D F J K.

**Walkthrough:**
- Look a tile or two ahead — eyes lead the fingers
- The hit zone glows green; any tile inside it is fair game
- The beat speeds up continuously, so early accuracy buys calm
- One missed tile (or an empty tap) ends the run — don't panic-tap
- Combos raise the blip's pitch; use the audio as your metronome

### 61. Yahtzee 🎲
Thirteen turns of rolls and keeps against the full scorecard.

**Controls:** tap Roll, tap dice to keep them, then tap a category to score it.

**Walkthrough:**
- Feed the upper section: six categories earn the 63-point +35 bonus
- Extra Yahtzees after the first pay +100 each — save the field for the right roll
- A run of four is a Small Straight (30); keep runs over pairs
- Chance accepts anything — save it for garbage rolls like 2-2-3-5-6
- Hard gives only 2 rolls and Impossible 1: keep what you can, score the best fit

### 62. Roulette 🎡
European single-zero: bet numbers, colours, dozens, columns or halves.

**Controls:** pick a chip, tap a bet, Spin. Clear refunds all bets before the spin.

**Walkthrough:**
- Straight numbers pay 35:1 but land 1 time in 37; colours and halves are coin flips
- Zero is green and loses every outside bet — that's the house edge
- Dozens and columns pay 2:1 and cover 12 numbers each
- Coins carry between rounds and sessions; New restores the stake if you bust
- Impossible starts you with just 100 chips — bet small or go out fast

### 63. Word Search 🔤
Find every hidden theme word in a grid of letters.

**Controls:** drag from the first letter to the last, release to lock the word in.

**Walkthrough:**
- Words run in any direction, backwards included — check both senses of a line
- The theme matters: knowing it primes your eyes for likely words
- Found words stay highlighted and the word list strikes them through
- Hard and Impossible use all 8 directions on bigger grids
- The selection only changes on a straight line — re-drag from the anchor if it slips

---

## Tech Notes

- Three vanilla files, zero dependencies, ~280KB total. Works offline forever once downloaded
- Touch-first (mobile), with keyboard support on desktop (arrows/Space)
- Best scores persist in localStorage per browser
- Sounds are synthesized with the Web Audio API — no audio files
