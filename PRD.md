# GameBox — Product Requirements Document

- **Product:** GameBox (repo: `AuthenticCaesarSalad/HTMLGame`, single file `GameBox.html`)
- **Status:** implemented — this PRD covers the "10 new games" release (40 → 50 games)
- **Owner:** Bayu
- **Last updated:** 2026-10-14

## 1. Summary

GameBox is a single, self-contained HTML file containing a collection of complete,
offline, instant-play games. This release adds **10 new working games** to the
existing 40, taking the collection to **50 games**.

Note on counts: the shipped file contained **40** games (verified: 40 menu cards
before this change); the README said "40" and is corrected to **50**.

## 2. Product goals

1. Add 10 new games that are actually playable and finished — not demos.
2. Keep every existing game working exactly as before (no regressions).
3. Fit the existing architecture and conventions (see §5), with no new runtime
   dependencies and no build step.
4. Cover genres the collection was missing: picross logic, word-guessing,
   classic board games (checkers, mancala), a connection puzzle, a skill/typing
   game, air-hockey arcade, casino, trivia, and a bubble-shooter.

## 3. Non-goals (this release)

- No multiplayer, no online features, no accounts, no analytics.
- No framework, bundler, or external assets (images/fonts/audio files).
- No changes to the visual identity, difficulty system, or navigation model.
- No redesign of the existing 40 games.

## 4. Constraints & invariants (must hold)

| # | Constraint |
|---|---|
| C1 | One file (`GameBox.html`). No external requests at runtime; works offline. |
| C2 | ES5-style inline JS (no modules, no arrow functions / let / const / template literals) to match the file; modern-browser DOM/CSS features only as already used (`aspect-ratio`, `clamp`, etc.). |
| C3 | Touch-first controls; every game must be playable by tap/drag/swipe on a phone, with keyboard equivalents where meaningful on desktop. |
| C4 | All four difficulty levels (Easy / Medium / Hard / Impossible) must have a defined, sensible effect on every game, wired through the shared `DP` table. |
| C5 | Best scores persist in `localStorage` (namespaced `gb_<game>_...`), degrade silently when unavailable. |
| C6 | Each game exposes: a menu card, an active `#id` screen, HUD stats, a `New`/`Start` button, a hidden banner element, and a one-line hint. |
| C7 | Timed/animated games must register a `stopFns.<game>` cleanup so leaving the screen stops loops/timers. |
| C8 | Layout stays within the existing ~520px sheet, reuses existing CSS classes where possible. |

## 5. Required conventions per game (acceptance-level)

- Menu card: `<button class="game-card" data-game="KEY">` with icon + name + desc.
- Screen: `<div id="KEY" class="screen">` containing a `.hud` (stat blocks + button),
  the play area, `.banner`, and a `.sub-hint` line.
- JS: one `(function(){ ... })();` block, `reset()` on load and on `New/Start`,
  `banner()/hideBanner()` for outcomes, `beep()` for feedback, `lsGet/lsSet` for bests.
- Difficulty read via `DP.KEY[diff()]` at reset time.
- Zero uncaught errors at runtime on all 4 difficulties.

## 6. The 10 new games (requirements)

| # | Key | Name | Genre | Difficulty axis |
|---|-----|------|-------|-----------------|
| 41 | `nono` | Nonogram | logic/picross | grid size (5x5 → 10x10) |
| 42 | `wordle` | Wordle | word | word length (4 → 7), guesses (6 → 4) |
| 43 | `checkers` | Checkers | board vs CPU | AI search depth (1 → 4) |
| 44 | `mancala` | Mancala | board vs CPU | AI strength (random → 4-ply) |
| 45 | `flow` | Flow Free | puzzle | grid size (4x4 → 7x7), pairs (3 → 6) |
| 46 | `type` | Typing Test | skill | time (60s → 20s), word length |
| 47 | `hockey` | Air Hockey | arcade vs CPU | CPU mallet speed (3.2 → 6.4 px/frame) |
| 48 | `slots` | Slots | casino | starting coins, payout tightness |
| 49 | `quiz` | Quiz | trivia | time per question (20s → 8s), pool hardness |
| 50 | `bubble` | Bubble Shooter | arcade puzzle | starting rows, descent speed |

Per-game behaviour requirements (verified, see §8):

- **Nonogram** — row/column clues; tap a cell to fill, tap again to mark X;
  win when the fill matches the hidden solution. Timer + best time per
  difficulty.
- **Wordle** — guess the word in N tries; green/yellow/grey feedback per
  letter; win = exact match, lose = out of guesses. Best = fewest guesses
  per difficulty.
- **Checkers** — 8x8 draughts with forced jumps and kings on the far row;
  win = capture all CPU pieces or block them. Win/loss/draw tracking like
  Tic-Tac-Toe.
- **Mancala** — Kalah rules: sow counter-clockwise, free turn on the store,
  capture on an empty pit; most stones in the store wins. Win/loss/draw
  tracking.
- **Flow Free** — drag to connect matching colour pairs, fill every cell, no
  crossings; win = all pairs connected with zero empty cells. Best = fewest
  moves per difficulty.
- **Typing Test** — type the shown word, a new word appears on each correct
  entry; WPM + accuracy reported for the round. Best WPM per difficulty.
- **Air Hockey** — drag the mallet, first to 7 goals; puck physics with wall
  bounces; win/lose tracking, best = fewest goals conceded.
- **Slots** — 3 reels, 7 symbols, match-3 payouts, 7-7-7 jackpot; coins
  persist per session; best coin count per difficulty.
- **Quiz** — timed 4-option trivia with a streak multiplier; best score per
  difficulty.
- **Bubble Shooter** — aim and fire, 3+ of a colour pop, the cluster descends
  every few shots; lose if it crosses the deadline. Best score per difficulty.

## 7. Documentation deliverables

- `README.md` updated: title/body counts corrected to 50, walkthrough
  sections 41–50 added, difficulty highlights extended.
- This PRD committed at the repo root.
- `dev/smoke.mjs`: extended from the 40-game version to cover all 50 games
  (see §8).

## 8. Verification & QA

1. **Syntax:** inline script extracted and checked with `node --check` — passes.
2. **HTML structure:** parser check for tag balance — passes.
3. **Static checks:** 50 menu cards; every card has a matching screen id; all DOM
   ids unique; all 10 new keys present in the `DP` table.
4. **Headless E2E smoke** (`dev/smoke.mjs`, jsdom): extended from the 40-game
   version — loads the real file with a stubbed canvas, then for **all 50 games
   × all 4 difficulties** enters the game, presses its buttons, and drives input,
   with deeper checks for the new logic games:
   - Nonogram: the filled grid is compared against the hidden solution and the
     win banner asserted (proves generator + input + win path).
   - Wordle: green/yellow/grey feedback verified correct against the target word;
     both the win and out-of-guesses paths exercised.
   - Checkers / Mancala: legal-move validation (forced jumps, sowing rules) and a
     CPU reply after each player move.
   - Flow Free: connectivity check that all pairs are joined with no crossings
     and zero empty cells on the win path.
   - Slots: payout arithmetic validated across match-3 combinations and the
     7-7-7 jackpot.
   - Quiz: full answer flow — correct answer scores with streak multiplier,
     wrong answer handled, per-question timer enforced.
   - Bubble Shooter: shot fired, 3+ cluster pops, descent after N shots, lose
     condition at the deadline.
   - The 40 existing games keep their prior checks (Sudoku solved through the UI,
     Hanoi optimal solve, Match Three no-initial-matches + scoring swap,
     Blackjack two full rounds, etc.).
5. Re-run: `cd dev && npm i jsdom && node smoke.mjs ../GameBox.html`.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Single-file bloat (241KB → ~300KB) | ES5-compact code, shared CSS, no assets; still one file. |
| Generator performance on low-end phones | Nonogram and Wordle generation is bounded (grids ≤ 10x10, words ≤ 7 letters). |
| Difficulty holes (a game ignoring difficulty) | Every game reads `DP` at reset; smoke traverses all 4 levels for all games. |
| Regressions in the existing 40 games | Smoke covers all 50 games, every level, every run. |
| Silent JS errors | Smoke fails on any uncaught error or failed assertion. |

## 10. Out of scope / future ideas

- Multiplayer (hot-seat) mode, additional content packs per game.
- Persistent stats beyond best scores, achievements, themes.
