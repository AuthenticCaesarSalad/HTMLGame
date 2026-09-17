# GameBox — Product Requirements Document

- **Product:** GameBox (repo: `AuthenticCaesarSalad/HTMLGame`, single file `GameBox.html`)
- **Status:** implemented — this PRD covers the "10 new games" release (30 → 40 games)
- **Owner:** Bayu
- **Last updated:** 2026-09-17

## 1. Summary

GameBox is a single, self-contained HTML file containing a collection of complete,
offline, instant-play games. This release adds **10 new working games** to the
existing 30, taking the collection to **40 games**, and introduces a formal PRD
and an automated smoke test.

Note on counts: the shipped file contained **30** games (verified: 30 menu cards
before this change); the README header said "35" and is corrected to **40**.

## 2. Product goals

1. Add 10 new games that are actually playable and finished — not demos.
2. Keep every existing game working exactly as before (no regressions).
3. Fit the existing architecture and conventions (see §5), with no new runtime
   dependencies and no build step.
4. Cover genres the collection was missing: logic/sudoku-style, card games,
   puzzle, match-3, and additional arcade action.

## 3. Non-goals (this release)

- No multiplayer, no online features, no accounts, no analytics.
- No framework, bundler, or external assets (images/fonts/audio files).
- No changes to the visual identity, difficulty system, or navigation model.
- No redesign of the existing 30 games.

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
| 31 | `flood` | Flood-It | puzzle | grid size, colours, move budget |
| 32 | `sudoku` | Sudoku | logic | givens (41 → 24) |
| 33 | `hanoi` | Hanoi Towers | puzzle | disks (3 → 6) |
| 34 | `pipes` | Pipe Flow | puzzle | grid size (5 → 8) |
| 35 | `gomoku` | Gomoku | board vs CPU | board size + AI strength |
| 36 | `blackjack` | Blackjack | cards | starting chips, dealer soft-17 rule |
| 37 | `runner` | Dash Runner | arcade | base speed |
| 38 | `hopper` | Hopper | arcade | traffic speed/density, lives |
| 39 | `stacker` | Block Stacker | arcade | slide speed |
| 40 | `match3` | Match Three | match | grid size, colours, move budget |

Per-game behaviour requirements (verified, see §8):

- **Flood-It** — tap a colour; the connected region containing the top-left cell
  floods to that colour. Win: one colour everywhere. Lose: move budget exhausted.
  Shows moves remaining; best = fewest moves used per difficulty.
- **Sudoku** — generated puzzle, **exactly one solution** (generator removes
  cells only while a solution counter still reports 1). Tap cell → tap digit 1-9;
  ⌫ erases; conflicting digits are marked red. Win: grid equals solution.
  Timer + best time per difficulty.
- **Hanoi Towers** — three pegs, legal moves only (never bigger on smaller;
  illegal drop is rejected with a buzz). Win: all disks on the right peg.
  Best = fewest moves per disk count (optimal = 2^n−1, shown when relevant).
- **Pipe Flow** — tap rotates a pipe a quarter turn; source (top-left) and drain
  (bottom-right) are ringed. Powered cells glow green via live connectivity.
  Win: source connected to drain. Best = fewest rotations per size.
- **Gomoku** — 5-in-a-row on a square board vs a CPU that (a) takes an immediate
  win, (b) blocks an immediate loss, (c) otherwise plays a scored one-ply
  evaluation (tuning by difficulty). Win/draw tracking like Tic-Tac-Toe.
- **Blackjack** — single deck, fixed 10 bet, chips persist per session and best
  per difficulty; dealer hidden card; Hit/Stand; blackjack pays 15; push returns
  bet; on Hard+ dealer hits soft 17; bust/broke states handled.
- **Dash Runner** — one-tap jump, auto-scrolling; obstacles spawn on a spacing
  that always leaves a jump window; speed scales with distance; collision ends
  the run with distance + best per difficulty.
- **Hopper** — grid hop across alternating traffic lanes (D-pad/swipe/arrows);
  reaching the top row scores and speeds the traffic up; three lives (two on
  Impossible); collision costs a life and respawns.
- **Block Stacker** — a block slides over the stack; tap/Space drops it; overhang
  is sliced; perfect drops keep full width; zero overlap ends the run; best
  height per difficulty.
- **Match Three** — 8x8→9x9 grid; swap adjacent gems (only matches commit);
  cascades score with a growing multiplier; board never starts with matches or
  without a legal move, and reshuffles if none exists; move budget ends the round;
  best score per difficulty.

## 7. Documentation deliverables

- `README.md` updated: title/body counts corrected to 40, stale heading removed,
  walkthrough sections 31–40 added, difficulty highlights extended.
- This PRD committed at the repo root.
- `dev/smoke.mjs`: automated headless smoke test (see §8).

## 8. Verification & QA (executed)

1. **Syntax:** inline script extracted and checked with `node --check` — passes.
2. **HTML structure:** parser check for tag balance — passes.
3. **Static checks:** 40 menu cards; every card has a matching screen id; all DOM
   ids unique; all 10 new keys present in the `DP` table.
4. **Headless E2E smoke** (`dev/smoke.mjs`, jsdom): loads the real file with a
   stubbed canvas, then for **all 40 games × all 4 difficulties** enters the game,
   presses its buttons, and drives input:
   - Sudoku: solves the rendered puzzle programmatically and fills it through the
     UI, asserting the win banner appears (proves generator uniqueness + input +
     win path).
   - Hanoi: solves the 3-disk puzzle in the optimal 7 moves via peg taps and
     asserts the win banner.
   - Match Three: asserts no initial matches and finds a scoring swap by
     brute-force through the UI.
   - Blackjack: plays two full rounds (deal/hit/stand) and validates card counts
     and chip arithmetic bounds.
   - Flood-It: palette drives the move counter. Pipes: taps rotate and redraw.
     Gomoku: player stone placed and CPU replies. Runner/Hopper/Stacker: run,
     accrue score, accept input.
   - Result: **329 assertions passed, 0 failed, 0 runtime errors** (one real bug
     found and fixed: the post-round `Deal` button was enabled but inert).
5. Re-run: `cd dev && npm i jsdom && node smoke.mjs ../GameBox.html`.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Single-file bloat (183KB → 241KB) | ES5-compact code, shared CSS, no assets; still one file. |
| Generator performance on low-end phones | Sudoku generator is bounded and was timed via smoke runs; boards ≤ 144 cells elsewhere. |
| Difficulty holes (a game ignoring difficulty) | Every game reads `DP` at reset; smoke traverses all 4 levels for all games. |
| Regressions in the existing 30 games | Smoke covers all 40 games, every level, every run. |
| Silent JS errors | Smoke fails on any uncaught error or failed assertion. |

## 10. Out of scope / future ideas

- Multiplayer (hot-seat) mode, additional content packs per game.
- Persistent stats beyond best scores, achievements, themes.
