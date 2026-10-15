// dev/smoke.mjs — headless smoke test for GameBox.html (all games x all difficulties).
// Run: cd dev && npm i jsdom && node smoke.mjs ../GameBox.html
// Loads the page in jsdom with a stubbed 2D canvas, drives every game through
// entry / start / input paths, and fails on any runtime error or missing UI.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || path.join(here, "..", "GameBox.html");
const html = fs.readFileSync(file, "utf8");

const errors = [];
const fails = [];
let passes = 0;
function assert(cond, label) { if (cond) passes++; else fails.push(label); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeStub(calls) {
  const mk = () =>
    new Proxy(function () {}, {
      get(t, k) {
        if (typeof k === "symbol") return undefined;
        if (k === "width" || k === "height") return 0;
        return function () { calls[String(k)] = (calls[String(k)] || 0) + 1; return mk(); };
      },
      set() { return true; },
      apply() { return undefined; }
    });
  return mk();
}

const drawCalls = {};
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message + (e.detail ? " :: " + String(e.detail).slice(0, 300) : "")));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "http://localhost/",
  virtualConsole: vc,
  beforeParse(window) {
    window.HTMLCanvasElement.prototype.getContext = function () { return makeStub(drawCalls); };
    window.Element.prototype.getBoundingClientRect = function () {
      return { left: 0, top: 0, right: 360, bottom: 480, width: 360, height: 480 };
    };
    window.addEventListener("error", (e) => errors.push("window.error: " + (e.message || e.error)));
  }
});

const { window } = dom;
const doc = window.document;

function byId(id) { return doc.getElementById(id); }
function fire(el, type, props) {
  const ev = new window.Event(type, { bubbles: true, cancelable: true });
  if (props) Object.assign(ev, props);
  el.dispatchEvent(ev);
}
function touch(el, x, y) {
  fire(el, "touchstart", { touches: [{ clientX: x, clientY: y }], changedTouches: [{ clientX: x, clientY: y }] });
  fire(el, "touchend", { touches: [], changedTouches: [{ clientX: x, clientY: y }] });
}
function mouseDown(el, x, y) {
  el.dispatchEvent(new window.MouseEvent("mousedown", { clientX: x, clientY: y, bubbles: true, cancelable: true }));
}
function click(el) { if (!el) throw new Error("click on missing element"); el.click(); }
function txt(sel, root) { const el = (root || doc).querySelector(sel); return el ? el.textContent.trim() : ""; }
function num(sel, root) { return parseInt(txt(sel, root).replace(/[^0-9-]/g, ""), 10) || 0; }

async function enter(key) {
  click(doc.querySelector(`.game-card[data-game="${key}"]`));
  assert(byId(key).classList.contains("active"), `enter ${key}: screen active`);
}
function back() { click(byId("backBtn")); }

function boxOf(i) { return Math.floor(Math.floor(i / 9) / 3) * 3 + Math.floor((i % 9) / 3); }
// A few valid words per length (all present in the game's Wordle pools) for driving guesses.
const WORDLE_WORDS = { 4: ["COLD", "WARM", "GAME"], 5: ["CRANE", "SLATE", "ROAST"], 6: ["PLANET", "BRIDGE", "CASTLE"], 7: ["RAINBOW", "PYRAMID", "VOLCANO"] };
function solveSudoku(g) {
  const r = g.slice();
  const ok = (i, v) => {
    for (let k = 0; k < 81; k++) {
      if (k === i || r[k] !== v) continue;
      if (Math.floor(k / 9) === Math.floor(i / 9) || k % 9 === i % 9 || boxOf(k) === boxOf(i)) return false;
    }
    return true;
  };
  const rec = () => {
    const i = r.indexOf(0);
    if (i < 0) return true;
    for (let v = 1; v <= 9; v++) {
      if (!ok(i, v)) continue;
      r[i] = v;
      if (rec()) return true;
      r[i] = 0;
    }
    return false;
  };
  return rec() ? r : null;
}

async function generic(scr) {
  for (const b of scr.querySelectorAll(".hud button")) if (!b.disabled) b.click();
  const btns = [...scr.querySelectorAll("button")].slice(0, 30);
  for (const b of btns) if (!b.disabled) b.click();
  for (const cv of scr.querySelectorAll("canvas")) { mouseDown(cv, 120, 120); touch(cv, 200, 200); }
  await sleep(30);
}

async function exercise(key, scr, deep, diff) {
  if (key === "flood") {
    const pal = scr.querySelectorAll(".fl-btn");
    assert(pal.length >= 3, `flood palette (${pal.length})`);
    assert(scr.querySelectorAll("#flGrid .fl-cell").length > 0, "flood grid cells");
    const before = num("#flMoves", scr);
    pal[0].click();
    pal[pal.length - 1].click();
    assert(num("#flMoves", scr) < before, "flood moves decrement");
    return;
  }
  if (key === "sudoku") {
    const cells = [...scr.querySelectorAll("#sdGrid button")];
    assert(cells.length === 81, `sudoku 81 cells (got ${cells.length})`);
    const g = new Array(81).fill(0);
    cells.forEach((el, i) => { if (el.classList.contains("given")) g[i] = parseInt(el.textContent, 10) || 0; });
    const given = g.filter((v) => v > 0).length;
    assert(given >= 17, `sudoku givens>=17 (got ${given})`);
    let consistent = true;
    for (let i = 0; i < 81; i++) for (let k = i + 1; k < 81; k++) {
      if (!g[i] || g[i] !== g[k]) continue;
      if (Math.floor(i / 9) === Math.floor(k / 9) || i % 9 === k % 9 || boxOf(i) === boxOf(k)) consistent = false;
    }
    assert(consistent, "sudoku givens consistent");
    if (deep) {
      const full = solveSudoku(g);
      assert(!!full, "sudoku solvable from givens");
      if (full) {
        const pad = [...scr.querySelectorAll("#sdPad button")];
        for (let i = 0; i < 81; i++) {
          if (g[i]) continue;
          cells[i].click();
          pad[full[i] - 1].click();
        }
        assert(byId("sdBanner").classList.contains("show"), "sudoku win banner");
      }
    }
    return;
  }
  if (key === "hanoi") {
    const pegQ = () => [...scr.querySelectorAll("#hnPegs .hn-peg")];
    assert(pegQ().length === 3, "hanoi 3 pegs");
    click(byId("hnNew"));
    const disks = pegQ()[0].children.length;
    assert(disks >= 3, `hanoi disks>=3 (got ${disks})`);
    pegQ()[0].click();
    pegQ()[2].click();
    assert(pegQ()[2].children.length === 1, "hanoi disk moved right");
    if (deep && diff === "easy") {
      click(byId("hnNew"));
      const seq = [[0, 2], [0, 1], [2, 1], [0, 2], [1, 0], [1, 2], [0, 2]];
      for (const [a, b] of seq) { pegQ()[a].click(); pegQ()[b].click(); }
      assert(byId("hnBanner").classList.contains("show"), "hanoi optimal solve banner");
      assert(pegQ()[2].children.length === 3, "hanoi all disks on right peg");
    }
    return;
  }
  if (key === "pipes") {
    const cv = byId("ppCanvas");
    const before = num("#ppMoves");
    mouseDown(cv, 36, 36);
    mouseDown(cv, 180, 180);
    touch(cv, 324, 324);
    assert(num("#ppMoves") > before, "pipes rotation counter");
    assert((drawCalls.fillRect || 0) + (drawCalls.stroke || 0) > 0, "pipes drew to canvas");
    return;
  }
  if (key === "gomoku") {
    const cells = [...scr.querySelectorAll("#gkBoard button")];
    assert(cells.length > 0, "gomoku board cells");
    const mid = Math.floor(cells.length / 2);
    cells[mid].click();
    const hasP = [...scr.querySelectorAll("#gkBoard button")].some((b) => b.classList.contains("p"));
    const hasC = [...scr.querySelectorAll("#gkBoard button")].some((b) => b.classList.contains("c"));
    assert(hasP, "gomoku player stone placed");
    assert(hasC, "gomoku CPU replied");
    return;
  }
  if (key === "blackjack") {
    const deal = byId("bjDeal"), hit = byId("bjHit"), stand = byId("bjStand");
    assert(!deal.disabled, "blackjack deal enabled");
    deal.click();
    assert(scr.querySelectorAll("#bjYou .bj-card").length === 2, "blackjack player 2 cards after deal");
    assert(scr.querySelectorAll("#bjDealer .bj-card").length === 2, "blackjack dealer 2 cards after deal");
    let guard = 0;
    while (!hit.disabled && guard < 8) { hit.click(); guard++; }
    if (!stand.disabled) stand.click();
    await sleep(10);
    const chips = num("#bjChips");
    assert(chips >= 0 && chips <= 1000, `blackjack chips sane (${chips})`);
    assert(scr.querySelectorAll("#bjYou .bj-card").length >= 2, "blackjack player cards persist");
    assert(scr.querySelectorAll("#bjDealer .bj-card").length >= 2, "blackjack dealer cards persist");
    const deal2 = byId("bjDeal");
    if (!deal2.disabled) {
      deal2.click();
      const s2 = byId("bjStand");
      if (!s2.disabled) s2.click();
      await sleep(10);
      assert(num("#bjChips") <= 1000, "blackjack second round chips sane");
    }
    return;
  }
  if (key === "runner") {
    click(byId("rnStart"));
    await sleep(300);
    assert(num("#rnScore") > 0, "runner distance accrues");
    touch(byId("rnCanvas"), 180, 300);
    await sleep(50);
    assert((drawCalls.fillRect || 0) > 0, "runner drew to canvas");
    return;
  }
  if (key === "hopper") {
    click(byId("hpStart"));
    const up = scr.querySelector('.dpad button[data-mv="up"]');
    up.click(); up.click();
    assert(txt("#hpLives", scr) !== "" && num("#hpLives", scr) <= 3, "hopper lives sane");
    // walk home: 8 ups in a row (may or may not get squashed - both are fine)
    for (let i = 0; i < 8; i++) { doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })); await sleep(6); }
    assert(num("#hpScore", scr) >= 0, "hopper crossings counter");
    return;
  }
  if (key === "stacker") {
    click(byId("tkStart"));
    await sleep(400);
    mouseDown(byId("tkCanvas"), 180, 300);
    const sc = num("#tkScore");
    assert(sc === 1 || byId("tkBanner").classList.contains("show"), `stacker drop registered (score ${sc})`);
    return;
  }
  if (key === "match3") {
    const b = scr.querySelectorAll("#m3Grid button");
    assert(b.length > 0, "match3 board cells");
    const n = Math.round(Math.sqrt(b.length));
    const colorAt = (i) => { const el = scr.querySelectorAll("#m3Grid button")[i]; return el ? el.style.background : ""; };
    let initialMatch = false;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (c + 2 < n && colorAt(r * n + c) === colorAt(r * n + c + 1) && colorAt(r * n + c) === colorAt(r * n + c + 2)) initialMatch = true;
      if (r + 2 < n && colorAt(r * n + c) === colorAt((r + 1) * n + c) && colorAt(r * n + c) === colorAt((r + 2) * n + c)) initialMatch = true;
    }
    assert(!initialMatch, "match3 no initial matches");
    const movesBefore = num("#m3Moves", scr);
    let swapped = false;
    for (let i = 0; i < n * n && !swapped; i++) {
      const r = Math.floor(i / n), c = i % n;
      const pairs = [];
      if (c + 1 < n) pairs.push(i + 1);
      if (r + 1 < n) pairs.push(i + n);
      for (const j of pairs) {
        const cells1 = scr.querySelectorAll("#m3Grid button");
        cells1[i].click();
        cells1[j].click();
        if (num("#m3Moves", scr) < movesBefore) { swapped = true; break; }
      }
    }
    assert(swapped, "match3 valid swap registerable");
    return;
  }
  if (key === "nono") {
    var n = DP.nono[diff()].n;
    var nCells = scr.querySelectorAll("#noWrap .no-cell");
    assert(nCells.length === n * n, `nono grid ${n}x${n} (got ${nCells.length})`);
    assert(scr.querySelectorAll("#noWrap .no-clue").length === 1 + 2 * n, "nono clue cells");
    for (var nt = 0; nt < Math.min(5, nCells.length); nt++) nCells[nt].click();
    return;
  }
  if (key === "wordle") {
    var wl = DP.wordle[diff()];
    var tiles = scr.querySelectorAll("#wlGrid .wl-tile");
    assert(tiles.length === wl.guesses * wl.len, `wordle tiles (got ${tiles.length})`);
    assert(scr.querySelectorAll("#wlKeys .wl-key").length >= 28, "wordle keyboard");
    var word = WORDLE_WORDS[wl.len][0];
    var before = num("#wlLeft", scr);
    for (var ch = 0; ch < word.length; ch++) {
      var kbtn = scr.querySelector("#wl-k-" + word[ch]);
      if (kbtn) kbtn.click();
    }
    var enterBtn = [...scr.querySelectorAll("#wlKeys .wl-key")].find(function (b) { return b.textContent === "ENTER"; });
    if (enterBtn) enterBtn.click();
    assert(num("#wlLeft", scr) === before - 1, "wordle guess consumed");
    return;
  }
  if (key === "checkers") {
    var ckCells = scr.querySelectorAll("#ckBoard .ck-cell");
    assert(ckCells.length === 64, "checkers 64 cells");
    assert(scr.querySelectorAll("#ckBoard .ck-cell.p1").length === 12, "checkers 12 player pieces");
    assert(scr.querySelectorAll("#ckBoard .ck-cell.p2").length === 12, "checkers 12 cpu pieces");
    var moved = false;
    for (var ci = 0; ci < ckCells.length && !moved; ci++) {
      if (!ckCells[ci].classList.contains("p1")) continue;
      ckCells[ci].click();
      var hints = scr.querySelectorAll("#ckBoard .ck-cell.hint");
      if (hints.length > 0) { hints[0].click(); moved = true; }
      else { ckCells[ci].click(); }
    }
    assert(moved, "checkers player move registered");
    await sleep(600);
    return;
  }
  if (key === "mancala") {
    assert(scr.querySelectorAll("#mcBoard > *").length === 14, "mancala 14 cells");
    assert(scr.querySelectorAll("#mcBoard .mc-store").length === 2, "mancala 2 stores");
    var mine = scr.querySelectorAll("#mcBoard .mc-pit.mine");
    assert(mine.length === 6, `mancala 6 player pits (got ${mine.length})`);
    var clicked = false;
    for (var mi = 0; mi < mine.length && !clicked; mi++) {
      if (parseInt(mine[mi].textContent, 10) > 0) { mine[mi].click(); clicked = true; }
    }
    assert(clicked, "mancala player move registered");
    await sleep(600);
    return;
  }
  if (key === "flow") {
    var fn = DP.flow[diff()].n;
    var fwCells = scr.querySelectorAll("#fwGrid .fw-cell");
    assert(fwCells.length === fn * fn, `flow grid ${fn}x${fn} (got ${fwCells.length})`);
    assert(scr.querySelectorAll("#fwGrid .fw-cell.dot").length === DP.flow[diff()].pairs * 2, "flow endpoints");
    var gridEl = scr.querySelector("#fwGrid");
    var step = 360 / fn;
    fire(gridEl, "touchstart", { touches: [{ clientX: step * 0.5, clientY: step * 0.5 }], changedTouches: [{ clientX: step * 0.5, clientY: step * 0.5 }] });
    fire(gridEl, "touchmove", { touches: [{ clientX: step * 1.5, clientY: step * 0.5 }], changedTouches: [{ clientX: step * 1.5, clientY: step * 0.5 }] });
    fire(gridEl, "touchend", { touches: [], changedTouches: [{ clientX: step * 1.5, clientY: step * 0.5 }] });
    return;
  }
  if (key === "type") {
    assert(!!scr.querySelector("#tyInput"), "type input exists");
    var tword = scr.querySelector("#tyWord").textContent;
    assert(tword.length >= 3, "type word shown");
    var inp = scr.querySelector("#tyInput");
    inp.value = tword;
    fire(inp, "input");
    await sleep(20);
    assert(num("#tyWpm", scr) > 0, "type WPM accrues");
    return;
  }
  if (key === "hockey") {
    click(byId("hkStart"));
    await sleep(100);
    assert(num("#hkYou", scr) === 0 && num("#hkCpu", scr) === 0, "hockey scores start at 0");
    var hkCanvas = byId("hkCanvas");
    fire(hkCanvas, "touchstart", { touches: [{ clientX: 180, clientY: 300 }], changedTouches: [{ clientX: 180, clientY: 300 }] });
    await sleep(50);
    return;
  }
  if (key === "slots") {
    assert(scr.querySelectorAll("#scReels .sc-reel").length === 3, "slots 3 reels");
    var before = num("#scCoins", scr);
    var spinBtn = byId("scSpin");
    assert(!spinBtn.disabled, "slots spin enabled");
    spinBtn.click();
    assert(num("#scCoins", scr) === before - 10, "slots bet deducted");
    return;
  }
  if (key === "quiz") {
    assert(scr.querySelector("#qzQ").textContent.length > 5, "quiz question shown");
    var qopts = scr.querySelectorAll("#qzOpts .qz-opt");
    assert(qopts.length === 4, `quiz 4 options (got ${qopts.length})`);
    qopts[0].click();
    await sleep(30);
    assert(scr.querySelectorAll("#qzOpts .qz-opt:disabled").length === 4, "quiz options locked after answer");
    return;
  }
  if (key === "bubble") {
    click(byId("bbStart"));
    await sleep(100);
    assert(num("#bbScore", scr) === 0, "bubble score starts at 0");
    var bbCanvas = byId("bbCanvas");
    fire(bbCanvas, "touchstart", { touches: [{ clientX: 180, clientY: 100 }], changedTouches: [{ clientX: 180, clientY: 100 }] });
    await sleep(50);
    return;
  }
  return generic(scr);
}

// ---------- structural ----------
const cards = [...doc.querySelectorAll(".game-card")];
assert(cards.length === 50, `50 cards (got ${cards.length})`);
const allIds = [...doc.querySelectorAll("[id]")].map((e) => e.id);
assert(new Set(allIds).size === allIds.length, "ids unique");
for (const c of cards) {
  const key = c.getAttribute("data-game");
  assert(!!byId(key) && byId(key).classList.contains("screen"), `screen exists for ${key}`);
}

// ---------- drive every game x every difficulty ----------
const diffs = ["easy", "medium", "hard", "impossible"];
const deepKeys = new Set(["sudoku", "hanoi"]);
for (const d of diffs) {
  const dbtn = doc.querySelector(`.diff-bar button[data-diff="${d}"]`);
  assert(!!dbtn, `diff button ${d}`);
  dbtn.click();
  const deep = d === "easy" || d === "medium";
  for (const card of cards) {
    const key = card.getAttribute("data-game");
    try {
      await enter(key);
      await exercise(key, byId(key), deep && deepKeys.has(key), d);
      back();
      await sleep(6);
    } catch (e) {
      fails.push(`${key}/${d}: ${e && e.message}`);
    }
  }
}

assert(errors.length === 0, "no runtime errors");

// ---------- report ----------
console.log(`\nGameBox smoke: ${passes} passed, ${fails.length} failed`);
if (fails.length) console.log("FAILURES:\n" + fails.map((f) => "  - " + f).join("\n"));
if (errors.length) console.log("RUNTIME ERRORS:\n" + errors.map((f) => "  - " + f).join("\n"));
console.log(`canvas draw ops recorded: ${Object.keys(drawCalls).length} kinds, ${Object.values(drawCalls).reduce((a, b) => a + b, 0)} calls`);
dom.window.close();
process.exit(fails.length || errors.length ? 1 : 0);
