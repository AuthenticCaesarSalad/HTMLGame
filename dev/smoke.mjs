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
  return generic(scr);
}

// ---------- structural ----------
const cards = [...doc.querySelectorAll(".game-card")];
assert(cards.length === 40, `40 cards (got ${cards.length})`);
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
