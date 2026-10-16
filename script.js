
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* ============ Navigation ============ */
  var backBtn = $("backBtn");
  var current = "menu";
  var stopFns = {};

  function show(screen) {
    if (stopFns[current]) stopFns[current]();
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove("active");
    $(screen).classList.add("active");
    backBtn.style.display = screen === "menu" ? "none" : "inline-block";
    current = screen;
  }
  backBtn.addEventListener("click", function () { show("menu"); });

  var cards = document.querySelectorAll(".game-card");
  for (var c = 0; c < cards.length; c++) {
    cards[c].addEventListener("click", function () { show(this.getAttribute("data-game")); });
  }

  function banner(el, html) { el.innerHTML = html; el.classList.add("show"); }
  function hideBanner(el) { el.classList.remove("show"); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ============ Difficulty ============ */
  var DIFF = lsGet("gb_diff", "medium");
  function diff() { return DIFF; }
  var DP = {
    snake:     { easy:{tick:210}, medium:{tick:150}, hard:{tick:110}, impossible:{tick:78} },
    g2048:     { easy:{four:0.05}, medium:{four:0.10}, hard:{four:0.25}, impossible:{four:0.40} },
    memory:    { easy:{peek:1500, back:1000}, medium:{back:700}, hard:{back:420}, impossible:{back:250} },
    ttt:       { easy:{rand:0.75}, medium:{rand:0.3}, hard:{}, impossible:{minimax:true} },
    whack:     { easy:{mole:1100}, medium:{mole:800}, hard:{mole:550}, impossible:{mole:380} },
    breakout:  { easy:{pw:80, mult:0.85, lives:5}, medium:{pw:64, mult:1, lives:3}, hard:{pw:52, mult:1.2, lives:2}, impossible:{pw:44, mult:1.4, lives:1} },
    flappy:    { easy:{gap:155, speed:2.0, every:115}, medium:{gap:115, speed:2.3, every:95}, hard:{gap:95, speed:2.7, every:85}, impossible:{gap:78, speed:3.3, every:72} },
    simon:     { easy:{step:640, flash:400}, medium:{step:480, flash:320}, hard:{step:350, flash:240}, impossible:{step:250, flash:170} },
    mines:     { easy:{size:9, mines:8}, medium:{size:9, mines:12}, hard:{size:10, mines:18}, impossible:{size:11, mines:24} },
    hangman:   { easy:{misses:8, pool:0}, medium:{misses:6, pool:0}, hard:{misses:5, pool:1}, impossible:{misses:4, pool:2} },
    pong:      { easy:{cpu:2.8, ball:3.4}, medium:{cpu:4.4, ball:4}, hard:{cpu:5.8, ball:4.6}, impossible:{cpu:7.6, ball:5.2} },
    connect4:  { easy:{rand:0.5}, medium:{}, hard:{safe:true}, impossible:{depth:4} },
    lightsout: { easy:{presses:[4,7]}, medium:{presses:[8,14]}, hard:{presses:[16,24]}, impossible:{presses:[26,36]} },
    reaction:  { easy:{runs:3, early:"restart", min:1200, max:4000}, medium:{runs:5, early:"retry", min:1200, max:4000}, hard:{runs:5, early:"fail", min:900, max:3000}, impossible:{runs:7, early:"fail", min:700, max:2200} },
    dodger:    { easy:{speed:2.2, spawn:65}, medium:{speed:3, spawn:55}, hard:{speed:4.2, spawn:45}, impossible:{speed:5.5, spawn:34} },
    tetris:    { easy:{drop:700}, medium:{drop:520}, hard:{drop:380}, impossible:{drop:230} },
    slide:     { easy:{size:3}, medium:{size:4}, hard:{size:5}, impossible:{size:6} },
    math:      { easy:{ops:"+", lo:1, hi:20, time:60, pen:2}, medium:{ops:"+-", lo:1, hi:50, time:60, pen:3}, hard:{ops:"+-*", lo:1, hi:50, mlo:2, mhi:12, time:60, pen:4}, impossible:{ops:"+-*/", lo:10, hi:99, mlo:3, mhi:15, time:45, pen:5} },
    invaders:  { easy:{rows:3, cols:6, lives:3, alienSpd:0.35, bombEvery:1500, bombSpd:2.2}, medium:{rows:4, cols:6, lives:3, alienSpd:0.55, bombEvery:1000, bombSpd:2.8}, hard:{rows:5, cols:7, lives:2, alienSpd:0.75, bombEvery:700, bombSpd:3.4}, impossible:{rows:5, cols:8, lives:1, alienSpd:1.0, bombEvery:450, bombSpd:4.2} },
    master:    { easy:{len:3, colors:6, rows:8}, medium:{len:4, colors:6, rows:8}, hard:{len:4, colors:7, rows:7}, impossible:{len:5, colors:8, rows:6} },
    reversi:   { easy:{ai:"random"}, medium:{ai:"greedy"}, hard:{ai:"corner"}, impossible:{ai:"minimax", depth:3} },
    dots:      { easy:{n:3, lvl:0}, medium:{n:4, lvl:1}, hard:{n:5, lvl:2}, impossible:{n:5, lvl:3} },
    ships:     { easy:{ai:"random"}, medium:{ai:"hunt"}, hard:{ai:"parity"}, impossible:{ai:"parity2"} },
    sokoban:   { easy:{set:0}, medium:{set:1}, hard:{set:2}, impossible:{set:3} },
    maze:      { easy:{n:8}, medium:{n:12}, hard:{n:16}, impossible:{n:20} },
    samegame:  { easy:{n:8, colors:4}, medium:{n:10, colors:5}, hard:{n:12, colors:5}, impossible:{n:12, colors:6} },
    scramble:  { easy:{pool:0, time:90}, medium:{pool:1, time:75}, hard:{pool:2, time:60}, impossible:{pool:3, time:40} },
    rps:       { easy:{ai:0}, medium:{ai:1}, hard:{ai:2}, impossible:{ai:3} },
    stroop:    { easy:{time:40, wordRule:0, cong:0.6}, medium:{time:30, wordRule:0.1, cong:0.3}, hard:{time:25, wordRule:0.25, cong:0.1}, impossible:{time:20, wordRule:0.45, cong:0} },
    aim:       { easy:{r:34, life:2400, spd:0}, medium:{r:26, life:1700, spd:0}, hard:{r:20, life:1300, spd:2}, impossible:{r:15, life:1000, spd:3} },
    flood:     { easy:{n:6,colors:3,moves:22}, medium:{n:8,colors:4,moves:26}, hard:{n:10,colors:5,moves:28}, impossible:{n:12,colors:6,moves:32} },
    sudoku:    { easy:{given:40}, medium:{given:32}, hard:{given:27}, impossible:{given:24} },
    hanoi:     { easy:{disks:3}, medium:{disks:4}, hard:{disks:5}, impossible:{disks:6} },
    pipes:     { easy:{n:5}, medium:{n:6}, hard:{n:7}, impossible:{n:8} },
    gomoku:    { easy:{n:9,lvl:0}, medium:{n:11,lvl:1}, hard:{n:13,lvl:2}, impossible:{n:13,lvl:3} },
    blackjack: { easy:{chips:200,soft17:0}, medium:{chips:100,soft17:0}, hard:{chips:50,soft17:1}, impossible:{chips:20,soft17:1} },
    runner:    { easy:{spd:3.4}, medium:{spd:4.4}, hard:{spd:5.6}, impossible:{spd:6.8} },
    hopper:    { easy:{spd:1.1,lives:3,perLane:1}, medium:{spd:1.6,lives:3,perLane:1}, hard:{spd:2.1,lives:3,perLane:2}, impossible:{spd:2.7,lives:2,perLane:2} },
    stacker:   { easy:{spd:2.2}, medium:{spd:3.2}, hard:{spd:4.4}, impossible:{spd:5.6} },
    match3:    { easy:{n:8,colors:4,moves:25}, medium:{n:8,colors:5,moves:20}, hard:{n:9,colors:5,moves:18}, impossible:{n:9,colors:6,moves:15} },
    nono:      { easy:{n:5}, medium:{n:7}, hard:{n:8}, impossible:{n:10} },
    wordle:    { easy:{len:4,guesses:6}, medium:{len:5,guesses:6}, hard:{len:6,guesses:5}, impossible:{len:7,guesses:4} },
    checkers:  { easy:{depth:1}, medium:{depth:2}, hard:{depth:3}, impossible:{depth:4} },
    mancala:   { easy:{depth:1}, medium:{depth:2}, hard:{depth:3}, impossible:{depth:4} },
    flow:      { easy:{n:4,pairs:3}, medium:{n:5,pairs:4}, hard:{n:6,pairs:5}, impossible:{n:7,pairs:6} },
    type:      { easy:{time:60,maxlen:5}, medium:{time:45,maxlen:6}, hard:{time:30,maxlen:7}, impossible:{time:20,maxlen:8} },
    hockey:    { easy:{cpu:3.2}, medium:{cpu:4.4}, hard:{cpu:5.4}, impossible:{cpu:6.4} },
    slots:     { easy:{coins:200,mult:1}, medium:{coins:100,mult:0.8}, hard:{coins:50,mult:0.6}, impossible:{coins:20,mult:0.4} },
    quiz:      { easy:{time:20,pool:0}, medium:{time:15,pool:1}, hard:{time:12,pool:2}, impossible:{time:8,pool:3} },
    bubble:    { easy:{rows:3,spd:1}, medium:{rows:4,spd:1.4}, hard:{rows:5,spd:1.8}, impossible:{rows:6,spd:2.2} },
    towerdef:  { easy:{gold:250,lives:30}, medium:{gold:180,lives:20}, hard:{gold:130,lives:12}, impossible:{gold:100,lives:8} },
    doom:      { easy:{dems:6,hp:60,dmg:6,spd:1.2}, medium:{dems:10,hp:80,dmg:8,spd:1.5}, hard:{dems:14,hp:100,dmg:10,spd:1.9}, impossible:{dems:18,hp:120,dmg:14,spd:2.3} },
    rogue:     { easy:{mon:6,dmult:0.8}, medium:{mon:8,dmult:1}, hard:{mon:10,dmult:1.3}, impossible:{mon:12,dmult:1.6} },
    chess:     { easy:{depth:1}, medium:{depth:2}, hard:{depth:3}, impossible:{depth:4} },
    klondike:  { easy:{draw:1,redeals:99}, medium:{draw:3,redeals:99}, hard:{draw:3,redeals:2}, impossible:{draw:3,redeals:1} },
    mahjong:   { easy:{layers:2,rows:3,cols:6}, medium:{layers:4,rows:4,cols:4}, hard:{layers:5,rows:5,cols:4}, impossible:{layers:4,rows:6,cols:6} },
    bowl:      { easy:{wobble:0.10,hook:0.35}, medium:{wobble:0.22,hook:0.65}, hard:{wobble:0.40,hook:0.95}, impossible:{wobble:0.65,hook:1.30} },
    golf:      { easy:{rad:12,start:0}, medium:{rad:10,start:3}, hard:{rad:9,start:6}, impossible:{rad:7,start:9} },
    slice:     { easy:{speed:1.0,spawn:1300,bomb:0.05}, medium:{speed:1.25,spawn:1100,bomb:0.10}, hard:{speed:1.55,spawn:950,bomb:0.16}, impossible:{speed:1.9,spawn:800,bomb:0.22} },
    tiles:     { easy:{speed:2.2,acc:0.004,density:0.9}, medium:{speed:3.0,acc:0.007,density:1.0}, hard:{speed:3.8,acc:0.010,density:1.15}, impossible:{speed:4.6,acc:0.013,density:1.3} },
    yaht:      { easy:{rolls:4}, medium:{rolls:3}, hard:{rolls:2}, impossible:{rolls:1} },
    roul:      { easy:{chips:1000}, medium:{chips:500}, hard:{chips:250}, impossible:{chips:100} },
    wsearch:   { easy:{n:8,words:5,dirs:4}, medium:{n:10,words:6,dirs:4}, hard:{n:12,words:8,dirs:8}, impossible:{n:14,words:10,dirs:8} }
  };
  (function () {
    var btns = $("diffBar").querySelectorAll("button");
    function paint() {
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle("active", btns[i].getAttribute("data-diff") === DIFF);
      }
    }
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        DIFF = this.getAttribute("data-diff");
        lsSet("gb_diff", DIFF);
        paint();
        beep(520, 0.06);
      });
    }
    paint();
  })();

  var audioCtx = null;
  function beep(freq, dur) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.22, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  /* ============ 1. SNAKE ============ */
  (function () {
    var canvas = $("snakeCanvas"), ctx = canvas.getContext("2d");
    var COLS = 18, ROWS = 18, CELL = canvas.width / COLS;
    var snake, dir, nextDir, food, score, best = lsGet("gb_snake_best", 0), dead, timer;
    $("snakeBest").textContent = best;

    function reset() {
      snake = [{x: 9, y: 9}, {x: 8, y: 9}, {x: 7, y: 9}];
      dir = {x: 1, y: 0}; nextDir = dir; score = 0; dead = false;
      $("snakeScore").textContent = "0";
      hideBanner($("snakeBanner"));
      placeFood();
      draw();
    }
    function placeFood() {
      do {
        food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        var onSnake = snake.some(function (s) { return s.x === food.x && s.y === food.y; });
      } while (onSnake);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.35, 0, Math.PI * 2);
      ctx.fill();
      for (var i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4ade80" : "#2f9e58";
        ctx.fillRect(snake[i].x * CELL + 1, snake[i].y * CELL + 1, CELL - 2, CELL - 2);
      }
      if (dead) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#e8edf2";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
      }
    }
    function step() {
      if (dead) return;
      dir = nextDir;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
        dead = true;
        clearInterval(timer); timer = null;
        $("snakeStart").textContent = "Restart";
        if (score > best) { best = score; lsSet("gb_snake_best", best); $("snakeBest").textContent = best; }
        banner($("snakeBanner"), "Game over! Score: <b>" + score + "</b>");
        draw();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        $("snakeScore").textContent = score;
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }
    function setDir(d) {
      var m = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} }[d];
      if (!m) return;
      if (m.x === -dir.x && m.y === -dir.y) return; // no 180 turn
      nextDir = m;
    }
    $("snakeStart").addEventListener("click", function () {
      reset();
      this.textContent = "Restart";
      if (timer) clearInterval(timer);
      timer = setInterval(step, DP.snake[diff()].tick);
    });
    var padBtns = document.querySelectorAll("#snake .dpad button");
    for (var i = 0; i < padBtns.length; i++) {
      padBtns[i].addEventListener("click", function () { setDir(this.getAttribute("data-dir")); });
    }
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? "right" : "left");
      else setDir(dy > 0 ? "down" : "up");
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      var map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key] && current === "snake") { e.preventDefault(); setDir(map[e.key]); }
    });
    stopFns.snake = function () { if (timer) { clearInterval(timer); timer = null; } };
    reset();
  })();

  /* ============ 2. 2048 ============ */
  (function () {
    var grid, score, best = lsGet("gb_2048_best", 0), over;
    $("tBest").textContent = best;
    var COLORS = {
      2: "#3c4654", 4: "#4a5568", 8: "#e0935a", 16: "#e0855a", 32: "#dd7762",
      64: "#db5f52", 128: "#e8c15c", 256: "#e8bd50", 512: "#e6b944",
      1024: "#e4b53a", 2048: "#4ade80"
    };

    function reset() {
      grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
      score = 0; over = false;
      $("tScore").textContent = "0";
      hideBanner($("tBanner"));
      addTile(); addTile(); render();
    }
    function addTile() {
      var empty = [];
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (grid[r][c] === 0) empty.push([r, c]);
      if (!empty.length) return;
      var spot = empty[Math.floor(Math.random() * empty.length)];
      grid[spot[0]][spot[1]] = Math.random() < DP.g2048[diff()].four ? 4 : 2;
    }
    function render() {
      var el = $("tGrid");
      el.innerHTML = "";
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        var v = grid[r][c];
        var cell = document.createElement("div");
        cell.className = "t-cell";
        if (v) {
          cell.textContent = v;
          cell.style.background = COLORS[v] || "#4ade80";
          if (v >= 128) cell.style.color = "#101418";
        }
        el.appendChild(cell);
      }
    }
    function slide(line) {
      var arr = line.filter(function (v) { return v !== 0; });
      var result = [], gained = 0;
      for (var i = 0; i < arr.length; i++) {
        if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
          result.push(arr[i] * 2); gained += arr[i] * 2; i++;
        } else result.push(arr[i]);
      }
      while (result.length < 4) result.push(0);
      return { row: result, gained: gained };
    }
    function move(dirn) {
      if (over) return;
      var moved = false, gainedTotal = 0;
      var g = grid.map(function (r) { return r.slice(); });

      function lineGet(i) {
        if (dirn === "left") return g[i].slice();
        if (dirn === "right") return g[i].slice().reverse();
        if (dirn === "up") return [g[0][i], g[1][i], g[2][i], g[3][i]];
        return [g[3][i], g[2][i], g[1][i], g[0][i]]; // down
      }
      function lineSet(i, out) {
        if (dirn === "left") g[i] = out;
        else if (dirn === "right") g[i] = out.reverse();
        else if (dirn === "up") { for (var k = 0; k < 4; k++) g[k][i] = out[k]; }
        else { for (var k2 = 0; k2 < 4; k2++) g[3 - k2][i] = out[k2]; }
      }
      for (var i = 0; i < 4; i++) {
        var res = slide(lineGet(i));
        gainedTotal += res.gained;
        lineSet(i, res.row);
      }
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (g[r][c] !== grid[r][c]) moved = true;
      if (!moved) return;
      grid = g;
      if (gainedTotal) { score += gainedTotal; $("tScore").textContent = score; }
      if (score > best) { best = score; lsSet("gb_2048_best", best); $("tBest").textContent = best; }
      addTile();
      render();
      checkEnd();
    }
    function canMove() {
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return true;
        if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
      }
      return false;
    }
    function checkEnd() {
      var won = false;
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (grid[r][c] === 2048) won = true;
      if (won) { over = true; banner($("tBanner"), "You made <b>2048</b>! You win!"); return; }
      if (!canMove()) { over = true; banner($("tBanner"), "No moves left. Score: <b>" + score + "</b>"); }
    }
    $("tNew").addEventListener("click", reset);

    var sx = 0, sy = 0;
    var scr = $("g2048");
    scr.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    scr.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (current !== "g2048") return;
      var map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    });
    reset();
  })();

  /* ============ 3. MEMORY MATCH ============ */
  (function () {
    var SYMS = ["\u2605", "\u2665", "\u2663", "\u2666", "\u25CF", "\u25B2", "\u25A0", "\u2726"];
    var first = null, lock = false, moves = 0, pairs = 0;
    function reset() {
      var deck = SYMS.concat(SYMS);
      for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = deck[i]; deck[i] = deck[j]; deck[j] = t;
      }
      first = null; lock = false; moves = 0; pairs = 0;
      $("memMoves").textContent = "0";
      $("memPairs").textContent = "0/8";
      hideBanner($("memBanner"));
      var el = $("memGrid");
      el.innerHTML = "";
      deck.forEach(function (sym) {
        var card = document.createElement("button");
        card.className = "mem-card";
        card.dataset.sym = sym;
        card.textContent = "?";
        card.addEventListener("click", function () { flip(card); });
        el.appendChild(card);
      });
      var mcfg = DP.memory[diff()];
      if (mcfg.peek) {
        lock = true;
        var shown = el.querySelectorAll(".mem-card");
        for (var i = 0; i < shown.length; i++) {
          shown[i].classList.add("flipped");
          shown[i].textContent = shown[i].dataset.sym;
        }
        setTimeout(function () {
          for (var j = 0; j < shown.length; j++) {
            shown[j].classList.remove("flipped");
            shown[j].textContent = "?";
          }
          lock = false;
        }, mcfg.peek);
      }
    }
    function flip(card) {
      if (lock || card.classList.contains("flipped") || card.classList.contains("done")) return;
      card.classList.add("flipped");
      card.textContent = card.dataset.sym;
      if (!first) { first = card; return; }
      moves++;
      $("memMoves").textContent = moves;
      if (first.dataset.sym === card.dataset.sym) {
        first.classList.add("done"); card.classList.add("done");
        first.classList.remove("flipped"); card.classList.remove("flipped");
        first = null;
        pairs++;
        $("memPairs").textContent = pairs + "/8";
        if (pairs === 8) banner($("memBanner"), "You found all pairs in <b>" + moves + "</b> moves!");
      } else {
        lock = true;
        var a = first, b = card;
        first = null;
        setTimeout(function () {
          a.classList.remove("flipped"); b.classList.remove("flipped");
          a.textContent = "?"; b.textContent = "?";
          lock = false;
        }, DP.memory[diff()].back);
      }
    }
    $("memNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 4. TIC TAC TOE ============ */
  (function () {
    var board, over, you = 0, cpu = 0, draws = 0;
    var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    function winner(b) {
      for (var i = 0; i < LINES.length; i++) {
        var l = LINES[i];
        if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]];
      }
      var full = true;
      for (var j = 0; j < 9; j++) if (b[j] === "") full = false;
      if (full) return "draw";
      return null;
    }
    function reset() {
      board = ["","","","","","","","",""];
      over = false;
      hideBanner($("tttBanner"));
      render();
    }
    function render() {
      var el = $("tttBoard");
      el.innerHTML = "";
      board.forEach(function (v, i) {
        var cell = document.createElement("button");
        cell.className = "ttt-cell" + (v === "X" ? " x" : v === "O" ? " o" : "");
        cell.textContent = v;
        cell.addEventListener("click", function () { play(i); });
        el.appendChild(cell);
      });
    }
    function play(i) {
      if (over || board[i] !== "") return;
      board[i] = "X";
      render();
      var w = winner(board);
      if (w) return finish(w);
      setTimeout(function () { cpuMove(); }, 350);
    }
    function cpuMove() {
      if (over) return;
      var moveIdx = DP.ttt[diff()].minimax ? minimaxMove(board) : bestMove(board);
      board[moveIdx] = "O";
      render();
      var w = winner(board);
      if (w) finish(w);
    }
    function bestMove(b) {
      var i;
      var cfg = DP.ttt[diff()];
      // easy / medium: sometimes just play a random open cell
      if (cfg.rand && Math.random() < cfg.rand) {
        var open = [];
        for (i = 0; i < 9; i++) if (b[i] === "") open.push(i);
        if (open.length) return open[Math.floor(Math.random() * open.length)];
      }
      // 1. win if possible
      for (i = 0; i < 9; i++) if (b[i] === "") { b[i] = "O"; if (winner(b) === "O") { b[i] = ""; return i; } b[i] = ""; }
      // 2. block player win
      for (i = 0; i < 9; i++) if (b[i] === "") { b[i] = "X"; if (winner(b) === "X") { b[i] = ""; return i; } b[i] = ""; }
      // 3. center
      if (b[4] === "") return 4;
      // 4. random corner
      var corners = [0, 2, 6, 8].filter(function (c) { return b[c] === ""; });
      if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
      // 5. anything
      var any = [];
      for (i = 0; i < 9; i++) if (b[i] === "") any.push(i);
      return any[Math.floor(Math.random() * any.length)];
    }
    function minimaxMove(b) {
      var bestScore = -2, move = -1;
      for (var i = 0; i < 9; i++) {
        if (b[i] !== "") continue;
        b[i] = "O";
        var s = mini(b, false);
        b[i] = "";
        if (s > bestScore) { bestScore = s; move = i; }
      }
      return move;
    }
    function mini(b, isMax) {
      var w = winner(b);
      if (w === "O") return 1;
      if (w === "X") return -1;
      if (w === "draw") return 0;
      var best = isMax ? -2 : 2;
      for (var i = 0; i < 9; i++) {
        if (b[i] !== "") continue;
        b[i] = isMax ? "O" : "X";
        var s = mini(b, !isMax);
        b[i] = "";
        if (isMax ? s > best : s < best) best = s;
      }
      return best;
    }
    function finish(w) {
      over = true;
      if (w === "X") { you++; banner($("tttBanner"), "You win!"); }
      else if (w === "O") { cpu++; banner($("tttBanner"), "Computer wins. Try again!"); }
      else { draws++; banner($("tttBanner"), "It's a draw."); }
      $("tttYou").textContent = you;
      $("tttCpu").textContent = cpu;
      $("tttDraw").textContent = draws;
    }
    $("tttNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 5. WHACK-A-MOLE ============ */
  (function () {
    var score = 0, timeLeft = 30, running = false, moleTimer = null, clockTimer = null, upHole = -1;
    var holes = [];
    var el = $("whackGrid");
    for (var i = 0; i < 9; i++) {
      (function (idx) {
        var hole = document.createElement("button");
        hole.className = "hole";
        hole.textContent = "";
        hole.addEventListener("click", function () {
          if (!running || idx !== upHole) return;
          score++;
          $("wScore").textContent = score;
          hole.classList.remove("up");
          hole.textContent = "";
          upHole = -1;
        });
        el.appendChild(hole);
        holes.push(hole);
      })(i);
    }
    function popMole() {
      if (upHole >= 0) { holes[upHole].classList.remove("up"); holes[upHole].textContent = ""; }
      var idx = Math.floor(Math.random() * 9);
      upHole = idx;
      holes[idx].classList.add("up");
      holes[idx].textContent = "\uD83D\uDC39";
    }
    function start() {
      score = 0; timeLeft = 30; running = true;
      $("wScore").textContent = "0";
      $("wTime").textContent = "30";
      hideBanner($("wBanner"));
      $("wStart").textContent = "Restart";
      if (moleTimer) clearInterval(moleTimer);
      if (clockTimer) clearInterval(clockTimer);
      moleTimer = setInterval(popMole, DP.whack[diff()].mole);
      clockTimer = setInterval(function () {
        timeLeft--;
        $("wTime").textContent = timeLeft;
        if (timeLeft <= 0) end();
      }, 1000);
    }
    function end() {
      running = false;
      if (moleTimer) { clearInterval(moleTimer); moleTimer = null; }
      if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
      if (upHole >= 0) { holes[upHole].classList.remove("up"); holes[upHole].textContent = ""; upHole = -1; }
      banner($("wBanner"), "Time! You whacked <b>" + score + "</b> moles.");
      $("wStart").textContent = "Start";
    }
    $("wStart").addEventListener("click", start);
    stopFns.whack = end;
  })();

  /* ============ 6. BREAKOUT ============ */
  (function () {
    var canvas = $("brkCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var PW = 64, PH = 10, R = 5;
    var paddle, ball, bricks, score, lives, level, playing, raf = null;

    function makeBricks() {
      bricks = [];
      var rows = 5, cols = 6, gap = 4;
      var bw = (W - 20 - (cols - 1) * gap) / cols, bh = 14;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        bricks.push({ x: 10 + c * (bw + gap), y: 40 + r * (bh + gap), w: bw, h: bh, alive: true, row: r });
      }
    }
    function speedMult() { return (1 + (level - 1) * 0.15) * DP.breakout[diff()].mult; }
    function resetBall() {
      var m = speedMult();
      ball = { x: paddle.x + PW / 2, y: paddle.y - R - 2, dx: 2.2 * (Math.random() < 0.5 ? -1 : 1) * m, dy: -3 * m };
    }
    function init() {
      var cfg = DP.breakout[diff()];
      PW = cfg.pw; lives = cfg.lives;
      paddle = { x: W / 2 - PW / 2, y: H - 24 };
      score = 0; level = 1; playing = false;
      makeBricks(); resetBall();
      $("brkScore").textContent = "0";
      $("brkLives").textContent = lives;
      hideBanner($("brkBanner"));
      draw();
    }
    var rowColors = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa"];
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];
        if (!b.alive) continue;
        ctx.fillStyle = rowColors[b.row];
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      ctx.fillStyle = "#e8edf2";
      ctx.fillRect(paddle.x, paddle.y, PW, PH);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2);
      ctx.fill();
      if (!playing) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to play", W / 2, H / 2);
      }
    }
    function update() {
      ball.x += ball.dx;
      ball.y += ball.dy;
      if (ball.x - R < 0) { ball.x = R; ball.dx = Math.abs(ball.dx); }
      if (ball.x + R > W) { ball.x = W - R; ball.dx = -Math.abs(ball.dx); }
      if (ball.y - R < 0) { ball.y = R; ball.dy = Math.abs(ball.dy); }
      if (ball.dy > 0 && ball.y + R >= paddle.y && ball.y + R <= paddle.y + PH + 12 &&
          ball.x >= paddle.x - R && ball.x <= paddle.x + PW + R) {
        ball.dy = -Math.abs(ball.dy);
        ball.y = paddle.y - R;
        var hit = (ball.x - (paddle.x + PW / 2)) / (PW / 2);
        ball.dx = hit * 3.5 * speedMult();
      }
      for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];
        if (!b.alive) continue;
        if (ball.x + R > b.x && ball.x - R < b.x + b.w && ball.y + R > b.y && ball.y - R < b.y + b.h) {
          b.alive = false;
          score += 10;
          $("brkScore").textContent = score;
          var ox = Math.min(ball.x + R - b.x, b.x + b.w - (ball.x - R));
          var oy = Math.min(ball.y + R - b.y, b.y + b.h - (ball.y - R));
          if (ox < oy) ball.dx = -ball.dx; else ball.dy = -ball.dy;
          break;
        }
      }
      var left = 0;
      for (var j = 0; j < bricks.length; j++) if (bricks[j].alive) left++;
      if (left === 0) {
        level++;
        score += 50;
        $("brkScore").textContent = score;
        makeBricks();
        resetBall();
      }
      if (ball.y - R > H) {
        lives--;
        $("brkLives").textContent = lives;
        if (lives <= 0) {
          playing = false;
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          $("brkStart").textContent = "Restart";
          banner($("brkBanner"), "Game over! Score: <b>" + score + "</b> (reached level " + level + ")");
        } else {
          resetBall();
        }
      }
    }
    function loop() {
      if (!playing) { raf = null; return; }
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }
    $("brkStart").addEventListener("click", function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      init();
      playing = true;
      this.textContent = "Restart";
      raf = requestAnimationFrame(loop);
    });
    function moveTo(clientX) {
      var rect = canvas.getBoundingClientRect();
      var x = (clientX - rect.left) * (W / rect.width);
      paddle.x = Math.max(0, Math.min(W - PW, x - PW / 2));
    }
    canvas.addEventListener("touchstart", function (e) { moveTo(e.touches[0].clientX); }, { passive: true });
    canvas.addEventListener("touchmove", function (e) { moveTo(e.touches[0].clientX); }, { passive: true });
    canvas.addEventListener("mousemove", function (e) { moveTo(e.clientX); });
    document.addEventListener("keydown", function (e) {
      if (current !== "breakout") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); paddle.x = Math.max(0, paddle.x - 26); }
      if (e.key === "ArrowRight") { e.preventDefault(); paddle.x = Math.min(W - PW, paddle.x + 26); }
    });
    stopFns.breakout = function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    init();
  })();

  /* ============ 7. FLAPPY TAP ============ */
  (function () {
    var canvas = $("flpCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height, GY = H - 40;
    var bird, pipes, score, frame, state, raf = null;
    var best = lsGet("gb_flap_best", 0);
    $("flpBest").textContent = best;

    function reset() {
      bird = { x: 90, y: H / 2, vy: 0 };
      pipes = []; score = 0; frame = 0; state = "idle";
      $("flpScore").textContent = "0";
      hideBanner($("flpBanner"));
      draw();
    }
    function spawnPipe() {
      var gap = DP.flappy[diff()].gap, margin = 50;
      var gapY = margin + Math.random() * (GY - gap - margin * 2);
      pipes.push({ x: W + 10, gapY: gapY, gap: gap, scored: false });
    }
    function tap() {
      if (state === "dead") return;
      if (state === "idle") state = "play";
      bird.vy = -5.4;
    }
    function die() {
      state = "dead";
      if (score > best) { best = score; lsSet("gb_flap_best", best); $("flpBest").textContent = best; }
      banner($("flpBanner"), "Game over! Score: <b>" + score + "</b> (best " + best + ")");
    }
    function update() {
      frame++;
      if (state !== "play") return;
      bird.vy = Math.min(bird.vy + 0.28, 8);
      bird.y += bird.vy;
      if (bird.y < 12) { bird.y = 12; bird.vy = 0; }
      var fp = DP.flappy[diff()];
      if (frame % fp.every === 0) spawnPipe();
      var speed = fp.speed;
      for (var i = pipes.length - 1; i >= 0; i--) {
        var p = pipes[i];
        p.x -= speed;
        if (!p.scored && p.x + 44 < bird.x) {
          p.scored = true;
          score++;
          $("flpScore").textContent = score;
        }
        if (p.x + 44 < 0) pipes.splice(i, 1);
        if (bird.x + 10 > p.x && bird.x - 10 < p.x + 44 &&
            (bird.y - 10 < p.gapY || bird.y + 10 > p.gapY + p.gap)) { die(); return; }
      }
      if (bird.y + 10 >= GY) { die(); return; }
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#2f9e58";
      for (var i = 0; i < pipes.length; i++) {
        var p = pipes[i];
        ctx.fillRect(p.x, 0, 44, p.gapY);
        ctx.fillRect(p.x, p.gapY + p.gap, 44, GY - p.gapY - p.gap);
      }
      ctx.fillStyle = "#232c37";
      ctx.fillRect(0, GY, W, H - GY);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#101418";
      ctx.beginPath();
      ctx.arc(bird.x + 4, bird.y - 3, 2, 0, Math.PI * 2);
      ctx.fill();
      if (state === "idle") {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap to flap", W / 2, H / 2 - 40);
      }
    }
    function loop() {
      update();
      draw();
      if (state !== "dead") raf = requestAnimationFrame(loop);
      else raf = null;
    }
    $("flpStart").addEventListener("click", function () {
      if (raf) cancelAnimationFrame(raf);
      reset();
      this.textContent = "Restart";
      raf = requestAnimationFrame(loop);
    });
    canvas.addEventListener("touchstart", function () { tap(); }, { passive: true });
    canvas.addEventListener("mousedown", function () { tap(); });
    document.addEventListener("keydown", function (e) {
      if (current === "flappy" && (e.key === " " || e.key === "ArrowUp")) { e.preventDefault(); tap(); }
    });
    stopFns.flappy = function () { if (raf) { cancelAnimationFrame(raf); raf = null; } state = "dead"; };
    reset();
  })();

  /* ============ 8. SIMON SAYS ============ */
  (function () {
    var FREQ = [329.6, 261.6, 220, 164.8];
    var seq = [], pos = 0, showing = false, level = 0;
    var tos = [];
    var padEls = document.querySelectorAll(".sim-pad");

    function later(fn, ms) { tos.push(setTimeout(fn, ms)); }
    function clearTos() { for (var i = 0; i < tos.length; i++) clearTimeout(tos[i]); tos = []; }
    function flash(idx, dur) {
      padEls[idx].classList.add("lit");
      beep(FREQ[idx], dur / 1000);
      later(function () { padEls[idx].classList.remove("lit"); }, dur);
    }
    function nextRound() {
      level++;
      $("simLevel").textContent = level;
      seq.push(Math.floor(Math.random() * 4));
      var p = DP.simon[diff()];
      showing = true;
      for (var i = 0; i < seq.length; i++) {
        (function (i) {
          later(function () { flash(seq[i], p.flash); }, 600 + i * p.step);
        })(i);
      }
      later(function () { showing = false; pos = 0; }, 600 + seq.length * p.step);
    }
    function startGame() {
      clearTos();
      seq = []; level = 0; showing = false;
      $("simLevel").textContent = "0";
      hideBanner($("simBanner"));
      nextRound();
    }
    for (var i = 0; i < padEls.length; i++) {
      (function (idx) {
        padEls[idx].addEventListener("click", function () {
          if (showing) return;
          flash(idx, 220);
          if (seq[pos] === idx) {
            pos++;
            if (pos === seq.length) {
              showing = true;
              later(nextRound, 900);
            }
          } else {
            showing = true;
            banner($("simBanner"), "Wrong pad! You reached level <b>" + level + "</b>");
            if (level > lsGet("gb_simon_best", 0)) lsSet("gb_simon_best", level);
          }
        });
      })(i);
    }
    $("simStart").addEventListener("click", startGame);
    stopFns.simon = clearTos;
  })();

  /* ============ 9. MINESWEEPER ============ */
  (function () {
    var SIZE = 9, MINES = 10;
    var cells, started, dead, won, opened, flagMode = false;
    var NUM_COLORS = ["", "#38bdf8", "#4ade80", "#f87171", "#a78bfa", "#fbbf24", "#2dd4bf", "#e8edf2", "#8a97a5"];

    function idx(r, c) { return r * SIZE + c; }
    function neighbors(i) {
      var r = Math.floor(i / SIZE), c = i % SIZE, out = [];
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(idx(nr, nc));
      }
      return out;
    }
    function placeMines(safe) {
      var forbidden = {};
      forbidden[safe] = true;
      neighbors(safe).forEach(function (n) { forbidden[n] = true; });
      var placed = 0;
      while (placed < MINES) {
        var i = Math.floor(Math.random() * SIZE * SIZE);
        if (cells[i].mine || forbidden[i]) continue;
        cells[i].mine = true;
        placed++;
      }
      for (var j = 0; j < SIZE * SIZE; j++) {
        var cnt = 0;
        neighbors(j).forEach(function (n) { if (cells[n].mine) cnt++; });
        cells[j].n = cnt;
      }
    }
    function reset() {
      var cfg = DP.mines[diff()];
      SIZE = cfg.size; MINES = cfg.mines;
      $("mnGrid").style.gridTemplateColumns = "repeat(" + SIZE + ", 1fr)";
      cells = [];
      for (var i = 0; i < SIZE * SIZE; i++) cells.push({ mine: false, open: false, flag: false, boom: false, n: 0 });
      started = false; dead = false; won = false; opened = 0; flagMode = false;
      $("mnFlagBtn").innerHTML = "&#128681; Flag: OFF";
      $("mnStatus").textContent = "Mines: " + MINES;
      hideBanner($("mnBanner"));
      render();
    }
    function reveal(i) {
      if (dead || won || cells[i].open || cells[i].flag) return;
      if (!started) { started = true; placeMines(i); }
      if (cells[i].mine) {
        cells[i].open = true;
        cells[i].boom = true;
        dead = true;
        for (var j = 0; j < SIZE * SIZE; j++) if (cells[j].mine) cells[j].open = true;
        render();
        banner($("mnBanner"), "Boom! You hit a mine.");
        return;
      }
      var stack = [i];
      while (stack.length) {
        var k = stack.pop();
        if (cells[k].open || cells[k].flag || cells[k].mine) continue;
        cells[k].open = true;
        opened++;
        if (cells[k].n === 0) neighbors(k).forEach(function (n) { stack.push(n); });
      }
      if (opened === SIZE * SIZE - MINES) {
        won = true;
        for (var j2 = 0; j2 < SIZE * SIZE; j2++) if (cells[j2].mine) cells[j2].flag = true;
        render();
        banner($("mnBanner"), "Cleared! You win!");
        return;
      }
      render();
    }
    function toggleFlag(i) {
      if (dead || won || cells[i].open) return;
      cells[i].flag = !cells[i].flag;
      render();
    }
    function render() {
      var el = $("mnGrid");
      el.innerHTML = "";
      var flags = 0;
      for (var i = 0; i < SIZE * SIZE; i++) {
        var c = cells[i];
        if (c.flag) flags++;
        var b = document.createElement("button");
        b.className = "mn-cell" + (c.open ? " open" : "") + (c.boom ? " boom" : "");
        b.dataset.i = i;
        if (c.open) {
          if (c.mine) b.textContent = "\uD83D\uDCA3";
          else if (c.n > 0) { b.textContent = c.n; b.style.color = NUM_COLORS[c.n]; }
        } else if (c.flag) {
          b.textContent = "\uD83D\uDEA9";
        }
        el.appendChild(b);
      }
      $("mnStatus").textContent = "Mines left: " + (MINES - flags);
    }
    var grid = $("mnGrid"), lpTimer = null, longPressed = false;
    grid.addEventListener("touchstart", function (e) {
      var t = e.target;
      while (t && t !== grid && !t.classList.contains("mn-cell")) t = t.parentNode;
      if (!t || t === grid) return;
      longPressed = false;
      lpTimer = setTimeout(function () { longPressed = true; toggleFlag(+t.dataset.i); }, 450);
    }, { passive: true });
    grid.addEventListener("touchend", function () { clearTimeout(lpTimer); }, { passive: true });
    grid.addEventListener("touchmove", function () { clearTimeout(lpTimer); }, { passive: true });
    grid.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== grid && !t.classList.contains("mn-cell")) t = t.parentNode;
      if (!t || t === grid) return;
      if (longPressed) { longPressed = false; return; }
      var i = +t.dataset.i;
      if (flagMode) toggleFlag(i);
      else reveal(i);
    });
    $("mnFlagBtn").addEventListener("click", function () {
      flagMode = !flagMode;
      this.innerHTML = "&#128681; Flag: " + (flagMode ? "ON" : "OFF");
    });
    $("mnNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 10. HANGMAN ============ */
  (function () {
    var WORDS = ["APPLE","BANANA","TIGER","PLANET","ORANGE","GUITAR","CASTLE","DOLPHIN","FOREST","ISLAND","ROCKET","SILVER","WINDOW","CAMERA","DRAGON","EAGLE","FLOWER","GARDEN","HONEY","JUNGLE","LEMON","MANGO","OCEAN","PIANO","QUEEN","RIVER","SUNSET","TUNNEL","VIOLIN","WINTER","ZEBRA","BRIDGE","CANDLE","DESERT","ENGINE","FEATHER","GLASS","HARBOR","IGLOO","JUICE"];
    var word, wrong, guessed, done, maxWrong = 6;
    var HARD_WORDS = ["ADVENTURE","BUTTERFLY","CHOCOLATE","DINOSAUR","EARTHQUAKE","FOUNTAIN","GRAVITY","HORIZON","ILLUSION","JOURNAL","KNAPSACK","LANTERN","MAGNETISM","NIGHTFALL","OCTOPUS","PARADOX","QUARREL","SILHOUETTE","TELESCOPE","ULTRAVIOLET","VOLCANO","WILDERNESS","XYLOPHONE","YESTERDAY","ZIGZAG"];
    var IMPOSSIBLE_WORDS = ["ABRUPTLY","BAGPIPES","BAYOU","BUZZWORD","CROQUET","CYCLONE","DWARVES","EPITOME","FLAPJACK","GAZEBO","GENEALOGY","HAIKU","HYPHEN","IVORY","JACUZZI","JUKEBOX","KHAKI","LARYNX","MNEMONIC","MYRRH","NYMPH","OXYGEN","PHLEGM","PSYCHE","QUARTZ","QUIZZED","RHYTHM","SPHINX","SYNDROME","THESAURUS","VORTEX","WALTZ","WHARF","YACHT","ZEALOUS","ZEPHYR"];
    var canvas = $("hgCanvas"), ctx = canvas.getContext("2d");

    function reset() {
      var cfg = DP.hangman[diff()];
      maxWrong = cfg.misses;
      var pool = cfg.pool === 2 ? IMPOSSIBLE_WORDS : cfg.pool === 1 ? HARD_WORDS : WORDS;
      word = pool[Math.floor(Math.random() * pool.length)];
      wrong = 0; guessed = {}; done = false;
      $("hgMiss").textContent = "0/" + maxWrong;
      hideBanner($("hgBanner"));
      buildKeys();
      renderWord();
      drawFigure();
    }
    function buildKeys() {
      var el = $("hgKeys");
      el.innerHTML = "";
      for (var i = 0; i < 26; i++) {
        var b = document.createElement("button");
        b.className = "hg-key";
        b.textContent = String.fromCharCode(65 + i);
        b.addEventListener("click", function () { guess(this.textContent); });
        el.appendChild(b);
      }
    }
    function guess(L) {
      if (done || guessed[L]) return;
      guessed[L] = true;
      var btns = document.querySelectorAll(".hg-key");
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].textContent === L) {
          btns[i].disabled = true;
          btns[i].classList.add(word.indexOf(L) >= 0 ? "hit" : "miss");
        }
      }
      if (word.indexOf(L) < 0) wrong++;
      $("hgMiss").textContent = wrong + "/" + maxWrong;
      drawFigure();
      renderWord();
      var solved = true;
      for (var j = 0; j < word.length; j++) if (!guessed[word[j]]) solved = false;
      if (solved) {
        done = true;
        banner($("hgBanner"), "You got it! The word was <b>" + word + "</b>");
        return;
      }
      if (wrong >= maxWrong) {
        done = true;
        banner($("hgBanner"), "Game over. The word was <b>" + word + "</b>");
      }
    }
    function renderWord() {
      var s = "";
      for (var i = 0; i < word.length; i++) s += guessed[word[i]] ? word[i] : "_";
      $("hgWord").textContent = s.split("").join(" ");
    }
    function drawFigure() {
      var Wc = canvas.width, Hc = canvas.height;
      ctx.clearRect(0, 0, Wc, Hc);
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#8a97a5";
      ctx.beginPath(); ctx.moveTo(20, 205); ctx.lineTo(150, 205); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(45, 205); ctx.lineTo(45, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(45, 20); ctx.lineTo(120, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(120, 20); ctx.lineTo(120, 38); ctx.stroke();
      ctx.strokeStyle = "#f87171";
      if (wrong >= 1) { ctx.beginPath(); ctx.arc(120, 52, 14, 0, Math.PI * 2); ctx.stroke(); }
      if (wrong >= 2) { ctx.beginPath(); ctx.moveTo(120, 66); ctx.lineTo(120, 120); ctx.stroke(); }
      if (wrong >= 3) { ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(98, 100); ctx.stroke(); }
      if (wrong >= 4) { ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(142, 100); ctx.stroke(); }
      if (wrong >= 5) { ctx.beginPath(); ctx.moveTo(120, 120); ctx.lineTo(100, 155); ctx.stroke(); }
      if (wrong >= 6) { ctx.beginPath(); ctx.moveTo(120, 120); ctx.lineTo(140, 155); ctx.stroke(); }
    }
    $("hgNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 11. PONG ============ */
  (function () {
    var W = 360, H = 480;
    var canvas = $("pgCanvas"), ctx = canvas.getContext("2d");
    var you = 0, cpu = 0, playing = false, raf = null;
    var py = H / 2 - 35, cy = H / 2 - 35;          // paddle y (top), paddles 70 tall
    var ball = { x: W / 2, y: H / 2, vx: 4, vy: 3, r: 7 };
    var keys = {};

    function drawBoard() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#2c3743";
      ctx.setLineDash([8, 10]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);
    }
    function draw() {
      drawBoard();
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(8, py, 10, 70);
      ctx.fillStyle = "#f87171";
      ctx.fillRect(W - 18, cy, 10, 70);
      ctx.fillStyle = "#e8edf2";
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    }
    function resetBall(dir) {
      ball.x = W / 2; ball.y = H / 2;
      ball.vx = DP.pong[diff()].ball * dir; ball.vy = (Math.random() * 4 - 2) || 2;
    }
    function point(who) {
      if (who === "you") you++; else cpu++;
      $("pgYou").textContent = you; $("pgCpu").textContent = cpu;
      if (you >= 7 || cpu >= 7) {
        playing = false;
        banner($("pgBanner"), (you >= 7 ? "You win! <b>" + you + " - " + cpu + "</b>" : "CPU wins <b>" + cpu + " - " + you + "</b>"));
      }
      resetBall(who === "you" ? 1 : -1);
    }
    function step() {
      if (!playing) { raf = null; return; }
      if (keys.ArrowUp) py = Math.max(0, py - 7);
      if (keys.ArrowDown) py = Math.min(H - 70, py + 7);
      var cpuSp = DP.pong[diff()].cpu;
      var centre = cy + 35;
      if (centre < ball.y - 12) cy = Math.min(H - 70, cy + cpuSp);
      else if (centre > ball.y + 12) cy = Math.max(0, cy - cpuSp);
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.y < ball.r) { ball.y = ball.r; ball.vy = -ball.vy; beep(220, 0.05); }
      if (ball.y > H - ball.r) { ball.y = H - ball.r; ball.vy = -ball.vy; beep(220, 0.05); }
      if (ball.vx < 0 && ball.x - ball.r < 18 && ball.x > 8 && ball.y > py - 8 && ball.y < py + 78) {
        ball.vx = Math.min(9, -ball.vx * 1.06);
        ball.vy += ((ball.y - (py + 35)) / 35) * 2.2;
        beep(440, 0.06);
      }
      if (ball.vx > 0 && ball.x + ball.r > W - 18 && ball.x < W - 8 && ball.y > cy - 8 && ball.y < cy + 78) {
        ball.vx = Math.max(-9, -ball.vx * 1.06);
        ball.vy += ((ball.y - (cy + 35)) / 35) * 2.2;
        beep(440, 0.06);
      }
      if (ball.x < -20) { beep(150, 0.2); point("cpu"); }
      if (ball.x > W + 20) { beep(600, 0.15); point("you"); }
      draw();
      raf = requestAnimationFrame(step);
    }
    function start() {
      you = 0; cpu = 0;
      $("pgYou").textContent = "0"; $("pgCpu").textContent = "0";
      hideBanner($("pgBanner"));
      py = H / 2 - 35; cy = H / 2 - 35;
      resetBall(Math.random() < 0.5 ? 1 : -1);
      playing = true;
      if (!raf) raf = requestAnimationFrame(step);
    }
    function pointerMove(clientY) {
      var r = canvas.getBoundingClientRect();
      py = Math.max(0, Math.min(H - 70, (clientY - r.top) / r.height * H - 35));
    }
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (e.touches[0]) pointerMove(e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener("touchstart", function (e) {
      if (e.touches[0]) pointerMove(e.touches[0].clientY);
    }, { passive: true });
    canvas.addEventListener("mousemove", function (e) { pointerMove(e.clientY); });
    document.addEventListener("keydown", function (e) { keys[e.key] = true; });
    document.addEventListener("keyup", function (e) { keys[e.key] = false; });
    $("pgStart").addEventListener("click", start);
    stopFns.pong = function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    drawBoard();
  })();

  /* ============ 12. CONNECT FOUR ============ */
  (function () {
    var ROWS = 6, COLS = 7;
    var grid, over, moveCount;
    var board = $("c4Board");

    function reset() {
      grid = [];
      for (var r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill(0));
      over = false; moveCount = 0;
      $("c4Status").textContent = "Your turn";
      hideBanner($("c4Banner"));
      build();
    }
    function build() {
      board.innerHTML = "";
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var b = document.createElement("button");
          b.className = "c4-cell";
          b.setAttribute("data-r", r); b.setAttribute("data-c", c);
          board.appendChild(b);
        }
      }
    }
    function render(winCells) {
      var cells = board.children;
      for (var i = 0; i < cells.length; i++) {
        var r = +cells[i].getAttribute("data-r"), c = +cells[i].getAttribute("data-c");
        cells[i].className = "c4-cell" + (grid[r][c] === 1 ? " p" : grid[r][c] === 2 ? " c" : "");
        if (winCells) {
          for (var w = 0; w < winCells.length; w++) {
            if (winCells[w][0] === r && winCells[w][1] === c) cells[i].classList.add("win");
          }
        }
      }
    }
    function drop(col, who) {
      for (var r = ROWS - 1; r >= 0; r--) {
        if (!grid[r][col]) { grid[r][col] = who; return r; }
      }
      return -1;
    }
    function findWin(who) {
      var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          if (grid[r][c] !== who) continue;
          for (var d = 0; d < dirs.length; d++) {
            var cells = [[r, c]];
            for (var k = 1; k < 4; k++) {
              var rr = r + dirs[d][0] * k, cc = c + dirs[d][1] * k;
              if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || grid[rr][cc] !== who) break;
              cells.push([rr, cc]);
            }
            if (cells.length === 4) return cells;
          }
        }
      }
      return null;
    }
    function full(col) {
      return grid[0][col] !== 0;
    }
    function playerMove(col) {
      if (over || full(col)) return;
      drop(col, 1); moveCount++;
      beep(440, 0.06);
      var win = findWin(1);
      if (win) { over = true; render(win); $("c4Status").textContent = "You win!"; banner($("c4Banner"), "You win! <b>4 in a row</b>"); beep(700, 0.25); return; }
      if (moveCount === 42) { over = true; render(); $("c4Status").textContent = "Draw"; banner($("c4Banner"), "Board full - <b>draw</b>"); return; }
      render();
      $("c4Status").textContent = "CPU thinking...";
      setTimeout(cpuMove, 420);
    }
    function cpuMove() {
      if (over) return;
      var col = pickColumn();
      if (col < 0) return;
      drop(col, 2); moveCount++;
      beep(300, 0.06);
      var win = findWin(2);
      if (win) { over = true; render(win); $("c4Status").textContent = "CPU wins"; banner($("c4Banner"), "CPU wins <b>" + win.length + " in a row</b>"); beep(150, 0.3); return; }
      if (moveCount === 42) { over = true; render(); $("c4Status").textContent = "Draw"; banner($("c4Banner"), "Board full - <b>draw</b>"); return; }
      render();
      $("c4Status").textContent = "Your turn";
    }
    function pickColumn() {
      var cfg = DP.connect4[diff()];
      if (cfg.depth) return bestColumnMinimax(cfg.depth);
      var i, c;
      // 1. win now
      for (i = 0; i < COLS; i++) {
        if (!full(i)) { drop(i, 2); var w = findWin(2); undrop(i); if (w) return i; }
      }
      // 2. block player win
      for (i = 0; i < COLS; i++) {
        if (!full(i)) { drop(i, 1); var w2 = findWin(1); undrop(i); if (w2) return i; }
      }
      // easy: half the time just play a random column
      if (cfg.rand && Math.random() < cfg.rand) {
        var anyCol = [];
        for (i = 0; i < COLS; i++) if (!full(i)) anyCol.push(i);
        if (anyCol.length) return anyCol[Math.floor(Math.random() * anyCol.length)];
      }
      var order = [3, 2, 4, 1, 5, 0, 6];
      var open = [];
      for (i = 0; i < order.length; i++) { c = order[i]; if (!full(c)) open.push(c); }
      if (!open.length) return -1;
      var pick = open[Math.floor(Math.random() * Math.min(3, open.length))];
      // hard: don't hand the player an immediate win
      if (cfg.safe) {
        drop(pick, 2);
        var safePick = !opponentCanWinNow();
        undrop(pick);
        if (!safePick) {
          for (i = 0; i < open.length; i++) {
            drop(open[i], 2);
            var ok = !opponentCanWinNow();
            undrop(open[i]);
            if (ok) return open[i];
          }
        }
      }
      return pick;
    }
    function opponentCanWinNow() {
      for (var i = 0; i < COLS; i++) {
        if (!full(i)) { drop(i, 1); var w = findWin(1); undrop(i); if (w) return true; }
      }
      return false;
    }
    function bestColumnMinimax(depth) {
      var bestScore = -Infinity, bestCols = [];
      for (var c = 0; c < COLS; c++) {
        if (full(c)) continue;
        drop(c, 2);
        var s = minimaxC4(depth - 1, false);
        undrop(c);
        if (s > bestScore) { bestScore = s; bestCols = [c]; }
        else if (s === bestScore) bestCols.push(c);
      }
      return bestCols.length ? bestCols[Math.floor(Math.random() * bestCols.length)] : -1;
    }
    function minimaxC4(depth, maximizing) {
      var score = evalBoard();
      if (score >= 100000 || score <= -100000) return score;
      if (depth === 0) return score;
      var anyOpen = false;
      for (var c0 = 0; c0 < COLS; c0++) if (!full(c0)) { anyOpen = true; break; }
      if (!anyOpen) return 0;
      if (maximizing) {
        var best = -Infinity;
        for (var c = 0; c < COLS; c++) {
          if (full(c)) continue;
          drop(c, 2);
          best = Math.max(best, minimaxC4(depth - 1, false));
          undrop(c);
        }
        return best;
      }
      var worst = Infinity;
      for (var c2 = 0; c2 < COLS; c2++) {
        if (full(c2)) continue;
        drop(c2, 1);
        worst = Math.min(worst, minimaxC4(depth - 1, true));
        undrop(c2);
      }
      return worst;
    }
    function evalBoard() {
      if (findWin(2)) return 100000;
      if (findWin(1)) return -100000;
      var s = 0;
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        var w = 3 - Math.abs(3 - c);
        if (grid[r][c] === 2) s += w;
        else if (grid[r][c] === 1) s -= w;
      }
      return s;
    }
    function undrop(col) {
      for (var r = 0; r < ROWS; r++) {
        if (grid[r][col]) { grid[r][col] = 0; return; }
      }
    }
    board.addEventListener("click", function (e) {
      var c = e.target.getAttribute("data-c");
      if (c !== null) playerMove(+c);
    });
    $("c4New").addEventListener("click", reset);
    reset();
  })();

  /* ============ 13. LIGHTS OUT ============ */
  (function () {
    var N = 5;
    var grid, moves, done;
    var gridEl = $("loGrid");

    function reset() {
      grid = [];
      for (var r = 0; r < N; r++) grid.push(new Array(N).fill(false));
      // generate by pressing random cells from an all-off board (guarantees solvable)
      var pr = DP.lightsout[diff()].presses;
      var presses = pr[0] + Math.floor(Math.random() * (pr[1] - pr[0] + 1));
      for (var p = 0; p < presses; p++) toggle(Math.floor(Math.random() * N), Math.floor(Math.random() * N));
      moves = 0; done = false;
      $("loMoves").textContent = "0";
      hideBanner($("loBanner"));
      render();
    }
    function toggle(r, c) {
      var around = [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      for (var i = 0; i < around.length; i++) {
        var rr = around[i][0], cc = around[i][1];
        if (rr >= 0 && rr < N && cc >= 0 && cc < N) grid[rr][cc] = !grid[rr][cc];
      }
    }
    function render() {
      gridEl.innerHTML = "";
      for (var r = 0; r < N; r++) {
        for (var c = 0; c < N; c++) {
          (function (r, c) {
            var b = document.createElement("button");
            b.className = "lo-cell" + (grid[r][c] ? " on" : "");
            b.addEventListener("click", function () { tap(r, c); });
            gridEl.appendChild(b);
          })(r, c);
        }
      }
    }
    function tap(r, c) {
      if (done) return;
      toggle(r, c);
      moves++;
      $("loMoves").textContent = moves;
      render();
      beep(grid[r][c] ? 520 : 330, 0.05);
      var lit = 0;
      for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) if (grid[i][j]) lit++;
      if (lit === 0) {
        done = true;
        var best = lsGet("loBest", null);
        if (best === null || moves < best) { best = moves; lsSet("loBest", best); }
        $("loBest").innerHTML = best;
        banner($("loBanner"), "Lights out in <b>" + moves + "</b> moves!");
        beep(700, 0.25);
      }
    }
    $("loNew").addEventListener("click", reset);
    $("loBest").innerHTML = lsGet("loBest", "\u221E");
    reset();
  })();

  /* ============ 14. REACTION TEST ============ */
  (function () {
    var panel = $("rxPanel");
    var state = "idle";        // idle | wait | go
    var goTime = 0, times = [], to = null;

    function setPanel(cls, text) {
      panel.className = cls;
      panel.textContent = text;
    }
    function clearTo() { if (to) { clearTimeout(to); to = null; } }
    function next() {
      var cfg = DP.reaction[diff()];
      state = "wait";
      setPanel("wait", "Wait for green...");
      clearTo();
      to = setTimeout(function () {
        state = "go";
        goTime = performance.now();
        setPanel("go", "TAP!");
      }, cfg.min + Math.random() * (cfg.max - cfg.min));
    }
    function finishSet() {
      var sum = 0;
      for (var i = 0; i < times.length; i++) sum += times[i];
      var avg = Math.round(sum / times.length);
      $("rxAvg").textContent = avg + "ms";
      banner($("rxBanner"), "Set done! Average: <b>" + avg + " ms</b>");
      beep(700, 0.2);
      state = "idle";
      setPanel("", "Tap to begin");
    }
    panel.addEventListener("click", function () {
      if (state === "idle") {
        times = [];
        $("rxAvg").textContent = "\u2014";
        hideBanner($("rxBanner"));
        next();
      } else if (state === "wait") {
        // too early
        clearTo();
        var ecfg = DP.reaction[diff()];
        if (ecfg.early === "restart") {
          // easy: gentle restart of the wait, no penalty
          beep(150, 0.15);
          next();
        } else if (ecfg.early === "fail") {
          // hard+: the whole set is failed
          state = "idle";
          times = [];
          setPanel("early", "Too early! Set failed");
          banner($("rxBanner"), "Too early! <b>Set failed</b> - tap to start over");
          beep(150, 0.25);
        } else {
          state = "idle";
          setPanel("early", "Too early! Tap to retry");
          beep(150, 0.25);
        }
      } else if (state === "go") {
        var runs = DP.reaction[diff()].runs;
        var ms = Math.round(performance.now() - goTime);
        times.push(ms);
        beep(520, 0.06);
        var best = lsGet("rxBest", null);
        if (best === null || ms < best) { best = ms; lsSet("rxBest", best); }
        $("rxBest").textContent = best + "ms";
        if (times.length >= runs) finishSet();
        else { state = "idle"; setPanel("", ms + " ms\nTap for run " + (times.length + 1) + "/" + runs); }
      }
    });
    $("rxReset").addEventListener("click", function () {
      clearTo();
      state = "idle";
      times = [];
      $("rxAvg").textContent = "\u2014";
      hideBanner($("rxBanner"));
      setPanel("", "Tap to begin");
    });
    stopFns.reaction = clearTo;
    var b = lsGet("rxBest", null);
    if (b !== null) $("rxBest").textContent = b + "ms";
  })();

  /* ============ 15. DODGER ============ */
  (function () {
    var W = 360, H = 480;
    var canvas = $("dgCanvas"), ctx = canvas.getContext("2d");
    var playing = false, raf = null;
    var px = W / 2 - 14, pw = 28, ph = 28;   // player box
    var blocks = [], score = 0, spawnIn = 0;

    function speed() { return DP.dodger[diff()].speed + Math.min(7, score / 8); }
    function reset() {
      blocks = []; score = 0; spawnIn = 0;
      px = W / 2 - 14;
      $("dgScore").textContent = "0";
      draw();
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(px, H - 50, pw, ph);
      ctx.fillStyle = "#f87171";
      for (var i = 0; i < blocks.length; i++) {
        ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h);
      }
    }
    function step() {
      if (!playing) { raf = null; return; }
      spawnIn--;
      if (spawnIn <= 0) {
        var bw = 40 + Math.random() * 70;
        blocks.push({ x: Math.random() * (W - bw), y: -40, w: bw, h: 26 });
        var sp = DP.dodger[diff()].spawn;
        spawnIn = Math.max(sp * 0.4, sp - score * 2);
      }
      var s = speed();
      for (var i = blocks.length - 1; i >= 0; i--) {
        var b = blocks[i];
        b.y += s;
        // collision with player at bottom
        if (b.y + b.h > H - 50 && b.y < H - 50 + ph && b.x < px + pw && b.x + b.w > px) {
          die();
          return;
        }
        if (b.y > H) {
          blocks.splice(i, 1);
          score++;
          $("dgScore").textContent = score;
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function die() {
      playing = false;
      beep(150, 0.35);
      var best = lsGet("dgBest", 0);
      if (score > best) { best = score; lsSet("dgBest", best); }
      $("dgBest").textContent = best;
      banner($("dgBanner"), "Crashed! Score: <b>" + score + "</b>");
      draw();
    }
    function start() {
      hideBanner($("dgBanner"));
      reset();
      playing = true;
      if (!raf) raf = requestAnimationFrame(step);
    }
    function pointerMove(clientX) {
      var r = canvas.getBoundingClientRect();
      px = Math.max(0, Math.min(W - pw, (clientX - r.left) / r.width * W - pw / 2));
      if (!playing) draw();
    }
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (e.touches[0]) pointerMove(e.touches[0].clientX);
    }, { passive: false });
    canvas.addEventListener("touchstart", function (e) {
      if (e.touches[0]) pointerMove(e.touches[0].clientX);
    }, { passive: true });
    canvas.addEventListener("mousemove", function (e) { pointerMove(e.clientX); });
    $("dgStart").addEventListener("click", start);
    stopFns.dodger = function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    $("dgBest").textContent = lsGet("dgBest", 0);
    reset();
  })();

  /* ============ 16. TETRIS ============ */
  (function () {
    var W = 360, H = 480, BW = 10, BH = 20, CELL = 24, OX = (W - BW * CELL) / 2;
    var canvas = $("tetCanvas"), ctx = canvas.getContext("2d");
    var SHAPES = [
      [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      [[1,1],[1,1]],
      [[0,1,0],[1,1,1],[0,0,0]],
      [[0,1,1],[1,1,0],[0,0,0]],
      [[1,1,0],[0,1,1],[0,0,0]],
      [[1,0,0],[1,1,1],[0,0,0]],
      [[0,0,1],[1,1,1],[0,0,0]]
    ];
    var COLORS = ["#38bdf8", "#fbbf24", "#a78bfa", "#4ade80", "#f87171", "#60a5fa", "#fb923c"];
    var board, cur, bag, score, lines, playing, over, raf = null, dropAcc = 0, lastT = 0;
    var best = lsGet("gb_tetris_best", 0);
    $("tetBest").textContent = best;

    function newPiece() {
      if (!bag || !bag.length) {
        bag = [0, 1, 2, 3, 4, 5, 6];
        for (var i = bag.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = bag[i]; bag[i] = bag[j]; bag[j] = t;
        }
      }
      var id = bag.pop();
      return { id: id, m: SHAPES[id].map(function (r) { return r.slice(); }), x: 3, y: -1 };
    }
    function collide(m, px, py) {
      for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        var x = px + c, y = py + r;
        if (x < 0 || x >= BW || y >= BH) return true;
        if (y >= 0 && board[y][x]) return true;
      }
      return false;
    }
    function rotateMat(m) {
      var n = m.length, out = [];
      for (var r = 0; r < n; r++) { out.push([]); for (var c = 0; c < n; c++) out[r][c] = m[n - 1 - c][r]; }
      return out;
    }
    function tryRotate() {
      if (!playing) return;
      var m2 = rotateMat(cur.m);
      if (!collide(m2, cur.x, cur.y)) cur.m = m2;
      else if (!collide(m2, cur.x - 1, cur.y)) { cur.m = m2; cur.x--; }
      else if (!collide(m2, cur.x + 1, cur.y)) { cur.m = m2; cur.x++; }
      draw();
    }
    function move(dx) {
      if (!playing) return;
      if (!collide(cur.m, cur.x + dx, cur.y)) { cur.x += dx; draw(); }
    }
    function stepDown(manual) {
      if (!playing) return;
      if (!collide(cur.m, cur.x, cur.y + 1)) {
        cur.y++;
        if (manual) { score++; $("tetScore").textContent = score; }
      } else lock();
      draw();
    }
    function hardDrop() {
      if (!playing) return;
      while (!collide(cur.m, cur.x, cur.y + 1)) { cur.y++; score += 2; }
      $("tetScore").textContent = score;
      lock();
    }
    function lock() {
      for (var r = 0; r < cur.m.length; r++) for (var c = 0; c < cur.m[r].length; c++) {
        if (!cur.m[r][c]) continue;
        var y = cur.y + r;
        if (y < 0) { gameOver(); return; }
        board[y][cur.x + c] = cur.id + 1;
      }
      var cleared = 0;
      for (var rr = BH - 1; rr >= 0; rr--) {
        var full = true;
        for (var cc = 0; cc < BW; cc++) if (!board[rr][cc]) full = false;
        if (full) {
          board.splice(rr, 1);
          board.unshift(new Array(BW).fill(0));
          cleared++;
          rr++;
        }
      }
      if (cleared) {
        score += [0, 100, 300, 500, 800][cleared];
        lines += cleared;
        $("tetScore").textContent = score;
        $("tetLines").textContent = lines;
        beep(440 + cleared * 110, 0.12);
      } else {
        beep(200, 0.04);
      }
      cur = newPiece();
      if (collide(cur.m, cur.x, cur.y)) gameOver();
    }
    function gameOver() {
      playing = false; over = true;
      if (score > best) { best = score; lsSet("gb_tetris_best", best); $("tetBest").textContent = best; }
      banner($("tetBanner"), "Topped out! Score: <b>" + score + "</b> (" + lines + " lines)");
      draw();
    }
    function dropInterval() {
      return Math.max(70, DP.tetris[diff()].drop * Math.pow(0.93, Math.floor(lines / 10)));
    }
    function frame(t) {
      if (!playing) { raf = null; return; }
      if (!lastT) lastT = t;
      dropAcc += t - lastT;
      lastT = t;
      if (dropAcc > dropInterval()) { dropAcc = 0; stepDown(false); }
      raf = requestAnimationFrame(frame);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#10161c";
      ctx.fillRect(OX, 0, BW * CELL, H);
      for (var r = 0; r < BH; r++) for (var c = 0; c < BW; c++) {
        if (board[r][c]) {
          ctx.fillStyle = COLORS[board[r][c] - 1];
          ctx.fillRect(OX + c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      if (cur && playing) {
        ctx.fillStyle = COLORS[cur.id];
        for (var r2 = 0; r2 < cur.m.length; r2++) for (var c2 = 0; c2 < cur.m[r2].length; c2++) {
          if (!cur.m[r2][c2] || cur.y + r2 < 0) continue;
          ctx.fillRect(OX + (cur.x + c2) * CELL + 1, (cur.y + r2) * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      if (!playing) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#e8edf2";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(over ? "Game Over" : "Tap Start to play", W / 2, H / 2);
      }
    }
    function reset() {
      board = [];
      for (var r = 0; r < BH; r++) board.push(new Array(BW).fill(0));
      bag = []; cur = newPiece();
      score = 0; lines = 0; playing = false; over = false;
      dropAcc = 0; lastT = 0;
      $("tetScore").textContent = "0";
      $("tetLines").textContent = "0";
      hideBanner($("tetBanner"));
      draw();
    }
    $("tetStart").addEventListener("click", function () {
      reset();
      playing = true;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    var tbtns = document.querySelectorAll(".tet-ctrls button");
    for (var i = 0; i < tbtns.length; i++) {
      tbtns[i].addEventListener("click", function () {
        var a = this.getAttribute("data-tet");
        if (a === "left") move(-1);
        else if (a === "right") move(1);
        else if (a === "rotate") tryRotate();
        else if (a === "soft") stepDown(true);
        else if (a === "hard") hardDrop();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (current !== "tetris") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); tryRotate(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); stepDown(true); }
      else if (e.key === " ") { e.preventDefault(); hardDrop(); }
    });
    stopFns.tetris = function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    reset();
  })();

  /* ============ 17. SLIDING PUZZLE ============ */
  (function () {
    var N, tiles, moves, done;

    function neighbors(i) {
      var r = Math.floor(i / N), c = i % N, out = [];
      if (r > 0) out.push(i - N);
      if (r < N - 1) out.push(i + N);
      if (c > 0) out.push(i - 1);
      if (c < N - 1) out.push(i + 1);
      return out;
    }
    function solved() {
      for (var i = 0; i < tiles.length - 1; i++) if (tiles[i] !== i + 1) return false;
      return true;
    }
    function reset() {
      N = DP.slide[diff()].size;
      $("slGrid").style.gridTemplateColumns = "repeat(" + N + ", 1fr)";
      tiles = [];
      for (var i = 1; i < N * N; i++) tiles.push(i);
      tiles.push(0);
      do {
        for (var s = 0; s < N * N * 30; s++) {
          var blank = tiles.indexOf(0);
          var nbrs = neighbors(blank);
          var pick = nbrs[Math.floor(Math.random() * nbrs.length)];
          tiles[blank] = tiles[pick];
          tiles[pick] = 0;
        }
      } while (solved());
      moves = 0; done = false;
      $("slMoves").textContent = "0";
      hideBanner($("slBanner"));
      $("slBest").textContent = lsGet("gb_slide_best_" + N, "\u221E");
      render();
    }
    function render() {
      var el = $("slGrid");
      el.innerHTML = "";
      for (var i = 0; i < tiles.length; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "sl-cell" + (tiles[i] === 0 ? " blank" : "");
          b.textContent = tiles[i] === 0 ? "" : tiles[i];
          b.addEventListener("click", function () { tap(i); });
          el.appendChild(b);
        })(i);
      }
    }
    function tap(i) {
      if (done || tiles[i] === 0) return;
      var blank = tiles.indexOf(0);
      if (neighbors(blank).indexOf(i) < 0) return;
      tiles[blank] = tiles[i];
      tiles[i] = 0;
      moves++;
      $("slMoves").textContent = moves;
      beep(330, 0.03);
      render();
      if (solved()) {
        done = true;
        var best = lsGet("gb_slide_best_" + N, null);
        if (best === null || moves < best) { best = moves; lsSet("gb_slide_best_" + N, best); }
        $("slBest").textContent = best;
        banner($("slBanner"), "Solved in <b>" + moves + "</b> moves!");
        beep(700, 0.25);
      }
    }
    $("slNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 18. MATH BLITZ ============ */
  (function () {
    var score, timeLeft, running = false, timer = null, answer;

    function rnd(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    function makeQuestion() {
      var c = DP.math[diff()];
      var ops = c.ops.split("");
      var op = ops[Math.floor(Math.random() * ops.length)];
      var a, b, ans;
      if (op === "+") { a = rnd(c.lo, c.hi); b = rnd(c.lo, c.hi); ans = a + b; }
      else if (op === "-") { a = rnd(c.lo, c.hi); b = rnd(c.lo, c.hi); if (b > a) { var t = a; a = b; b = t; } ans = a - b; }
      else if (op === "*") { a = rnd(c.mlo, c.mhi); b = rnd(c.mlo, c.mhi); ans = a * b; }
      else { b = rnd(2, 12); var q = rnd(2, 12); a = b * q; ans = q; }
      answer = ans;
      $("mqQ").textContent = a + " " + (op === "*" ? "\u00D7" : op === "/" ? "\u00F7" : op) + " " + b + " = ?";
      var opts = [ans];
      var offs = [-1, 1, -2, 2, -10, 10, 3, -3];
      while (opts.length < 4) {
        var o = ans + offs[Math.floor(Math.random() * offs.length)];
        if (opts.indexOf(o) < 0) opts.push(o);
      }
      shuffle(opts);
      var el = $("mqOpts");
      el.innerHTML = "";
      opts.forEach(function (o) {
        var btn = document.createElement("button");
        btn.className = "mq-opt";
        btn.textContent = o;
        btn.addEventListener("click", function () { pick(o, btn); });
        el.appendChild(btn);
      });
    }
    function pick(o, btn) {
      if (!running) return;
      if (o === answer) {
        score++;
        $("mqScore").textContent = score;
        beep(520, 0.05);
        makeQuestion();
      } else {
        timeLeft -= DP.math[diff()].pen;
        $("mqTime").textContent = timeLeft;
        btn.classList.add("bad");
        btn.disabled = true;
        beep(150, 0.15);
        if (timeLeft <= 0) end();
      }
    }
    function start() {
      var c = DP.math[diff()];
      score = 0; timeLeft = c.time; running = true;
      $("mqScore").textContent = "0";
      $("mqTime").textContent = timeLeft;
      hideBanner($("mqBanner"));
      $("mqStart").textContent = "Restart";
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        timeLeft--;
        $("mqTime").textContent = timeLeft;
        if (timeLeft <= 0) end();
      }, 1000);
      makeQuestion();
    }
    function end() {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
      var best = lsGet("gb_math_best_" + diff(), 0);
      if (score > best) { best = score; lsSet("gb_math_best_" + diff(), best); }
      $("mqQ").textContent = "Time!";
      $("mqOpts").innerHTML = "";
      banner($("mqBanner"), "Time! You scored <b>" + score + "</b>");
      $("mqStart").textContent = "Start";
      beep(700, 0.2);
    }
    $("mqStart").addEventListener("click", start);
    stopFns.math = function () { running = false; if (timer) { clearInterval(timer); timer = null; } };
    $("mqTime").textContent = DP.math[diff()].time;
  })();

  /* ============ 19. SPACE INVADERS ============ */
  (function () {
    var W = 360, H = 480;
    var canvas = $("siCanvas"), ctx = canvas.getContext("2d");
    var px, pw = 34, aliens, dirRight, shots, bombs, score, lives, wave, playing, raf = null;
    var lastShot = 0, lastBomb = 0;
    var ROWCOLS = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa"];

    function cfg() { return DP.invaders[diff()]; }
    function fleetAlive() { var n = 0; for (var i = 0; i < aliens.length; i++) if (aliens[i].alive) n++; return n; }
    function makeWave() {
      var c = cfg();
      aliens = [];
      var spacing = Math.min(42, (W - 60) / c.cols);
      for (var r = 0; r < c.rows; r++) for (var col = 0; col < c.cols; col++) {
        aliens.push({ x: 24 + col * spacing, y: 60 + r * 32 + Math.min(wave - 1, 3) * 12, w: spacing - 14, h: 18, row: r, alive: true });
      }
      dirRight = true;
      shots = []; bombs = [];
    }
    function reset() {
      var c = cfg();
      score = 0; lives = c.lives; wave = 1;
      px = W / 2 - pw / 2;
      $("siScore").textContent = "0";
      $("siLives").textContent = lives;
      $("siWave").textContent = "1";
      hideBanner($("siBanner"));
      makeWave();
      draw();
    }
    function speed() {
      var c = cfg();
      return c.alienSpd * (1 + (1 - fleetAlive() / aliens.length) * 2) * (1 + (wave - 1) * 0.15);
    }
    function gameOver(msg) {
      playing = false;
      beep(120, 0.4);
      var best = lsGet("gb_inv_best", 0);
      if (score > best) { best = score; lsSet("gb_inv_best", best); }
      banner($("siBanner"), msg + " Score: <b>" + score + "</b> (wave " + wave + ")");
      draw();
    }
    function hitPlayer() {
      lives--;
      $("siLives").textContent = lives;
      beep(150, 0.2);
      if (lives <= 0) gameOver("Ship destroyed!");
    }
    function step() {
      if (!playing) { raf = null; return; }
      var c = cfg(), now = performance.now();
      var sp = speed(), edge = false;
      for (var i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (!a.alive) continue;
        a.x += sp * (dirRight ? 1 : -1);
        if (a.x < 4 || a.x + a.w > W - 4) edge = true;
        if (a.y + a.h > H - 70) { gameOver("Invaded!"); return; }
      }
      if (edge) {
        dirRight = !dirRight;
        for (var j = 0; j < aliens.length; j++) aliens[j].y += 14;
      }
      if (now - lastShot > 480) { shots.push({ x: px + pw / 2, y: H - 58 }); lastShot = now; beep(600, 0.03); }
      for (var s = shots.length - 1; s >= 0; s--) {
        shots[s].y -= 6;
        if (shots[s].y < -8) { shots.splice(s, 1); continue; }
        for (var k = 0; k < aliens.length; k++) {
          var al = aliens[k];
          if (!al.alive) continue;
          if (shots[s].x > al.x && shots[s].x < al.x + al.w && shots[s].y < al.y + al.h && shots[s].y > al.y) {
            al.alive = false;
            shots.splice(s, 1);
            score += 10;
            $("siScore").textContent = score;
            beep(300, 0.05);
            break;
          }
        }
      }
      if (now - lastBomb > c.bombEvery) {
        var alive = [];
        for (var m = 0; m < aliens.length; m++) if (aliens[m].alive) alive.push(aliens[m]);
        if (alive.length) {
          var shooter = alive[Math.floor(Math.random() * alive.length)];
          bombs.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h });
        }
        lastBomb = now;
      }
      for (var b = bombs.length - 1; b >= 0; b--) {
        bombs[b].y += c.bombSpd;
        if (bombs[b].y > H) { bombs.splice(b, 1); continue; }
        if (bombs[b].x > px + 4 && bombs[b].x < px + pw - 4 && bombs[b].y > H - 56 && bombs[b].y < H - 30) {
          bombs.splice(b, 1);
          hitPlayer();
          if (!playing) return;
        }
      }
      if (fleetAlive() === 0) {
        wave++;
        score += 100;
        $("siWave").textContent = wave;
        $("siScore").textContent = score;
        beep(700, 0.2);
        makeWave();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < aliens.length; i++) {
        var a = aliens[i];
        if (!a.alive) continue;
        ctx.fillStyle = ROWCOLS[a.row % ROWCOLS.length];
        ctx.fillRect(a.x, a.y, a.w, a.h);
      }
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(px, H - 50, pw, 16);
      ctx.fillStyle = "#e8edf2";
      for (var s = 0; s < shots.length; s++) ctx.fillRect(shots[s].x - 1, shots[s].y, 2, 8);
      ctx.fillStyle = "#f87171";
      for (var b = 0; b < bombs.length; b++) ctx.fillRect(bombs[b].x - 1.5, bombs[b].y, 3, 8);
      if (!playing) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#e8edf2";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to play", W / 2, H / 2);
      }
    }
    $("siStart").addEventListener("click", function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      reset();
      playing = true;
      lastShot = 0; lastBomb = 0;
      raf = requestAnimationFrame(step);
    });
    function pointerMove(clientX) {
      var r = canvas.getBoundingClientRect();
      px = Math.max(0, Math.min(W - pw, (clientX - r.left) / r.width * W - pw / 2));
    }
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (e.touches[0]) pointerMove(e.touches[0].clientX);
    }, { passive: false });
    canvas.addEventListener("touchstart", function (e) {
      if (e.touches[0]) pointerMove(e.touches[0].clientX);
    }, { passive: true });
    canvas.addEventListener("mousemove", function (e) { pointerMove(e.clientX); });
    document.addEventListener("keydown", function (e) {
      if (current !== "invaders") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); px = Math.max(0, px - 12); }
      else if (e.key === "ArrowRight") { e.preventDefault(); px = Math.min(W - pw, px + 12); }
    });
    stopFns.invaders = function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    reset();
    playing = false;
    draw();
  })();

  /* ============ 20. MASTERMIND ============ */
  (function () {
    var COLORS = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c", "#e8edf2", "#f472b6"];
    var code, cur, row, maxRows, done;

    function reset() {
      var c = DP.master[diff()];
      maxRows = c.rows;
      code = [];
      for (var i = 0; i < c.len; i++) code.push(Math.floor(Math.random() * c.colors));
      cur = new Array(c.len).fill(-1);
      row = 0; done = false;
      $("mmStatus").textContent = "Guess 1/" + maxRows;
      hideBanner($("mmBanner"));
      $("mmHistory").innerHTML = "";
      renderRow();
    }
    function renderRow() {
      var el = $("mmRow");
      el.innerHTML = "";
      var c = DP.master[diff()];
      for (var i = 0; i < c.len; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "mm-hole";
          if (cur[i] >= 0) b.style.background = COLORS[cur[i]];
          b.addEventListener("click", function () {
            if (done) return;
            cur[i] = (cur[i] + 1) % c.colors;
            b.style.background = COLORS[cur[i]];
            beep(400 + cur[i] * 40, 0.04);
          });
          el.appendChild(b);
        })(i);
      }
    }
    function check() {
      if (done) return;
      var c = DP.master[diff()];
      for (var i = 0; i < c.len; i++) if (cur[i] < 0) { banner($("mmBanner"), "Fill every hole first"); return; }
      hideBanner($("mmBanner"));
      var black = 0, white = 0;
      var codeRem = [], curRem = [];
      for (var j = 0; j < c.len; j++) {
        if (cur[j] === code[j]) black++;
        else { codeRem.push(code[j]); curRem.push(cur[j]); }
      }
      for (var k = 0; k < curRem.length; k++) {
        var idx = codeRem.indexOf(curRem[k]);
        if (idx >= 0) { white++; codeRem.splice(idx, 1); }
      }
      var pegs = "";
      for (var p = 0; p < c.len; p++) pegs += '<span class="mm-peg" style="background:' + COLORS[cur[p]] + '"></span>';
      var fb = "";
      for (var b2 = 0; b2 < black; b2++) fb += '<span class="mm-dot b"></span>';
      for (var w2 = 0; w2 < white; w2++) fb += '<span class="mm-dot w"></span>';
      var hr = document.createElement("div");
      hr.className = "mm-hrow";
      hr.innerHTML = '<div class="mm-pegs">' + pegs + '</div><div class="mm-fb">' + fb + '</div>';
      $("mmHistory").appendChild(hr);
      row++;
      if (black === c.len) {
        done = true;
        banner($("mmBanner"), "Cracked it in <b>" + row + "</b> guesses!");
        beep(700, 0.25);
        $("mmStatus").textContent = "Solved!";
        return;
      }
      if (row >= maxRows) {
        done = true;
        var sol = "";
        for (var s = 0; s < c.len; s++) sol += '<span class="mm-peg" style="background:' + COLORS[code[s]] + '"></span>';
        banner($("mmBanner"), "Out of guesses. The code was: " + sol);
        $("mmStatus").textContent = "Failed";
        return;
      }
      cur = new Array(c.len).fill(-1);
      renderRow();
      $("mmStatus").textContent = "Guess " + (row + 1) + "/" + maxRows;
    }
    $("mmCheck").addEventListener("click", check);
    $("mmNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 21. REVERSI ============ */
  (function () {
    var N = 8;
    var DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    var b, turn, over;   // 0 empty, 1 black (you), 2 white (cpu)

    function inB(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
    function flipsFor(r, c, who) {
      if (b[r][c]) return [];
      var all = [];
      for (var d = 0; d < 8; d++) {
        var line = [], rr = r + DIRS[d][0], cc = c + DIRS[d][1];
        while (inB(rr, cc) && b[rr][cc] === 3 - who) { line.push([rr, cc]); rr += DIRS[d][0]; cc += DIRS[d][1]; }
        if (line.length && inB(rr, cc) && b[rr][cc] === who) all = all.concat(line);
      }
      return all;
    }
    function legalMoves(who) {
      var out = [];
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        if (!b[r][c] && flipsFor(r, c, who).length) out.push([r, c]);
      }
      return out;
    }
    function apply(r, c, who) {
      var f = flipsFor(r, c, who);
      b[r][c] = who;
      for (var i = 0; i < f.length; i++) b[f[i][0]][f[i][1]] = who;
      return f.length;
    }
    function counts() {
      var bl = 0, wh = 0;
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { if (b[r][c] === 1) bl++; else if (b[r][c] === 2) wh++; }
      return [bl, wh];
    }
    function render(hints) {
      var el = $("rvBoard");
      el.innerHTML = "";
      var legal = {};
      if (hints) { var lm = legalMoves(turn); for (var i = 0; i < lm.length; i++) legal[lm[i][0] + "," + lm[i][1]] = true; }
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        (function (r, c) {
          var cell = document.createElement("button");
          cell.className = "rv-cell" + (b[r][c] === 1 ? " b" : b[r][c] === 2 ? " w" : "") + (legal[r + "," + c] ? " hint" : "");
          cell.addEventListener("click", function () { play(r, c); });
          el.appendChild(cell);
        })(r, c);
      }
      var ct = counts();
      $("rvYou").textContent = ct[0];
      $("rvCpu").textContent = ct[1];
    }
    function endCheck() {
      var myMoves = legalMoves(1), cpuMoves = legalMoves(2);
      if (myMoves.length === 0 && cpuMoves.length === 0) {
        over = true;
        var ct = counts();
        var msg = ct[0] > ct[1] ? "You win <b>" + ct[0] + " - " + ct[1] + "</b>!" : ct[0] < ct[1] ? "CPU wins <b>" + ct[1] + " - " + ct[0] + "</b>" : "Draw, <b>" + ct[0] + " - " + ct[1] + "</b>";
        banner($("rvBanner"), msg);
        $("rvStatus").textContent = "Game over";
        render(false);
        return true;
      }
      return false;
    }
    function play(r, c) {
      if (over || turn !== 1) return;
      if (!flipsFor(r, c, 1).length) return;
      apply(r, c, 1);
      beep(440, 0.06);
      turn = 2;
      render(false);
      $("rvStatus").textContent = "CPU thinking...";
      setTimeout(cpuTurn, 400);
    }
    function cpuTurn() {
      if (over) return;
      if (!legalMoves(2).length) {
        turn = 1;
        if (!legalMoves(1).length) { endCheck(); return; }
        $("rvStatus").textContent = "CPU passes — your turn";
        render(true);
        return;
      }
      var mv = pickMove();
      apply(mv[0], mv[1], 2);
      beep(300, 0.06);
      turn = 1;
      render(true);
      if (!legalMoves(1).length) {
        if (!legalMoves(2).length) { endCheck(); return; }
        turn = 2;
        $("rvStatus").textContent = "You pass — CPU moves";
        setTimeout(cpuTurn, 400);
        return;
      }
      $("rvStatus").textContent = "Your turn";
    }
    function pickMove() {
      var cfg = DP.reversi[diff()];
      var moves = legalMoves(2);
      if (!moves.length) return null;
      if (cfg.ai === "random" && Math.random() < 0.7) return moves[Math.floor(Math.random() * moves.length)];
      if (cfg.ai === "minimax") {
        var best = null, bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
          var saved = cloneBoard();
          apply(moves[i][0], moves[i][1], 2);
          var s = -mm(3 - 2, cfg.depth - 1, -Infinity, Infinity);
          restoreBoard(saved);
          if (s > bestScore) { bestScore = s; best = moves[i]; }
        }
        return best || moves[0];
      }
      // greedy / corner: weight corners & edges
      var W = [
        [120,-20,20,5,5,20,-20,120],
        [-20,-40,-5,-5,-5,-5,-40,-20],
        [20,-5,15,3,3,15,-5,20],
        [5,-5,3,3,3,3,-5,5],
        [5,-5,3,3,3,3,-5,5],
        [20,-5,15,3,3,15,-5,20],
        [-20,-40,-5,-5,-5,-5,-40,-20],
        [120,-20,20,5,5,20,-20,120]
      ];
      var bestW = -Infinity, pick = moves[0];
      for (var j = 0; j < moves.length; j++) {
        var w = W[moves[j][0]][moves[j][1]] + (cfg.ai === "greedy" ? 0 : flipsFor(moves[j][0], moves[j][1], 2).length * 2);
        if (cfg.ai === "greedy" && Math.random() < 0.3) w = flipsFor(moves[j][0], moves[j][1], 2).length;
        if (w > bestW) { bestW = w; pick = moves[j]; }
      }
      return pick;
    }
    function cloneBoard() { return b.map(function (r) { return r.slice(); }); }
    function restoreBoard(s) { b = s.map(function (r) { return r.slice(); }); }
    function mm(forWho, depth, alpha, beta) {
      var moves = legalMoves(forWho === 2 ? 2 : 1);
      var other = forWho === 2 ? 1 : 2;
      if (depth === 0) {
        var ct = counts();
        return forWho === 2 ? ct[1] - ct[0] : ct[0] - ct[1];
      }
      if (!moves.length) {
        var om = legalMoves(other);
        if (!om.length) { var ct2 = counts(); return (ct2[1] - ct2[0]) * 100; }
        return -mm(other, depth - 1, -beta, -alpha);
      }
      var best = -Infinity;
      for (var i = 0; i < moves.length; i++) {
        var saved = cloneBoard();
        apply(moves[i][0], moves[i][1], other === 1 ? 1 : 2);
        var s = -mm(other, depth - 1, -beta, -alpha);
        restoreBoard(saved);
        if (s > best) best = s;
        if (best > alpha) alpha = best;
        if (alpha >= beta) break;
      }
      return best;
    }
    function reset() {
      b = [];
      for (var r = 0; r < N; r++) b.push(new Array(N).fill(0));
      b[3][3] = 2; b[3][4] = 1; b[4][3] = 1; b[4][4] = 2;
      turn = 1; over = false;
      $("rvStatus").textContent = "Your turn";
      hideBanner($("rvBanner"));
      render(true);
    }
    $("rvNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 22. DOTS AND BOXES ============ */
  (function () {
    var n, hEdges, vEdges, boxes, turn, over;   // 1 you, 2 cpu

    function idx(r, c) { return r * n + c; }          // h edges & boxes
    function idxV(r, c) { return r * (n + 1) + c; }   // v edges (c can be n)
    function boxDone(r, c) {
      return hEdges[idx(r, c)] && hEdges[idx(r + 1, c)] && vEdges[idxV(r, c)] && vEdges[idxV(r, c + 1)];
    }
    function reset() {
      n = DP.dots[diff()].n;
      var total = n * (n + 1);
      hEdges = new Array(total).fill(0);   // h edge r,c = between (r-1,c) and (r,c) for r in 0..n
      vEdges = new Array(n * (n + 1)).fill(0);
      boxes = [];
      for (var r = 0; r < n; r++) { boxes.push([]); for (var c = 0; c < n; c++) boxes[r].push(0); }
      turn = 1; over = false;
      $("dbYou").textContent = "0"; $("dbCpu").textContent = "0";
      $("dbStatus").textContent = "Your turn";
      hideBanner($("dbBanner"));
      render();
    }
    function render() {
      var el = $("dbBoard");
      el.style.gridTemplateColumns = "repeat(" + (n * 2 + 1) + ", 1fr)";
      el.innerHTML = "";
      for (var gr = 0; gr <= 2 * n; gr++) {
        for (var gc = 0; gc <= 2 * n; gc++) {
          (function (gr, gc) {
            if (gr % 2 === 0 && gc % 2 === 0) {
              var d = document.createElement("div");
              d.className = "db-dot";
              el.appendChild(d);
            } else if (gr % 2 === 1 && gc % 2 === 0) {
              // horizontal edge: row gr+1 in hEdges (gr/2 rounded), col gc/2
              var hr = Math.floor(gr / 2) + (0), hc = gc / 2;
              var hBtn = document.createElement("button");
              hBtn.className = "db-edge db-h" + (hEdges[idx(hr, hc)] ? " " + (hEdges[idx(hr, hc)] === 1 ? "p" : "c") : "");
              hBtn.addEventListener("click", function () { drawEdge("h", hr, hc); });
              el.appendChild(hBtn);
            } else if (gr % 2 === 0 && gc % 2 === 1) {
              var vr = gr / 2, vc = Math.floor(gc / 2);
              var vBtn = document.createElement("button");
              vBtn.className = "db-edge db-v" + (vEdges[idxV(vr, vc)] ? " " + (vEdges[idxV(vr, vc)] === 1 ? "p" : "c") : "");
              vBtn.addEventListener("click", function () { drawEdge("v", vr, vc); });
              el.appendChild(vBtn);
            } else {
              var br = (gr - 1) / 2, bc = (gc - 1) / 2;
              var box = document.createElement("div");
              box.className = "db-box" + (boxes[br][bc] ? " " + (boxes[br][bc] === 1 ? "p" : "c") : "");
              el.appendChild(box);
            }
          })(gr, gc);
        }
      }
    }
    function placeEdge(kind, r, c, who) {
      if (kind === "h") hEdges[idx(r, c)] = who; else vEdges[idxV(r, c)] = who;
      var gained = 0;
      // horizontal edge at (r,c): boxes above (r-1,c) and below (r,c)
      var check = [];
      if (kind === "h") { check.push([r - 1, c], [r, c]); } else { check.push([r, c - 1], [r, c]); }
      for (var i = 0; i < check.length; i++) {
        var br = check[i][0], bc = check[i][1];
        if (br >= 0 && br < n && bc >= 0 && bc < n && !boxes[br][bc] && boxDone(br, bc)) {
          boxes[br][bc] = who;
          gained++;
        }
      }
      return gained;
    }
    function drawEdge(kind, r, c) {
      if (over || turn !== 1) return;
      if (kind === "h" && hEdges[idx(r, c)]) return;
      if (kind === "v" && vEdges[idxV(r, c)]) return;
      var g = placeEdge(kind, r, c, 1);
      beep(g ? 520 : 330, 0.05);
      render();
      updateScore();
      if (g) { if (checkEnd()) return; $("dbStatus").textContent = "Box! Go again"; return; }
      turn = 2;
      $("dbStatus").textContent = "CPU thinking...";
      setTimeout(cpuMove, 420);
    }
    function updateScore() {
      var you = 0, cpu = 0;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) { if (boxes[r][c] === 1) you++; else if (boxes[r][c] === 2) cpu++; }
      $("dbYou").textContent = you; $("dbCpu").textContent = cpu;
    }
    function checkEnd() {
      var total = n * n, got = 0;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (boxes[r][c]) got++;
      if (got === total) {
        over = true;
        var you = 0, cpu = 0;
        for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 < n; c2++) { if (boxes[r2][c2] === 1) you++; else cpu++; }
        banner($("dbBanner"), you > cpu ? "You win <b>" + you + " - " + cpu + "</b>!" : you < cpu ? "CPU wins <b>" + cpu + " - " + you + "</b>" : "Draw <b>" + you + " - " + cpu + "</b>");
        $("dbStatus").textContent = "Game over";
        return true;
      }
      return false;
    }
    function allEdges() {
      var out = [];
      for (var r = 0; r <= n; r++) for (var c = 0; c < n; c++) if (!hEdges[idx(r, c)]) out.push(["h", r, c]);
      for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 <= n; c2++) if (!vEdges[idxV(r2, c2)]) out.push(["v", r2, c2]);
      return out;
    }
    function edgesGivingBoxes(who) {
      // edges that complete at least one box
      var out = [];
      var all = allEdges();
      for (var i = 0; i < all.length; i++) {
        var e = all[i];
        var g = simulateGain(e, who);
        if (g > 0) out.push([e, g]);
      }
      return out;
    }
    function simulateGain(e, who) {
      var kind = e[0], r = e[1], c = e[2];
      if (kind === "h") hEdges[idx(r, c)] = who; else vEdges[idxV(r, c)] = who;
      var g = 0;
      var check = kind === "h" ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]];
      for (var i = 0; i < check.length; i++) {
        var br = check[i][0], bc = check[i][1];
        if (br >= 0 && br < n && bc >= 0 && bc < n && !boxes[br][bc] && boxDone(br, bc)) g++;
      }
      if (kind === "h") hEdges[idx(r, c)] = 0; else vEdges[idxV(r, c)] = 0;
      return g;
    }
    function safeEdges() {
      var all = allEdges(), out = [];
      for (var i = 0; i < all.length; i++) if (simulateGain(all[i], 1) === 0) out.push(all[i]);
      return out;
    }
    function cpuMove() {
      if (over || turn !== 2) return;
      var cfg = DP.dots[diff()].lvl;
      var twoBoxes = null, oneBox = null, safe = safeEdges(), all = allEdges();
      if (!all.length) return;   // no edges left to draw
      var giving = edgesGivingBoxes(2);
      for (var i = 0; i < giving.length; i++) {
        if (giving[i][1] >= 2) twoBoxes = giving[i][0];
        else if (!oneBox) oneBox = giving[i][0];
      }
      var pick;
      if (twoBoxes) pick = twoBoxes;
      else if (oneBox && (cfg < 2 || !safe.length)) pick = oneBox;
      else if (cfg >= 1 && safe.length) pick = safe[Math.floor(Math.random() * safe.length)];
      else if (cfg === 0 && oneBox) pick = oneBox;
      else pick = all[Math.floor(Math.random() * all.length)];
      // lvl 3: prefer safe edges, sacrifice only 2-box chains, never open big chains
      if (cfg >= 3) {
        if (twoBoxes) pick = twoBoxes;
        else if (safe.length) pick = safe[Math.floor(Math.random() * safe.length)];
        else if (oneBox) pick = oneBox;
      }
      var g = placeEdge(pick[0], pick[1], pick[2], 2);
      beep(g ? 480 : 300, 0.05);
      render();
      updateScore();
      if (checkEnd()) return;
      if (g) { $("dbStatus").textContent = "CPU took a box — it goes again"; setTimeout(cpuMove, 420); return; }
      turn = 1;
      $("dbStatus").textContent = "Your turn";
    }
    $("dbNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 23. BATTLESHIP ============ */
  (function () {
    var N = 7;
    var SHIPS = [4, 3, 3, 2];
    var mine, enemy, myShots, enemyShots, over;
    var huntQueue = [], huntTarget = null;

    function idx(r, c) { return r * N + c; }
    function inB(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
    function placeFleet() {
      var g = new Array(N * N).fill(0);
      for (var s = 0; s < SHIPS.length; s++) {
        var len = SHIPS[s], placed = false, guard = 0;
        while (!placed && guard++ < 500) {
          var horiz = Math.random() < 0.5;
          var r = Math.floor(Math.random() * (horiz ? N : N - len + 1));
          var c = Math.floor(Math.random() * (horiz ? N - len + 1 : N));
          var ok = true;
          for (var i = 0; i < len; i++) {
            var rr = r + (horiz ? 0 : i), cc = c + (horiz ? i : 0);
            if (g[idx(rr, cc)]) { ok = false; break; }
            // ships never touch: check neighbours
            for (var dr = -1; dr <= 1 && ok; dr++) for (var dc = -1; dc <= 1; dc++) {
              var nr = rr + dr, nc = cc + dc;
              if (inB(nr, nc) && g[idx(nr, nc)]) { ok = false; break; }
            }
            if (!ok) break;
          }
          if (ok) {
            for (var j = 0; j < len; j++) {
              var r2 = r + (horiz ? 0 : j), c2 = c + (horiz ? j : 0);
              g[idx(r2, c2)] = s + 1;
            }
            placed = true;
          }
        }
      }
      return g;
    }
    function reset() {
      mine = placeFleet();
      enemy = placeFleet();
      myShots = new Array(N * N).fill(0);    // 0 unknown, 1 miss, 2 hit, 3 sunk
      enemyShots = new Array(N * N).fill(0);
      over = false;
      huntQueue = []; huntTarget = null;
      $("shStatus").textContent = "Fire!";
      hideBanner($("shBanner"));
      render();
    }
    function shipAlive(g, hits, s) {
      for (var i = 0; i < g.length; i++) if (g[i] === s && hits[i] !== 2 && hits[i] !== 3) return true;
      return false;
    }
    function markSunk(g, hits) {
      var changed = false;
      for (var s = 1; s <= SHIPS.length; s++) {
        if (!shipAlive(g, hits, s)) {
          for (var i = 0; i < hits.length; i++) if (g[i] === s && hits[i] === 2) { hits[i] = 3; changed = true; }
        }
      }
      return changed;
    }
    function render() {
      markSunk(enemy, myShots);
      markSunk(mine, enemyShots);
      var e = $("shEnemy"), m = $("shMine");
      e.innerHTML = ""; m.innerHTML = "";
      e.style.gridTemplateColumns = "repeat(" + N + ", 1fr)";
      m.style.gridTemplateColumns = "repeat(" + N + ", 1fr)";
      for (var i = 0; i < N * N; i++) {
        (function (i) {
          var cell = document.createElement("button");
          var cls = "sh-cell";
          if (myShots[i] === 1) cls += " miss";
          else if (myShots[i] === 2) cls += " hit";
          else if (myShots[i] === 3) cls += " sunk";
          cell.className = cls;
          cell.addEventListener("click", function () { fire(i); });
          e.appendChild(cell);
        })(i);
      }
      for (var j = 0; j < N * N; j++) {
        var mcell = document.createElement("div");
        var mcls = "sh-cell";
        if (mine[j] && enemyShots[j] === 0) mcls += " ship";
        if (enemyShots[j] === 1) mcls += " miss";
        else if (enemyShots[j] === 2) mcls += " hit";
        else if (enemyShots[j] === 3) mcls += " sunk";
        else if (mine[j]) mcls += " ship";
        mcell.className = mcls;
        m.appendChild(mcell);
      }
    }
    function fire(i) {
      if (over || myShots[i]) return;
      myShots[i] = enemy[i] ? 2 : 1;
      beep(myShots[i] === 2 ? 520 : 200, 0.08);
      render();
      if (checkWin()) return;
      $("shStatus").textContent = myShots[i] === 2 ? "Hit!" : "Miss.";
      setTimeout(enemyTurn, 500);
    }
    function checkWin() {
      var allSunk = true;
      for (var i = 0; i < enemy.length; i++) if (enemy[i] && myShots[i] !== 2 && myShots[i] !== 3) allSunk = false;
      if (allSunk) {
        over = true;
        banner($("shBanner"), "Victory! Enemy fleet destroyed.");
        $("shStatus").textContent = "You win!";
        return true;
      }
      var allMineSunk = true;
      for (var j = 0; j < mine.length; j++) if (mine[j] && enemyShots[j] !== 2 && enemyShots[j] !== 3) allMineSunk = false;
      if (allMineSunk) {
        over = true;
        banner($("shBanner"), "Defeat. Your fleet is sunk.");
        $("shStatus").textContent = "CPU wins";
        return true;
      }
      return false;
    }
    function enemyTurn() {
      if (over) return;
      var cfg = DP.ships[diff()].ai;
      var shot = pickShot(cfg);
      if (shot === null) { checkWin(); return; }
      enemyShots[shot] = mine[shot] ? 2 : 1;
      beep(enemyShots[shot] === 2 ? 440 : 180, 0.08);
      if (enemyShots[shot] === 2) {
        if (cfg !== "random") {
          // queue neighbours for hunt
          var r = Math.floor(shot / N), c = shot % N;
          var nbrs = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
          for (var k = 0; k < nbrs.length; k++) {
            var nr = nbrs[k][0], nc = nbrs[k][1];
            if (inB(nr, nc) && !enemyShots[idx(nr, nc)]) huntQueue.push(idx(nr, nc));
          }
        }
        render();
        if (checkWin()) return;
        $("shStatus").textContent = "You're hit! CPU fires again";
        setTimeout(enemyTurn, 550);
        return;
      }
      render();
      if (checkWin()) return;
      $("shStatus").textContent = "CPU missed. Fire!";
    }
    function pickShot(cfg) {
      var open = [];
      for (var i = 0; i < N * N; i++) if (!enemyShots[i]) open.push(i);
      if (!open.length) return null;
      if (cfg === "random") return open[Math.floor(Math.random() * open.length)];
      // hunt: finish wounded ships first
      while (huntQueue.length) {
        var q = huntQueue.shift();
        if (!enemyShots[q]) return q;
      }
      var parity = cfg === "parity2" ? 2 : (cfg === "parity" ? 2 : 1);
      var cand = [];
      for (var j = 0; j < open.length; j++) {
        var r = Math.floor(open[j] / N), c = open[j] % N;
        if ((r + c) % 2 === 0) cand.push(open[j]);
      }
      if (cfg === "parity2") {
        // also weight cells adjacent to hits
        var adj = [];
        for (var k = 0; k < cand.length; k++) {
          var r2 = Math.floor(cand[k] / N), c2 = cand[k] % N;
          var nb = [[r2-1,c2],[r2+1,c2],[r2,c2-1],[r2,c2+1]];
          for (var m = 0; m < 4; m++) {
            var nr = nb[m][0], nc = nb[m][1];
            if (inB(nr, nc) && enemyShots[idx(nr, nc)] === 2) { adj.push(cand[k]); break; }
          }
        }
        if (adj.length) return adj[Math.floor(Math.random() * adj.length)];
      }
      if (cand.length) return cand[Math.floor(Math.random() * cand.length)];
      return open[Math.floor(Math.random() * open.length)];
    }
    $("shNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 24. SOKOBAN ============ */
  (function () {
    // levels: # wall, . floor, $ crate, * crate on goal, @ player, + player on goal, o goal
    var SETS = [
      [ // easy
        "#######",
        "#..o..#",
        "#.$.@.#",
        "#..o..#",
        "#######"
      ],
      [ // medium
        "########",
        "#..o...#",
        "#.$$@..#",
        "#..o...#",
        "#..o...#",
        "########"
      ],
      [ // hard
        "########",
        "#..o...#",
        "#.##$..#",
        "#..$@..#",
        "#.#$#..#",
        "#..o...#",
        "#.o....#",
        "########"
      ],
      [ // impossible (classic hard microban-style)
        "########",
        "#.o....#",
        "#.$$$..#",
        "#.o@o..#",
        "#.$....#",
        "#.o....#",
        "########"
      ]
    ];
    var canvas = $("skCanvas"), ctx = canvas.getContext("2d");
    var level, player, crates, goals, walls, moves, won;

    function loadSet() {
      var setIdx = DP.sokoban[diff()].set;
      var set = SETS[setIdx];
      level = set.map(function (row) { return row.split(""); });
      player = null; crates = []; goals = []; walls = [];
      var maxC = 0;
      for (var r = 0; r < level.length; r++) {
        maxC = Math.max(maxC, level[r].length);
        for (var c = 0; c < level[r].length; c++) {
          var ch = level[r][c];
          if (ch === "#") walls.push([r, c]);
          if (ch === "$" || ch === "*") crates.push([r, c]);
          if (ch === "o" || ch === "*" || ch === "+") goals.push([r, c]);
          if (ch === "@" || ch === "+") player = { r: r, c: c };
        }
      }
      level.rows = level.length;
      level.cols = maxC;
      moves = 0; won = false;
      $("skMoves").textContent = "0";
      $("skLevel").textContent = "1/1";
      hideBanner($("skBanner"));
      draw();
    }
    function isWall(r, c) {
      for (var i = 0; i < walls.length; i++) if (walls[i][0] === r && walls[i][1] === c) return true;
      return false;
    }
    function crateAt(r, c) {
      for (var i = 0; i < crates.length; i++) if (crates[i][0] === r && crates[i][1] === c) return i;
      return -1;
    }
    function isGoal(r, c) {
      for (var i = 0; i < goals.length; i++) if (goals[i][0] === r && goals[i][1] === c) return true;
      return false;
    }
    function draw() {
      var W = canvas.width, H = canvas.height;
      var cs = Math.floor(Math.min(W / level.cols, H / level.rows));
      var ox = (W - cs * level.cols) / 2, oy = (H - cs * level.rows) / 2;
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      for (var r = 0; r < level.rows; r++) for (var c = 0; c < level.cols; c++) {
        if (isWall(r, c)) {
          ctx.fillStyle = "#2c3743";
          ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs);
        } else {
          ctx.fillStyle = "#141a21";
          ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs);
        }
      }
      for (var g = 0; g < goals.length; g++) {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(ox + goals[g][1] * cs + cs * 0.35, oy + goals[g][0] * cs + cs * 0.35, cs * 0.3, cs * 0.3);
      }
      for (var k = 0; k < crates.length; k++) {
        var onGoal = isGoal(crates[k][0], crates[k][1]);
        ctx.fillStyle = onGoal ? "#4ade80" : "#b08050";
        ctx.fillRect(ox + crates[k][1] * cs + 2, oy + crates[k][0] * cs + 2, cs - 4, cs - 4);
      }
      if (player) {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(ox + player.c * cs + 3, oy + player.r * cs + 3, cs - 6, cs - 6);
      }
    }
    function tryMove(dr, dc) {
      if (won) return;
      var nr = player.r + dr, nc = player.c + dc;
      if (isWall(nr, nc)) return;
      var ci = crateAt(nr, nc);
      if (ci >= 0) {
        var cr = nr + dr, cc = nc + dc;
        if (isWall(cr, cc) || crateAt(cr, cc) >= 0) return;
        crates[ci] = [cr, cc];
        beep(240, 0.05);
      } else {
        beep(180, 0.03);
      }
      player.r = nr; player.c = nc;
      moves++;
      $("skMoves").textContent = moves;
      draw();
      var allOn = true;
      for (var i = 0; i < crates.length; i++) if (!isGoal(crates[i][0], crates[i][1])) allOn = false;
      if (allOn && crates.length === goals.length) {
        won = true;
        banner($("skBanner"), "Solved in <b>" + moves + "</b> moves!");
        beep(700, 0.25);
      }
    }
    var mvBtns = document.querySelectorAll("#sokoban .dpad button");
    for (var i = 0; i < mvBtns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var mv = btn.getAttribute("data-mv");
          if (mv === "up") tryMove(-1, 0);
          else if (mv === "down") tryMove(1, 0);
          else if (mv === "left") tryMove(0, -1);
          else if (mv === "right") tryMove(0, 1);
        });
      })(mvBtns[i]);
    }
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) tryMove(0, dx > 0 ? 1 : -1);
      else tryMove(dy > 0 ? 1 : -1, 0);
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (current !== "sokoban") return;
      var map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (map[e.key]) { e.preventDefault(); tryMove(map[e.key][0], map[e.key][1]); }
    });
    $("skNew").addEventListener("click", loadSet);
    loadSet();
  })();

  /* ============ 25. MAZE ESCAPE ============ */
  (function () {
    var canvas = $("mzCanvas"), ctx = canvas.getContext("2d");
    var n, cells, px, py, moves, startT, timer = null, done;

    function reset() {
      n = DP.maze[diff()].n;
      // recursive backtracker on grid: walls stored per cell {r,c,t,b,l}
      cells = [];
      for (var r = 0; r < n; r++) { cells.push([]); for (var c = 0; c < n; c++) cells[r].push({ t: true, b: true, l: true, r: true, v: false }); }
      var stack = [[0, 0]];
      cells[0][0].v = true;
      while (stack.length) {
        var cur = stack[stack.length - 1];
        var nbrs = [];
        var r = cur[0], c = cur[1];
        if (r > 0 && !cells[r-1][c].v) nbrs.push([r-1, c, "t", "b"]);
        if (r < n-1 && !cells[r+1][c].v) nbrs.push([r+1, c, "b", "t"]);
        if (c > 0 && !cells[r][c-1].v) nbrs.push([r, c-1, "l", "r"]);
        if (c < n-1 && !cells[r][c+1].v) nbrs.push([r, c+1, "r", "l"]);
        if (!nbrs.length) { stack.pop(); continue; }
        var pick = nbrs[Math.floor(Math.random() * nbrs.length)];
        cells[r][c][pick[2]] = false;
        cells[pick[0]][pick[1]][pick[3]] = false;
        cells[pick[0]][pick[1]].v = true;
        stack.push([pick[0], pick[1]]);
      }
      px = 0; py = 0; moves = 0; done = false;
      startT = Date.now();
      $("mzMoves").textContent = "0";
      $("mzTime").textContent = "0s";
      $("mzBest").textContent = lsGet("gb_maze_best_" + n, "\u221E");
      hideBanner($("mzBanner"));
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        if (!done) $("mzTime").textContent = Math.floor((Date.now() - startT) / 1000) + "s";
      }, 500);
      draw();
    }
    function draw() {
      var W = canvas.width, H = canvas.height;
      var cs = Math.floor(Math.min(W / n, H / n));
      var ox = (W - cs * n) / 2, oy = (H - cs * n) / 2;
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#3d4a57";
      ctx.lineWidth = 2;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        var x = ox + c * cs, y = oy + r * cs;
        var cell = cells[r][c];
        ctx.beginPath();
        if (cell.t) { ctx.moveTo(x, y); ctx.lineTo(x + cs, y); }
        if (cell.b) { ctx.moveTo(x, y + cs); ctx.lineTo(x + cs, y + cs); }
        if (cell.l) { ctx.moveTo(x, y); ctx.lineTo(x, y + cs); }
        if (cell.r) { ctx.moveTo(x + cs, y); ctx.lineTo(x + cs, y + cs); }
        ctx.stroke();
      }
      // exit
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(ox + (n - 1) * cs + cs * 0.3, oy + (n - 1) * cs + cs * 0.3, cs * 0.4, cs * 0.4);
      // player
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(ox + px * cs + cs / 2, oy + py * cs + cs / 2, cs * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    function tryMove(dr, dc) {
      if (done) return;
      var cell = cells[py][px];
      if (dr === -1 && cell.t) return;
      if (dr === 1 && cell.b) return;
      if (dc === -1 && cell.l) return;
      if (dc === 1 && cell.r) return;
      py += dr; px += dc;
      moves++;
      $("mzMoves").textContent = moves;
      beep(300, 0.02);
      draw();
      if (px === n - 1 && py === n - 1) {
        done = true;
        var secs = Math.floor((Date.now() - startT) / 1000);
        if (timer) { clearInterval(timer); timer = null; }
        var best = lsGet("gb_maze_best_" + n, null);
        if (best === null || secs < best) { best = secs; lsSet("gb_maze_best_" + n, best); }
        $("mzBest").textContent = best;
        banner($("mzBanner"), "Escaped in <b>" + secs + "s</b> and " + moves + " moves!");
        beep(700, 0.25);
      }
    }
    var mvBtns = document.querySelectorAll("#maze .dpad button");
    for (var i = 0; i < mvBtns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var mv = btn.getAttribute("data-mv");
          if (mv === "up") tryMove(-1, 0);
          else if (mv === "down") tryMove(1, 0);
          else if (mv === "left") tryMove(0, -1);
          else if (mv === "right") tryMove(0, 1);
        });
      })(mvBtns[i]);
    }
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) tryMove(0, dx > 0 ? 1 : -1);
      else tryMove(dy > 0 ? 1 : -1, 0);
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (current !== "maze") return;
      var map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (map[e.key]) { e.preventDefault(); tryMove(map[e.key][0], map[e.key][1]); }
    });
    stopFns.maze = function () { if (timer) { clearInterval(timer); timer = null; } };
    $("mzNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 26. SAMEGAME ============ */
  (function () {
    var n, colors, grid, score, done;
    var PAL = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c", "#f472b6"];

    function reset() {
      var c = DP.samegame[diff()];
      n = c.n; colors = c.colors;
      grid = [];
      for (var r = 0; r < n; r++) {
        grid.push([]);
        for (var col = 0; col < n; col++) grid[r].push(Math.floor(Math.random() * colors));
      }
      score = 0; done = false;
      $("sgScore").textContent = "0";
      hideBanner($("sgBanner"));
      $("sgBest").textContent = lsGet("gb_samegame_best_" + n + "x" + colors, 0);
      render();
    }
    function render(hl) {
      var el = $("sgGrid");
      el.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
      el.innerHTML = "";
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        (function (r, c) {
          var b = document.createElement("button");
          if (grid[r][c] < 0) b.className = "sg-cell gone";
          else {
            b.className = "sg-cell";
            b.style.background = PAL[grid[r][c]];
            if (hl) for (var i = 0; i < hl.length; i++) if (hl[i][0] === r && hl[i][1] === c) b.style.filter = "brightness(1.4)";
          }
          b.addEventListener("click", function () { tap(r, c); });
          el.appendChild(b);
        })(r, c);
      }
    }
    function group(r, c) {
      var val = grid[r][c];
      if (val < 0) return [];
      var seen = {}, out = [], stack = [[r, c]];
      seen[r + "," + c] = true;
      while (stack.length) {
        var cur = stack.pop();
        out.push(cur);
        var nb = [[cur[0]-1,cur[1]],[cur[0]+1,cur[1]],[cur[0],cur[1]-1],[cur[0],cur[1]+1]];
        for (var i = 0; i < 4; i++) {
          var rr = nb[i][0], cc = nb[i][1];
          if (rr >= 0 && rr < n && cc >= 0 && cc < n && grid[rr][cc] === val && !seen[rr + "," + cc]) {
            seen[rr + "," + cc] = true;
            stack.push([rr, cc]);
          }
        }
      }
      return out;
    }
    function tap(r, c) {
      if (done) return;
      var g = group(r, c);
      if (g.length < 2) return;
      var val = grid[r][c];
      for (var i = 0; i < g.length; i++) grid[g[i][0]][g[i][1]] = -1;
      score += (g.length - 2) * (g.length - 2);
      $("sgScore").textContent = score;
      beep(400 + g.length * 20, 0.07);
      collapse();
      render();
      if (noMoves()) finish();
    }
    function collapse() {
      // gravity: tiles fall down
      for (var c = 0; c < n; c++) {
        var col = [];
        for (var r = n - 1; r >= 0; r--) if (grid[r][c] >= 0) col.push(grid[r][c]);
        for (var r2 = n - 1, k = 0; r2 >= 0; r2--, k++) grid[r2][c] = k < col.length ? col[k] : -1;
      }
      // shift empty columns left
      var writeC = 0;
      for (var c2 = 0; c2 < n; c2++) {
        var empty = true;
        for (var r3 = 0; r3 < n; r3++) if (grid[r3][c2] >= 0) empty = false;
        if (!empty) {
          if (writeC !== c2) {
            for (var r4 = 0; r4 < n; r4++) { grid[r4][writeC] = grid[r4][c2]; grid[r4][c2] = -1; }
          }
          writeC++;
        }
      }
    }
    function noMoves() {
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        if (grid[r][c] < 0) continue;
        if (r + 1 < n && grid[r+1][c] === grid[r][c]) return false;
        if (c + 1 < n && grid[r][c+1] === grid[r][c]) return false;
      }
      return true;
    }
    function finish() {
      done = true;
      var left = 0;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (grid[r][c] >= 0) left++;
      if (left === 0) score += 1000;
      var best = lsGet("gb_samegame_best_" + n + "x" + colors, 0);
      if (score > best) { best = score; lsSet("gb_samegame_best_" + n + "x" + colors, best); }
      $("sgBest").textContent = best;
      $("sgScore").textContent = score;
      banner($("sgBanner"), left === 0 ? "PERFECT CLEAR! +1000. Total: <b>" + score + "</b>" : "No moves left. " + left + " tiles remain. Score: <b>" + score + "</b>");
      beep(left === 0 ? 800 : 300, 0.25);
    }
    $("sgNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 27. WORD SCRAMBLE ============ */
  (function () {
    var POOLS = [
      ["CAT","DOG","SUN","MAP","CAR","BUS","CUP","HAT","BEE","FOX","PIE","JAM","KEY","OWL","ICE","BAT","PEN","TOY","EGG","ARC"],
      ["APPLE","BEACH","CHAIR","DANCE","EAGLE","FRUIT","GRAPE","HOUSE","LEMON","MANGO","NURSE","OCEAN","PIANO","QUEEN","RIVER","SMILE","TIGER","WATER","ZEBRA","PLANT"],
      ["BUTTER","GARDEN","MARKET","ORANGE","PENCIL","ROCKET","SPIDER","TURTLE","WINTER","BASKET","CANDLE","DOLPHIN","FOREST","GUITAR","ISLAND","JUNGLE","KNIGHT","PLANET","SILVER","WINDOW"],
      ["ADVENTURE","BUTTERFLY","CHOCOLATE","DINOSAUR","EARTHQUAKE","FOUNTAIN","GRAVITY","HORIZON","ILLUSION","JOURNAL","LANTERN","MAGNETISM","NIGHTFALL","OCTOPUS","PARADOX","SILHOUETTE","TELESCOPE","VOLCANO","WILDERNESS","XYLOPHONE"]
    ];
    var word, letters, slots, timeLeft, solved, running = false, timer = null;

    function reset() {
      var c = DP.scramble[diff()];
      word = POOLS[c.pool][Math.floor(Math.random() * POOLS[c.pool].length)];
      letters = word.split("");
      do {
        for (var i = letters.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = letters[i]; letters[i] = letters[j]; letters[j] = t;
        }
      } while (letters.join("") === word);
      slots = new Array(word.length).fill(null);
      timeLeft = c.time; solved = 0;
      $("wcScore").textContent = "0";
      $("wcTime").textContent = timeLeft;
      hideBanner($("wcBanner"));
      renderLetters();
      renderSlots();
      running = true;
      $("wcNew").textContent = "Restart";
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        timeLeft--;
        $("wcTime").textContent = timeLeft;
        if (timeLeft <= 0) end();
      }, 1000);
    }
    function renderLetters() {
      var el = $("wcLetters");
      el.innerHTML = "";
      letters.forEach(function (L, i) {
        var b = document.createElement("button");
        b.className = "wc-letter" + (slots.indexOf(i) >= 0 ? " used" : "");
        b.textContent = L;
        b.addEventListener("click", function () { placeLetter(i); });
        el.appendChild(b);
      });
    }
    function renderSlots() {
      var el = $("wcSlots");
      el.innerHTML = "";
      slots.forEach(function (li, si) {
        var b = document.createElement("button");
        b.className = "wc-slot" + (li !== null ? " filled" : "");
        b.textContent = li !== null ? letters[li] : "";
        b.addEventListener("click", function () { removeLetter(si); });
        el.appendChild(b);
      });
    }
    function placeLetter(i) {
      if (!running || slots.indexOf(i) >= 0) return;
      for (var s = 0; s < slots.length; s++) {
        if (slots[s] === null) { slots[s] = i; break; }
      }
      beep(400, 0.03);
      renderSlots(); renderLetters();
      if (slots.every(function (v) { return v !== null; })) check();
    }
    function removeLetter(si) {
      if (!running || slots[si] === null) return;
      slots[si] = null;
      renderSlots(); renderLetters();
    }
    function check() {
      var guess = slots.map(function (i) { return letters[i]; }).join("");
      if (guess === word) {
        solved++;
        $("wcScore").textContent = solved;
        beep(700, 0.15);
        nextWord();
      } else {
        beep(150, 0.15);
        banner($("wcBanner"), "Not quite — try again");
        setTimeout(hideBanner, 900, $("wcBanner"));
      }
    }
    function nextWord() {
      var c = DP.scramble[diff()];
      word = POOLS[c.pool][Math.floor(Math.random() * POOLS[c.pool].length)];
      letters = word.split("");
      do {
        for (var i = letters.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = letters[i]; letters[i] = letters[j]; letters[j] = t;
        }
      } while (letters.join("") === word);
      slots = new Array(word.length).fill(null);
      hideBanner($("wcBanner"));
      renderLetters();
      renderSlots();
    }
    function end() {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
      $("wcSlots").innerHTML = "";
      $("wcLetters").innerHTML = "";
      banner($("wcBanner"), "Time! You unscrambled <b>" + solved + "</b> words. The last word was " + word);
      $("wcNew").textContent = "Start";
      beep(300, 0.2);
    }
    $("wcSkip").addEventListener("click", function () {
      if (!running) return;
      timeLeft -= 3;
      $("wcTime").textContent = timeLeft;
      beep(200, 0.1);
      if (timeLeft <= 0) { end(); return; }
      nextWord();
    });
    $("wcNew").addEventListener("click", reset);
    stopFns.scramble = function () { running = false; if (timer) { clearInterval(timer); timer = null; } };
    var c = DP.scramble[diff()];
    $("wcTime").textContent = c.time;
    $("wcSlots").innerHTML = "";
    $("wcLetters").innerHTML = "";
  })();

  /* ============ 28. ROCK PAPER SCISSORS ============ */
  (function () {
    var MOVES = ["rock", "paper", "scissors"];
    var EMO = { rock: "\u270A", paper: "\u270B", scissors: "\u270C" };
    var you = 0, cpu = 0, history = [], over = false;

    function beats(a, b) { return (a === "rock" && b === "scissors") || (a === "paper" && b === "rock") || (a === "scissors" && b === "paper"); }
    function reset() {
      you = 0; cpu = 0; history = []; over = false;
      $("rpYou").textContent = "0"; $("rpCpu").textContent = "0";
      $("rpShow").textContent = "First to 3 wins. Choose:";
      hideBanner($("rpBanner"));
    }
    function predict() {
      // AI levels: 0 pure random; 1 frequency; 2 markov-1; 3 markov-2 + frequency blend
      var lvl = DP.rps[diff()].ai;
      if (lvl === 0 || history.length < 1) return MOVES[Math.floor(Math.random() * 3)];
      var myMoves = history.map(function (h) { return h[0]; });
      if (lvl === 1) {
        var counts = { rock: 0, paper: 0, scissors: 0 };
        myMoves.forEach(function (m) { counts[m]++; });
        var fav = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
        return counter(fav);
      }
      var k = lvl === 2 ? 1 : 2;
      if (myMoves.length < k) {
        // fall back to frequency
        var counts2 = { rock: 0, paper: 0, scissors: 0 };
        myMoves.forEach(function (m) { counts2[m]++; });
        return counter(Object.keys(counts2).sort(function (a, b) { return counts2[b] - counts2[a]; })[0]);
      }
      var last = myMoves.slice(-k).join(",");
      var nexts = { rock: 0, paper: 0, scissors: 0 };
      for (var i = 0; i + k < myMoves.length + 1 && i + k <= myMoves.length - 1; i++) {
        if (myMoves.slice(i, i + k).join(",") === last) nexts[myMoves[i + k]]++;
      }
      var total = nexts.rock + nexts.paper + nexts.scissors;
      if (total === 0) {
        var counts3 = { rock: 0, paper: 0, scissors: 0 };
        myMoves.forEach(function (m) { counts3[m]++; });
        return counter(Object.keys(counts3).sort(function (a, b) { return counts3[b] - counts3[a]; })[0]);
      }
      var pred = Object.keys(nexts).sort(function (a, b) { return nexts[b] - nexts[a]; })[0];
      return counter(pred);
    }
    function counter(m) {
      // play the thing that beats m
      if (m === "rock") return "paper";
      if (m === "paper") return "scissors";
      return "rock";
    }
    function play(mine) {
      if (over) return;
      var cpuMove = predict();
      history.push([mine, cpuMove]);
      var res;
      if (mine === cpuMove) res = "draw";
      else if (beats(mine, cpuMove)) { res = "you"; you++; $("rpYou").textContent = you; }
      else { res = "cpu"; cpu++; $("rpCpu").textContent = cpu; }
      $("rpShow").innerHTML = EMO[mine] + " vs " + EMO[cpuMove] + " &#8212; " +
        (res === "draw" ? "draw" : res === "you" ? "you win the round" : "CPU takes it");
      beep(res === "you" ? 600 : res === "cpu" ? 200 : 350, 0.08);
      if (you >= 3 || cpu >= 3) {
        over = true;
        banner($("rpBanner"), you >= 3 ? "You win the match <b>" + you + " - " + cpu + "</b>!" : "CPU wins the match <b>" + cpu + " - " + you + "</b>");
      }
    }
    var btns = document.querySelectorAll(".rp-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () { play(this.getAttribute("data-rp")); });
    }
    $("rpNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 29. STROOP TEST ============ */
  (function () {
    var NAMES = ["RED", "GREEN", "BLUE", "YELLOW"];
    var COLS = ["#f87171", "#4ade80", "#60a5fa", "#fbbf24"];
    var curInk = 0, curWord = 0, rule = "ink";
    var score = 0, timeLeft, running = false, timer = null;

    function reset() {
      var c = DP.stroop[diff()];
      score = 0; timeLeft = c.time; running = true; rule = "ink";
      $("stScore").textContent = "0";
      $("stTime").textContent = timeLeft;
      $("stRule").textContent = "TAP THE INK COLOUR";
      hideBanner($("stBanner"));
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        timeLeft--;
        $("stTime").textContent = timeLeft;
        if (timeLeft <= 0) end();
      }, 1000);
      next();
    }
    function next() {
      var c = DP.stroop[diff()];
      // congruent chance: word meaning = ink colour
      var congruent = Math.random() < c.cong;
      curInk = Math.floor(Math.random() * 4);
      curWord = congruent ? curInk : Math.floor(Math.random() * 4);
      if (rule === "word") $("stRule").textContent = "TAP THE WORD MEANING";
      else $("stRule").textContent = "TAP THE INK COLOUR";
      var w = $("stWord");
      w.textContent = NAMES[curWord];
      w.style.color = COLS[curInk];
      var opts = [0, 1, 2, 3];
      for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
      var el = $("stOpts");
      el.innerHTML = "";
      opts.forEach(function (o) {
        var b = document.createElement("button");
        b.className = "st-opt";
        b.style.color = COLS[o];
        b.textContent = NAMES[o];
        b.addEventListener("click", function () { pick(o); });
        el.appendChild(b);
      });
    }
    function pick(o) {
      if (!running) return;
      var correct = rule === "ink" ? curInk : curWord;
      if (o === correct) {
        score++;
        $("stScore").textContent = score;
        beep(520, 0.04);
        // rule flip chance on hard+
        var c = DP.stroop[diff()];
        if (c.wordRule > 0 && Math.random() < c.wordRule * 0.35) {
          rule = rule === "ink" ? "word" : "ink";
          beep(700, 0.08);
        }
        next();
      } else {
        timeLeft -= 2;
        $("stTime").textContent = timeLeft;
        beep(150, 0.15);
        if (timeLeft <= 0) { end(); return; }
        next();
      }
    }
    function end() {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
      var best = lsGet("gb_stroop_best_" + diff(), 0);
      if (score > best) { best = score; lsSet("gb_stroop_best_" + diff(), best); }
      banner($("stBanner"), "Time! Score: <b>" + score + "</b>");
      $("stWord").textContent = "\u2014";
      $("stOpts").innerHTML = "";
      $("stStart").textContent = "Start";
      beep(300, 0.2);
    }
    $("stStart").addEventListener("click", function () {
      $("stStart").textContent = "Restart";
      reset();
    });
    stopFns.stroop = function () { running = false; if (timer) { clearInterval(timer); timer = null; } };
    $("stTime").textContent = DP.stroop[diff()].time;
  })();

  /* ============ 30. AIM TRAINER ============ */
  (function () {
    var W = 360, H = 480;
    var canvas = $("amCanvas"), ctx = canvas.getContext("2d");
    var target = null, hits = 0, timeLeft = 30, running = false, raf = null, spawnAt = 0;
    var trails = [];

    function cfg() { return DP.aim[diff()]; }
    function reset() {
      hits = 0; timeLeft = 30; running = false;
      target = null; trails = [];
      $("amHits").textContent = "0";
      $("amBest").textContent = lsGet("gb_aim_best_" + diff(), 0);
      hideBanner($("amBanner"));
      draw();
    }
    function spawn() {
      var c = cfg();
      target = { x: 40 + Math.random() * (W - 80), y: 60 + Math.random() * (H - 140), r: c.r, r0: c.r, born: performance.now() };
    }
    function step(t) {
      if (!running) { raf = null; return; }
      var c = cfg();
      if (!target) spawn();
      // shrink
      var age = t - target.born;
      target.r = c.r * Math.max(0.25, 1 - age / c.life);
      if (age > c.life) { trails.push({ x: target.x, y: target.y, t: t, miss: true }); spawn(); }
      // drift on hard+
      if (c.spd > 0) {
        if (!target.dx) { target.dx = (Math.random() - 0.5) * c.spd; target.dy = (Math.random() - 0.5) * c.spd; }
        target.x += target.dx; target.y += target.dy;
        if (target.x < target.r + 6 || target.x > W - target.r - 6) target.dx *= -1;
        if (target.y < target.r + 6 || target.y > H - target.r - 6) target.dy *= -1;
      }
      for (var i = trails.length - 1; i >= 0; i--) if (t - trails[i].t > 400) trails.splice(i, 1);
      draw();
      raf = requestAnimationFrame(step);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < trails.length; i++) {
        ctx.fillStyle = trails[i].miss ? "rgba(248,113,113,0.5)" : "rgba(74,222,128,0.5)";
        ctx.beginPath();
        ctx.arc(trails[i].x, trails[i].y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (target) {
        ctx.fillStyle = "#60a5fa";
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e8edf2";
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f87171";
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!running) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to play", W / 2, H / 2);
      }
    }
    function tapAt(clientX, clientY) {
      if (!running || !target) return;
      var r = canvas.getBoundingClientRect();
      var x = (clientX - r.left) / r.width * W;
      var y = (clientY - r.top) / r.height * H;
      var d = Math.hypot(x - target.x, y - target.y);
      if (d <= target.r) {
        hits++;
        $("amHits").textContent = hits;
        trails.push({ x: target.x, y: target.y, t: performance.now(), miss: false });
        beep(520, 0.05);
        spawn();
      } else {
        timeLeft = Math.max(0, timeLeft - 1);
        beep(150, 0.1);
      }
    }
    function start() {
      reset();
      running = true;
      var clock = setInterval(function () {
        if (!running) { clearInterval(clock); return; }
        timeLeft--;
        if (timeLeft <= 0) {
          running = false;
          var best = lsGet("gb_aim_best_" + diff(), 0);
          if (hits > best) { best = hits; lsSet("gb_aim_best_" + diff(), best); }
          $("amBest").textContent = best;
          banner($("amBanner"), "Time! You hit <b>" + hits + "</b> targets");
          beep(300, 0.2);
          draw();
        }
      }, 1000);
      if (!raf) raf = requestAnimationFrame(step);
    }
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      if (e.touches[0]) tapAt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener("mousedown", function (e) { tapAt(e.clientX, e.clientY); });
    $("amStart").addEventListener("click", start);
    stopFns.aim = function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    $("amBest").textContent = lsGet("gb_aim_best_" + diff(), 0);
    reset();
  })();

  /* ============ 31. FLOOD-IT ============ */
  (function () {
    var n, colors, grid, movesLeft, used, done;
    var PAL = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];

    function cfg() { return DP.flood[diff()]; }
    function reset() {
      var c = cfg();
      n = c.n; colors = c.colors; movesLeft = c.moves; used = 0; done = false;
      grid = [];
      for (var r = 0; r < n; r++) {
        grid.push([]);
        for (var k = 0; k < n; k++) grid[r].push(Math.floor(Math.random() * colors));
      }
      $("flMoves").textContent = movesLeft;
      $("flBest").textContent = lsGet("gb_flood_best_" + diff(), 0) || "\u221E";
      hideBanner($("flBanner"));
      buildPal();
      render();
    }
    function buildPal() {
      var el = $("flPal");
      el.innerHTML = "";
      for (var i = 0; i < colors; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "fl-btn";
          b.style.background = PAL[i];
          b.setAttribute("aria-label", "colour " + (i + 1));
          b.addEventListener("click", function () { pick(i); });
          el.appendChild(b);
        })(i);
      }
    }
    function render() {
      var el = $("flGrid");
      el.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
      el.innerHTML = "";
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        var b = document.createElement("div");
        b.className = "fl-cell";
        b.style.background = PAL[grid[r][c]];
        el.appendChild(b);
      }
    }
    function pick(col) {
      if (done || grid[0][0] === col) return;
      var from = grid[0][0];
      var stack = [[0, 0]], seen = { "0,0": true };
      while (stack.length) {
        var cur = stack.pop();
        grid[cur[0]][cur[1]] = col;
        var nb = [[cur[0] - 1, cur[1]], [cur[0] + 1, cur[1]], [cur[0], cur[1] - 1], [cur[0], cur[1] + 1]];
        for (var i = 0; i < 4; i++) {
          var rr = nb[i][0], cc = nb[i][1];
          if (rr >= 0 && rr < n && cc >= 0 && cc < n && !seen[rr + "," + cc] && grid[rr][cc] === from) {
            seen[rr + "," + cc] = true;
            stack.push([rr, cc]);
          }
        }
      }
      used++; movesLeft--;
      $("flMoves").textContent = movesLeft;
      beep(420, 0.05);
      render();
      if (filled()) finish(true);
      else if (movesLeft <= 0) finish(false);
    }
    function filled() {
      var v = grid[0][0];
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (grid[r][c] !== v) return false;
      return true;
    }
    function finish(won) {
      done = true;
      if (won) {
        var best = lsGet("gb_flood_best_" + diff(), 0);
        if (!best || used < best) { best = used; lsSet("gb_flood_best_" + diff(), best); }
        $("flBest").textContent = best;
        banner($("flBanner"), "Flooded in <b>" + used + "</b> moves!");
        beep(700, 0.25);
      } else {
        var left = 0, v = grid[0][0];
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (grid[r][c] !== v) left++;
        banner($("flBanner"), "Out of moves &#8212; " + left + " tiles left. Try again!");
        beep(200, 0.25);
      }
    }
    $("flNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 32. SUDOKU ============ */
  (function () {
    var sol, cells, given, sel, done, t0, timer = null;

    function cfg() { return DP.sudoku[diff()]; }
    function rowOf(i) { return Math.floor(i / 9); }
    function colOf(i) { return i % 9; }
    function boxOf(i) { return Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3); }
    function valid(g, i, v) {
      var r = rowOf(i), c = colOf(i), b = boxOf(i);
      for (var k = 0; k < 81; k++) {
        if (k === i || g[k] !== v) continue;
        if (rowOf(k) === r || colOf(k) === c || boxOf(k) === b) return false;
      }
      return true;
    }
    function fill(g) {
      var i = -1;
      for (var k = 0; k < 81; k++) if (g[k] === 0) { i = k; break; }
      if (i < 0) return true;
      var order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (var s = 8; s > 0; s--) { var j = Math.floor(Math.random() * (s + 1)); var t = order[s]; order[s] = order[j]; order[j] = t; }
      for (var d = 0; d < 9; d++) {
        if (!valid(g, i, order[d])) continue;
        g[i] = order[d];
        if (fill(g)) return true;
        g[i] = 0;
      }
      return false;
    }
    function count2(g) {
      var i = -1;
      for (var k = 0; k < 81; k++) if (g[k] === 0) { i = k; break; }
      if (i < 0) return 1;
      var total = 0;
      for (var v = 1; v <= 9; v++) {
        if (!valid(g, i, v)) continue;
        g[i] = v;
        total += count2(g);
        g[i] = 0;
        if (total >= 2) return total;
      }
      return total;
    }
    function fmt(s) {
      var m = Math.floor(s / 60), r = s % 60;
      return m + ":" + (r < 10 ? "0" : "") + r;
    }
    function reset() {
      var g = [], k;
      for (k = 0; k < 81; k++) g.push(0);
      fill(g);
      sol = g.slice();
      var order = [], work = g.slice();
      for (k = 0; k < 81; k++) order.push(k);
      for (var s = order.length - 1; s > 0; s--) { var j = Math.floor(Math.random() * (s + 1)); var t = order[s]; order[s] = order[j]; order[j] = t; }
      var target = 81 - cfg().given, removed = 0;
      for (var o = 0; o < order.length && removed < target; o++) {
        var i = order[o], v = work[i];
        work[i] = 0;
        if (count2(work) === 1) removed++;
        else work[i] = v;
      }
      cells = work; given = []; sel = -1; done = false;
      for (k = 0; k < 81; k++) given.push(work[k] !== 0);
      var best = lsGet("gb_sudoku_best_" + diff(), 0);
      $("sdBest").textContent = best ? fmt(best) : "\u2014";
      $("sdTime").textContent = "0:00";
      hideBanner($("sdBanner"));
      if (timer) { clearInterval(timer); timer = null; }
      t0 = Date.now();
      timer = setInterval(function () {
        if (!done) $("sdTime").textContent = fmt(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
      render();
    }
    function conflicts() {
      var bad = [];
      for (var i = 0; i < 81; i++) bad.push(false);
      for (var a = 0; a < 81; a++) {
        if (!cells[a]) continue;
        for (var k = 0; k < 81; k++) {
          if (k === a || cells[k] !== cells[a]) continue;
          if (rowOf(k) === rowOf(a) || colOf(k) === colOf(a) || boxOf(k) === boxOf(a)) { bad[a] = true; bad[k] = true; }
        }
      }
      return bad;
    }
    function render() {
      var el = $("sdGrid"), bad = conflicts();
      el.style.gridTemplateColumns = "repeat(9, 1fr)";
      el.innerHTML = "";
      for (var i = 0; i < 81; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "sd-cell";
          if (given[i]) b.className += " given";
          if (i === sel) b.className += " sel";
          if (bad[i]) b.className += " bad";
          if (colOf(i) === 2 || colOf(i) === 5) b.className += " bedge-r";
          if (rowOf(i) === 2 || rowOf(i) === 5) b.className += " bedge-b";
          b.textContent = cells[i] ? cells[i] : "";
          b.addEventListener("click", function () { select(i); });
          el.appendChild(b);
        })(i);
      }
    }
    function select(i) { if (done) return; sel = i; render(); }
    function place(v) {
      if (done || sel < 0 || given[sel]) return;
      cells[sel] = v;
      render();
      beep(v ? 500 : 280, 0.04);
      checkWin();
    }
    function checkWin() {
      for (var i = 0; i < 81; i++) if (cells[i] !== sol[i]) return;
      done = true;
      if (timer) { clearInterval(timer); timer = null; }
      var secs = Math.floor((Date.now() - t0) / 1000);
      var best = lsGet("gb_sudoku_best_" + diff(), 0);
      if (!best || secs < best) { best = secs; lsSet("gb_sudoku_best_" + diff(), best); }
      $("sdBest").textContent = fmt(best);
      $("sdTime").textContent = fmt(secs);
      banner($("sdBanner"), "Solved in <b>" + fmt(secs) + "</b>!");
      beep(750, 0.3);
    }
    (function () {
      var pad = $("sdPad");
      for (var v = 1; v <= 9; v++) {
        (function (v) {
          var b = document.createElement("button");
          b.className = "sd-num";
          b.textContent = v;
          b.addEventListener("click", function () { place(v); });
          pad.appendChild(b);
        })(v);
      }
      var er = document.createElement("button");
      er.className = "sd-num";
      er.textContent = "\u232B";
      er.addEventListener("click", function () { place(0); });
      pad.appendChild(er);
    })();
    stopFns.sudoku = function () { if (timer) { clearInterval(timer); timer = null; } };
    $("sdNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 33. HANOI TOWERS ============ */
  (function () {
    var pegs, sel, moves, disks, done;
    var PAL = ["#38bdf8", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#fb923c"];

    function cfg() { return DP.hanoi[diff()]; }
    function reset() {
      disks = cfg().disks;
      pegs = [[], [], []];
      for (var d = disks; d >= 1; d--) pegs[0].push(d);
      sel = -1; moves = 0; done = false;
      $("hnMoves").textContent = "0";
      $("hnBest").textContent = lsGet("gb_hanoi_best_" + disks, 0) || "\u221E";
      hideBanner($("hnBanner"));
      render();
    }
    function render() {
      var el = $("hnPegs");
      el.innerHTML = "";
      for (var p = 0; p < 3; p++) {
        (function (p) {
          var peg = document.createElement("div");
          peg.className = "hn-peg" + (p === sel ? " sel" : "");
          for (var k = 0; k < pegs[p].length; k++) {
            var size = pegs[p][k];
            var d = document.createElement("div");
            d.className = "hn-disk";
            d.style.width = (36 + size * 10) + "%";
            d.style.background = PAL[size - 1];
            if (p === sel && k === pegs[p].length - 1) d.style.opacity = "0.6";
            peg.appendChild(d);
          }
          peg.addEventListener("click", function () { tap(p); });
          el.appendChild(peg);
        })(p);
      }
    }
    function tap(p) {
      if (done) return;
      if (sel === -1) {
        if (!pegs[p].length) return;
        sel = p;
        render();
        beep(360, 0.04);
        return;
      }
      if (sel === p) { sel = -1; render(); return; }
      var moving = pegs[sel][pegs[sel].length - 1];
      var target = pegs[p].length ? pegs[p][pegs[p].length - 1] : 999;
      if (moving > target) { beep(150, 0.12); return; }
      pegs[sel].pop();
      pegs[p].push(moving);
      sel = -1;
      moves++;
      $("hnMoves").textContent = moves;
      beep(440, 0.05);
      render();
      if (pegs[2].length === disks) {
        done = true;
        var best = lsGet("gb_hanoi_best_" + disks, 0);
        if (!best || moves < best) { best = moves; lsSet("gb_hanoi_best_" + disks, best); }
        $("hnBest").textContent = best;
        var opt = Math.pow(2, disks) - 1;
        banner($("hnBanner"), "Solved in <b>" + moves + "</b> moves" + (moves === opt ? " &#8212; PERFECT!" : " (optimal: " + opt + ")"));
        beep(720, 0.3);
      }
    }
    $("hnNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 34. PIPE FLOW ============ */
  (function () {
    var canvas = $("ppCanvas"), ctx = canvas.getContext("2d");
    var n, base, rot, moves, done;
    var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];

    function cfg() { return DP.pipes[diff()]; }
    function reset() {
      n = cfg().n;
      base = []; rot = []; moves = 0; done = false;
      for (var r = 0; r < n; r++) { base.push([]); rot.push([]); for (var c = 0; c < n; c++) { base[r].push(0); rot[r].push(0); } }
      var v = { "0,0": true }, stack = [[0, 0]];
      while (stack.length) {
        var cur = stack[stack.length - 1], nb = [];
        for (var d = 0; d < 4; d++) {
          var rr = cur[0] + DR[d], cc = cur[1] + DC[d];
          if (rr >= 0 && rr < n && cc >= 0 && cc < n && !v[rr + "," + cc]) nb.push([rr, cc, d]);
        }
        if (!nb.length) { stack.pop(); continue; }
        var p = nb[Math.floor(Math.random() * nb.length)];
        base[cur[0]][cur[1]] |= 1 << p[2];
        base[p[0]][p[1]] |= 1 << ((p[2] + 2) % 4);
        v[p[0] + "," + p[1]] = true;
        stack.push([p[0], p[1]]);
      }
      var tries = 0;
      do {
        for (r = 0; r < n; r++) for (var c2 = 0; c2 < n; c2++) rot[r][c2] = Math.floor(Math.random() * 4);
        tries++;
      } while (solved() && tries < 60);
      $("ppMoves").textContent = "0";
      $("ppBest").textContent = lsGet("gb_pipes_best_" + n, 0) || "\u221E";
      hideBanner($("ppBanner"));
      draw();
    }
    function sides(r, c) {
      var out = [], m = base[r][c], ro = rot[r][c];
      for (var dir = 0; dir < 4; dir++) if (m & (1 << ((dir - ro + 4) % 4))) out.push(dir);
      return out;
    }
    function linked(r, c, d) {
      var rr = r + DR[d], cc = c + DC[d];
      if (rr < 0 || rr >= n || cc < 0 || cc >= n) return false;
      var back = (d + 2) % 4, s = sides(rr, cc);
      for (var i = 0; i < s.length; i++) if (s[i] === back) return true;
      return false;
    }
    function powered() {
      var seen = { "0,0": true }, stack = [[0, 0]];
      while (stack.length) {
        var cur = stack.pop(), s = sides(cur[0], cur[1]);
        for (var i = 0; i < s.length; i++) {
          var d = s[i], rr = cur[0] + DR[d], cc = cur[1] + DC[d];
          if (rr < 0 || rr >= n || cc < 0 || cc >= n || seen[rr + "," + cc]) continue;
          if (linked(cur[0], cur[1], d)) { seen[rr + "," + cc] = true; stack.push([rr, cc]); }
        }
      }
      return seen;
    }
    function solved() { return !!powered()[(n - 1) + "," + (n - 1)]; }
    function geom() {
      var W = canvas.width, H = canvas.height;
      var cs = Math.floor(Math.min(W / n, H / n));
      return { cs: cs, ox: (W - cs * n) / 2, oy: (H - cs * n) / 2 };
    }
    function draw() {
      var g = geom(), cs = g.cs, ox = g.ox, oy = g.oy;
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var pw = powered();
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        var x = ox + c * cs, y = oy + r * cs;
        var on = r === 0 && c === 0 ? true : !!pw[r + "," + c];
        var cx = x + cs / 2, cy = y + cs / 2;
        var s = sides(r, c);
        ctx.strokeStyle = on ? "#4ade80" : "#3d4a57";
        ctx.lineWidth = Math.max(3, cs * 0.14);
        ctx.beginPath();
        for (var i = 0; i < s.length; i++) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + DC[s[i]] * cs / 2, cy + DR[s[i]] * cs / 2);
        }
        ctx.stroke();
        ctx.fillStyle = on ? "#4ade80" : "#3d4a57";
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(2, cs * 0.12), 0, Math.PI * 2);
        ctx.fill();
        if ((r === 0 && c === 0) || (r === n - 1 && c === n - 1)) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 3;
          ctx.strokeRect(x + 3, y + 3, cs - 6, cs - 6);
        }
      }
    }
    function tapAt(clientX, clientY) {
      if (done) return;
      var g = geom(), rv = canvas.getBoundingClientRect();
      var x = (clientX - rv.left) / rv.width * canvas.width;
      var y = (clientY - rv.top) / rv.height * canvas.height;
      var c = Math.floor((x - g.ox) / g.cs), r = Math.floor((y - g.oy) / g.cs);
      if (r < 0 || r >= n || c < 0 || c >= n) return;
      rot[r][c] = (rot[r][c] + 1) % 4;
      moves++;
      $("ppMoves").textContent = moves;
      beep(320, 0.03);
      draw();
      if (solved()) {
        done = true;
        var best = lsGet("gb_pipes_best_" + n, 0);
        if (!best || moves < best) { best = moves; lsSet("gb_pipes_best_" + n, best); }
        $("ppBest").textContent = best;
        banner($("ppBanner"), "Flow complete in <b>" + moves + "</b> turns!");
        beep(720, 0.3);
      }
    }
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      if (e.touches[0]) tapAt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener("mousedown", function (e) { tapAt(e.clientX, e.clientY); });
    $("ppNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 35. GOMOKU ============ */
  (function () {
    var n, board, over, you = 0, cpu = 0, draws = 0, winCells = null;
    var DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];

    function cfg() { return DP.gomoku[diff()]; }
    function reset() {
      n = cfg().n;
      board = [];
      for (var i = 0; i < n * n; i++) board.push(0);
      over = false; winCells = null;
      $("gkStatus").textContent = "Your turn";
      hideBanner($("gkBanner"));
      render();
    }
    function show() {
      $("gkYou").textContent = you;
      $("gkCpu").textContent = cpu;
      $("gkDraw").textContent = draws;
    }
    function render() {
      var el = $("gkBoard");
      el.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
      el.innerHTML = "";
      for (var i = 0; i < n * n; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "gk-cell";
          if (board[i] === 1) b.className += " p";
          if (board[i] === 2) b.className += " c";
          if (winCells && winCells.indexOf(i) >= 0) b.className += " win";
          b.addEventListener("click", function () { play(i); });
          el.appendChild(b);
        })(i);
      }
    }
    function lineInfo(i, who) {
      var r = Math.floor(i / n), c = i % n, total = 0;
      for (var d = 0; d < 4; d++) {
        var dr = DIRS[d][0], dc = DIRS[d][1];
        var cnt = 1, openA = false, openB = false;
        var rr = r + dr, cc = c + dc;
        while (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === who) { cnt++; rr += dr; cc += dc; }
        if (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === 0) openA = true;
        rr = r - dr; cc = c - dc;
        while (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === who) { cnt++; rr -= dr; cc -= dc; }
        if (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === 0) openB = true;
        var opens = (openA ? 1 : 0) + (openB ? 1 : 0);
        if (cnt >= 5) total += 1000000;
        else if (cnt === 4) total += opens === 2 ? 50000 : (opens === 1 ? 12000 : 0);
        else if (cnt === 3) total += opens === 2 ? 4000 : (opens === 1 ? 400 : 0);
        else if (cnt === 2) total += opens === 2 ? 200 : (opens === 1 ? 30 : 0);
        else total += opens === 2 ? 8 : 2;
      }
      return total;
    }
    function nearby(i) {
      var r = Math.floor(i / n), c = i % n;
      for (var rr = Math.max(0, r - 2); rr <= Math.min(n - 1, r + 2); rr++)
        for (var cc = Math.max(0, c - 2); cc <= Math.min(n - 1, c + 2); cc++)
          if (board[rr * n + cc] !== 0) return true;
      return false;
    }
    function aiMove() {
      var lvl = cfg().lvl, i;
      var cand = [];
      for (i = 0; i < n * n; i++) if (board[i] === 0 && nearby(i)) cand.push(i);
      if (!cand.length) return -1;
      var pick = -1, top = 0;
      for (i = 0; i < cand.length; i++) {
        var a = lineInfo(cand[i], 2);
        if (a > top) { top = a; pick = cand[i]; }
      }
      if (top >= 1000000) return pick;
      pick = -1; top = 0;
      for (i = 0; i < cand.length; i++) {
        var d = lineInfo(cand[i], 1);
        if (d > top) { top = d; pick = cand[i]; }
      }
      if (top >= 1000000) return pick;
      var def = [0.55, 0.85, 1, 1][lvl], noise = [0.4, 0.2, 0.07, 0][lvl];
      var best = -1, bestScore = -Infinity;
      for (i = 0; i < cand.length; i++) {
        var idx = cand[i];
        var sc = lineInfo(idx, 2) + lineInfo(idx, 1) * def + Math.random() * noise * (lineInfo(idx, 2) + lineInfo(idx, 1) + 100);
        if (sc > bestScore) { bestScore = sc; best = idx; }
      }
      return best;
    }
    function winAt(i, who) {
      var r = Math.floor(i / n), c = i % n;
      for (var d = 0; d < 4; d++) {
        var dr = DIRS[d][0], dc = DIRS[d][1];
        var line = [i];
        var rr = r + dr, cc = c + dc;
        while (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === who) { line.push(rr * n + cc); rr += dr; cc += dc; }
        rr = r - dr; cc = c - dc;
        while (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === who) { line.unshift(rr * n + cc); rr -= dr; cc -= dc; }
        if (line.length >= 5) return line;
      }
      return null;
    }
    function full() {
      for (var i = 0; i < n * n; i++) if (board[i] === 0) return false;
      return true;
    }
    function endRound(title) {
      over = true;
      $("gkStatus").textContent = title;
      highlight();
      render();
      show();
    }
    function highlight() {
      for (var i = 0; i < n * n; i++) {
        if (board[i] !== 1 && board[i] !== 2) continue;
        var line = winAt(i, board[i]);
        if (line) { winCells = line; return; }
      }
    }
    function play(i) {
      if (over || board[i] !== 0) return;
      board[i] = 1;
      render();
      beep(480, 0.05);
      if (winAt(i, 1)) { you++; render(); endRound("You win!"); banner($("gkBanner"), "You got five! Score: <b>" + you + "</b>"); beep(740, 0.3); return; }
      if (full()) { draws++; render(); endRound("Draw."); return; }
      $("gkStatus").textContent = "CPU thinking...";
      var mv = aiMove();
      if (mv < 0) { draws++; endRound("Draw."); return; }
      board[mv] = 2;
      render();
      beep(360, 0.05);
      if (winAt(mv, 2)) { cpu++; render(); endRound("CPU wins."); banner($("gkBanner"), "CPU lined up five. You " + you + " &#8212; CPU " + cpu); beep(200, 0.3); return; }
      if (full()) { draws++; render(); endRound("Draw."); return; }
      $("gkStatus").textContent = "Your turn";
    }
    $("gkNew").addEventListener("click", reset);
    show();
    reset();
  })();

  /* ============ 36. BLACKJACK ============ */
  (function () {
    var SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];
    var deck, you, cpuHand, chips, phase;

    function cfg() { return DP.blackjack[diff()]; }
    function rank(v) {
      if (v === 1) return "A";
      if (v === 11) return "J";
      if (v === 12) return "Q";
      if (v === 13) return "K";
      return String(v);
    }
    function newDeck() {
      var d = [];
      for (var s = 0; s < 4; s++) for (var v = 1; v <= 13; v++) d.push({ v: v, s: s });
      for (var i = d.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = d[i]; d[i] = d[j]; d[j] = t; }
      return d;
    }
    function handVal(hand) {
      var total = 0, aces = 0;
      for (var i = 0; i < hand.length; i++) {
        var v = hand[i].v;
        if (v === 1) { aces++; total += 11; }
        else total += v > 10 ? 10 : v;
      }
      while (total > 21 && aces > 0) { total -= 10; aces--; }
      return { total: total, soft: aces > 0 };
    }
    function cardHTML(card, hidden) {
      if (hidden) return '<div class="bj-card back"></div>';
      var red = card.s === 1 || card.s === 2;
      return '<div class="bj-card' + (red ? " red" : "") + '">' + rank(card.v) + SUITS[card.s] + "</div>";
    }
    function renderHands(reveal) {
      var h = "", i;
      for (i = 0; i < cpuHand.length; i++) h += cardHTML(cpuHand[i], !reveal && i === 1);
      $("bjDealer").innerHTML = h;
      h = "";
      for (i = 0; i < you.length; i++) h += cardHTML(you[i], false);
      $("bjYou").innerHTML = h;
      $("bjDealerScore").textContent = reveal && cpuHand.length ? handVal(cpuHand).total : "?";
      $("bjYouScore").textContent = you.length ? handVal(you).total : 0;
    }
    function setButtons(dealOn, hitOn, standOn) {
      $("bjDeal").disabled = !dealOn;
      $("bjHit").disabled = !hitOn;
      $("bjStand").disabled = !standOn;
    }
    function updateBest() {
      var c = cfg(), best = lsGet("gb_blackjack_best_" + diff(), c.chips);
      if (chips > best) { best = chips; lsSet("gb_blackjack_best_" + diff(), best); }
      $("bjBest").textContent = best;
    }
    function reset() {
      var c = cfg();
      chips = c.chips; phase = "idle";
      you = []; cpuHand = []; deck = newDeck();
      $("bjChips").textContent = chips;
      $("bjBest").textContent = lsGet("gb_blackjack_best_" + diff(), c.chips);
      $("bjMsg").textContent = "Press Deal. Bet: 10 per round.";
      hideBanner($("bjBanner"));
      renderHands(false);
      setButtons(true, false, false);
    }
    function deal() {
      if (phase === "play") return;
      if (chips < 10) { $("bjMsg").textContent = "Out of chips \u2014 press New to rebuy."; return; }
      if (deck.length < 20) deck = newDeck();
      you = [deck.pop(), deck.pop()];
      cpuHand = [deck.pop(), deck.pop()];
      chips -= 10;
      phase = "play";
      $("bjChips").textContent = chips;
      $("bjMsg").textContent = "Hit or stand?";
      hideBanner($("bjBanner"));
      renderHands(false);
      setButtons(false, true, true);
      beep(460, 0.05);
      if (handVal(you).total === 21) stand();
    }
    function bust() {
      phase = "done";
      $("bjMsg").textContent = "Bust! You went over 21.";
      banner($("bjBanner"), "Bust with " + handVal(you).total + ". Dealer takes the 10.");
      beep(180, 0.25);
      updateBest();
      setButtons(chips >= 10, false, false);
      if (chips < 10) $("bjMsg").textContent = "Bust! Out of chips \u2014 press New to rebuy.";
    }
    function hit() {
      if (phase !== "play") return;
      you.push(deck.pop());
      renderHands(false);
      beep(520, 0.05);
      if (handVal(you).total > 21) { bust(); return; }
      if (handVal(you).total === 21) stand();
    }
    function stand() {
      if (phase !== "play") return;
      phase = "done";
      var rule = cfg().soft17, guard = 0, dv;
      while (guard < 20) {
        guard++;
        dv = handVal(cpuHand);
        if (dv.total < 17 || (dv.total === 17 && dv.soft && rule)) { cpuHand.push(deck.pop()); continue; }
        break;
      }
      dv = handVal(cpuHand);
      renderHands(true);
      var pv = handVal(you);
      var pBJ = you.length === 2 && pv.total === 21;
      var dBJ = cpuHand.length === 2 && dv.total === 21;
      var payout = 0, msg;
      if (pBJ && !dBJ) { payout = 25; msg = "BLACKJACK! Dealer pays 15."; }
      else if (dBJ && !pBJ) { msg = "Dealer blackjack. You lose the 10."; }
      else if (pv.total > dv.total) { payout = 20; msg = "You win! Dealer pays 10."; }
      else if (pv.total < dv.total) { msg = "Dealer wins " + dv.total + " to " + pv.total + "."; }
      else { payout = 10; msg = "Push at " + pv.total + " \u2014 bet returned."; }
      chips += payout;
      $("bjChips").textContent = chips;
      updateBest();
      banner($("bjBanner"), msg + " Chips: <b>" + chips + "</b>");
      beep(payout >= 20 ? 740 : payout === 10 ? 520 : 220, 0.2);
      setButtons(chips >= 10, false, false);
      $("bjMsg").textContent = chips >= 10 ? "Round over. Deal again?" : "Out of chips \u2014 press New to rebuy.";
    }
    $("bjDeal").addEventListener("click", deal);
    $("bjHit").addEventListener("click", hit);
    $("bjStand").addEventListener("click", stand);
    $("bjNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 37. DASH RUNNER ============ */
  (function () {
    var W = 360, H = 480, GROUND = H - 70, PX = 46, PW = 26, PH = 34;
    var canvas = $("rnCanvas"), ctx = canvas.getContext("2d");
    var py, vy, obstacles, dist, score, running, raf = null, nextSpawn, best;

    function cfg() { return DP.runner[diff()]; }
    function speed() { return cfg().spd + Math.min(4, score / 15); }
    function reset() {
      py = GROUND; vy = 0; obstacles = []; dist = 0; score = 0; running = false; nextSpawn = 40;
      best = lsGet("gb_runner_best_" + diff(), 0);
      $("rnScore").textContent = "0";
      $("rnBest").textContent = best;
      hideBanner($("rnBanner"));
      draw();
    }
    function jump() {
      if (!running || py < GROUND - 0.5) return;
      vy = -13;
      beep(520, 0.05);
    }
    function spawn() {
      obstacles.push({ x: W + 10, w: 18 + Math.random() * 16, h: 20 + Math.random() * 24 });
    }
    function die() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (score > best) { best = score; lsSet("gb_runner_best_" + diff(), best); }
      $("rnBest").textContent = best;
      banner($("rnBanner"), "Crashed at <b>" + score + "</b> m. Best: " + best);
      beep(180, 0.3);
      draw();
    }
    function step() {
      if (!running) { raf = null; return; }
      var spd = speed();
      vy += 0.75;
      py += vy;
      if (py > GROUND) { py = GROUND; vy = 0; }
      dist += spd;
      score = Math.floor(dist / 12);
      $("rnScore").textContent = score;
      nextSpawn--;
      if (nextSpawn <= 0) { spawn(); nextSpawn = 42 + Math.floor(Math.random() * 26); }
      for (var i = obstacles.length - 1; i >= 0; i--) {
        var o = obstacles[i];
        o.x -= spd;
        if (o.x + o.w < -10) { obstacles.splice(i, 1); continue; }
        if (o.x < PX + PW - 4 && o.x + o.w > PX + 4 && py > GROUND - o.h + 4) { die(); return; }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#2c3743";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 1);
      ctx.lineTo(W, GROUND + 1);
      ctx.stroke();
      for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        ctx.fillStyle = "#f87171";
        ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
      }
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(PX, py - PH, PW, PH);
      if (!running) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to run", W / 2, H / 2);
      }
    }
    function start() {
      reset();
      running = true;
      if (!raf) raf = requestAnimationFrame(step);
    }
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      jump();
    }, { passive: false });
    canvas.addEventListener("mousedown", function () { jump(); });
    document.addEventListener("keydown", function (e) {
      if (current !== "runner") return;
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); }
    });
    $("rnStart").addEventListener("click", start);
    stopFns.runner = function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    reset();
  })();

  /* ============ 38. HOPPER ============ */
  (function () {
    var W = 360, CELL = 40, ROWS = 9, LANES = [1, 3, 5, 7];
    var canvas = $("hpCanvas"), ctx = canvas.getContext("2d");
    var px, prow, lives, crossings, cars, level, running, raf = null, best;

    function cfg() { return DP.hopper[diff()]; }
    function laneSpeed() {
      var s = cfg().spd * (1 + (level - 1) * 0.15);
      return Math.min(s, cfg().spd * 2.5);
    }
    function reset() {
      px = 4; prow = 8; lives = cfg().lives; crossings = 0; level = 1;
      running = false; best = lsGet("gb_hopper_best_" + diff(), 0);
      $("hpScore").textContent = "0";
      $("hpLives").textContent = lives;
      $("hpBest").textContent = best;
      hideBanner($("hpBanner"));
      makeCars();
      draw();
    }
    function makeCars() {
      cars = [];
      var spd = laneSpeed(), per = Math.min(3, cfg().perLane + Math.floor((level - 1) / 2));
      for (var i = 0; i < LANES.length; i++) {
        for (var k = 0; k < per; k++) {
          var dir = i % 2 === 0 ? 1 : -1;
          cars.push({
            row: LANES[i],
            x: Math.random() * W,
            w: 46 + Math.random() * 34,
            spd: dir * spd * (0.8 + Math.random() * 0.4)
          });
        }
      }
    }
    function gameOver() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (crossings > best) { best = crossings; lsSet("gb_hopper_best_" + diff(), best); }
      $("hpBest").textContent = best;
      banner($("hpBanner"), "Squashed! Crossings: <b>" + crossings + "</b>. Best: " + best);
      beep(170, 0.3);
      draw();
    }
    function hit() {
      lives--;
      $("hpLives").textContent = lives;
      beep(200, 0.15);
      if (lives <= 0) { gameOver(); return; }
      prow = 8; px = 4;
    }
    function reachGoal() {
      crossings++; level++;
      $("hpScore").textContent = crossings;
      beep(720, 0.12);
      prow = 8; px = 4;
      makeCars();
    }
    function move(dr, dc) {
      if (!running) return;
      var nr = prow + dr, nc = px + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= 9) return;
      prow = nr; px = nc;
      beep(300, 0.02);
      if (prow === 0) reachGoal();
      draw();
    }
    function step() {
      if (!running) { raf = null; return; }
      for (var i = 0; i < cars.length; i++) {
        var c = cars[i];
        c.x += c.spd;
        if (c.spd > 0 && c.x > W + 30) c.x = -c.w - 30;
        if (c.spd < 0 && c.x + c.w < -30) c.x = W + 30;
      }
      for (i = 0; i < cars.length; i++) {
        if (cars[i].row !== prow) continue;
        var x0 = px * CELL + 6, x1 = (px + 1) * CELL - 6;
        if (cars[i].x < x1 && cars[i].x + cars[i].w > x0) { hit(); break; }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, W);
      var PAL = ["#f87171", "#fbbf24", "#38bdf8", "#a78bfa", "#fb923c", "#4ade80"];
      for (var r = 0; r < ROWS; r++) {
        var road = false;
        for (var i = 0; i < LANES.length; i++) if (LANES[i] === r) road = true;
        ctx.fillStyle = r === 0 ? "#2a2313" : r === 8 ? "#12351f" : road ? "#1c232b" : "#16202a";
        ctx.fillRect(0, r * CELL, W, CELL);
      }
      for (i = 0; i < cars.length; i++) {
        ctx.fillStyle = PAL[i % PAL.length];
        ctx.fillRect(cars[i].x, cars[i].row * CELL + 9, cars[i].w, CELL - 18);
      }
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(px * CELL + 7, prow * CELL + 7, CELL - 14, CELL - 14);
      if (!running) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to cross", W / 2, W / 2);
      }
    }
    function start() {
      reset();
      running = true;
      if (!raf) raf = requestAnimationFrame(step);
    }
    var mvBtns = document.querySelectorAll("#hopper .dpad button");
    for (var i = 0; i < mvBtns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var mv = btn.getAttribute("data-mv");
          if (mv === "up") move(-1, 0);
          else if (mv === "down") move(1, 0);
          else if (mv === "left") move(0, -1);
          else if (mv === "right") move(0, 1);
        });
      })(mvBtns[i]);
    }
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) move(0, dx > 0 ? 1 : -1);
      else move(dy > 0 ? 1 : -1, 0);
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (current !== "hopper") return;
      var map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (map[e.key]) { e.preventDefault(); move(map[e.key][0], map[e.key][1]); }
    });
    $("hpStart").addEventListener("click", start);
    stopFns.hopper = function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    reset();
  })();

  /* ============ 39. BLOCK STACKER ============ */
  (function () {
    var W = 360, H = 480, BLOCK_H = 26;
    var canvas = $("tkCanvas"), ctx = canvas.getContext("2d");
    var stack, cur, vx, running, raf = null, score, best;

    function cfg() { return DP.stacker[diff()]; }
    function reset() {
      stack = [{ x: W / 2 - 55, w: 110 }];
      score = 0; running = false;
      best = lsGet("gb_stacker_best_" + diff(), 0);
      $("tkScore").textContent = "0";
      $("tkBest").textContent = best;
      hideBanner($("tkBanner"));
      newCur();
      draw();
    }
    function newCur() {
      var top = stack[stack.length - 1];
      var fromLeft = stack.length % 2 === 1;
      var mag = Math.abs(cfg().spd) + stack.length * 0.08;
      cur = { x: fromLeft ? 0 : W - top.w, w: top.w };
      vx = fromLeft ? mag : -mag;
    }
    function drop() {
      if (!running || !cur) return;
      var top = stack[stack.length - 1];
      var l = Math.max(top.x, cur.x), r = Math.min(top.x + top.w, cur.x + cur.w);
      var w = r - l;
      if (w <= 0) { die(); return; }
      var perfect = Math.abs(cur.x - top.x) <= 2.5;
      if (perfect) { l = top.x; w = top.w; }
      stack.push({ x: l, w: w });
      score++;
      $("tkScore").textContent = score;
      beep(perfect ? 660 : 420, 0.05);
      newCur();
      draw();
    }
    function die() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (score > best) { best = score; lsSet("gb_stacker_best_" + diff(), best); }
      $("tkBest").textContent = best;
      banner($("tkBanner"), "Tower <b>" + score + "</b> high. Best: " + best);
      beep(180, 0.3);
    }
    function step() {
      if (!running) { raf = null; return; }
      if (cur) {
        cur.x += vx;
        if (cur.x <= 0) { cur.x = 0; vx = Math.abs(vx); }
        if (cur.x + cur.w >= W) { cur.x = W - cur.w; vx = -Math.abs(vx); }
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      var start = Math.max(0, stack.length - 13);
      var baseY = H - 60;
      for (var i = start; i < stack.length; i++) {
        var y = baseY - (i - start) * BLOCK_H;
        ctx.fillStyle = i % 2 === 0 ? "#33414f" : "#3d4a57";
        ctx.fillRect(stack[i].x, y - BLOCK_H, stack[i].w, BLOCK_H - 2);
      }
      if (cur) {
        var topY = baseY - (stack.length - start) * BLOCK_H;
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(cur.x, topY - BLOCK_H, cur.w, BLOCK_H - 2);
      }
      if (!running) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Start to stack", W / 2, 80);
      }
    }
    function start() {
      reset();
      running = true;
      if (!raf) raf = requestAnimationFrame(step);
    }
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      drop();
    }, { passive: false });
    canvas.addEventListener("mousedown", function () { drop(); });
    document.addEventListener("keydown", function (e) {
      if (current !== "stacker") return;
      if (e.key === " ") { e.preventDefault(); drop(); }
    });
    $("tkStart").addEventListener("click", start);
    stopFns.stacker = function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } };
    reset();
  })();

  /* ============ 40. MATCH THREE ============ */
  (function () {
    var n, colors, board, sel, moves, score, done;
    var PAL = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];

    function cfg() { return DP.match3[diff()]; }
    function idx(r, c) { return r * n + c; }
    function reset() {
      var c = cfg();
      n = c.n; colors = c.colors; moves = c.moves; score = 0; sel = -1; done = false;
      var guard = 0;
      do { genBoard(); guard++; } while (guard < 60 && (findMatches().length > 0 || !hasMove()));
      $("m3Score").textContent = "0";
      $("m3Moves").textContent = moves;
      $("m3Best").textContent = lsGet("gb_match3_best_" + diff(), 0) || 0;
      hideBanner($("m3Banner"));
      render();
    }
    function genBoard() {
      board = [];
      for (var i = 0; i < n * n; i++) board.push(Math.floor(Math.random() * colors));
    }
    function findMatches() {
      var hits = {}, r, c, run;
      for (r = 0; r < n; r++) {
        run = 1;
        for (c = 1; c <= n; c++) {
          if (c < n && board[idx(r, c)] === board[idx(r, c - 1)]) run++;
          else {
            if (run >= 3) for (var k = c - run; k < c; k++) hits[idx(r, k)] = true;
            run = 1;
          }
        }
      }
      for (c = 0; c < n; c++) {
        run = 1;
        for (r = 1; r <= n; r++) {
          if (r < n && board[idx(r, c)] === board[idx(r - 1, c)]) run++;
          else {
            if (run >= 3) for (var k2 = r - run; k2 < r; k2++) hits[idx(k2, c)] = true;
            run = 1;
          }
        }
      }
      var out = [];
      for (var key in hits) out.push(+key);
      return out;
    }
    function hasMove() {
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        if (c + 1 < n) {
          var a = board[idx(r, c)];
          board[idx(r, c)] = board[idx(r, c + 1)];
          board[idx(r, c + 1)] = a;
          var ok = findMatches().length > 0;
          a = board[idx(r, c)];
          board[idx(r, c)] = board[idx(r, c + 1)];
          board[idx(r, c + 1)] = a;
          if (ok) return true;
        }
        if (r + 1 < n) {
          var b = board[idx(r, c)];
          board[idx(r, c)] = board[idx(r + 1, c)];
          board[idx(r + 1, c)] = b;
          var ok2 = findMatches().length > 0;
          b = board[idx(r, c)];
          board[idx(r, c)] = board[idx(r + 1, c)];
          board[idx(r + 1, c)] = b;
          if (ok2) return true;
        }
      }
      return false;
    }
    function gravity() {
      for (var c = 0; c < n; c++) {
        var write = n - 1;
        for (var r = n - 1; r >= 0; r--) {
          if (board[idx(r, c)] >= 0) { board[idx(write, c)] = board[idx(r, c)]; write--; }
        }
        for (var r2 = write; r2 >= 0; r2--) board[idx(r2, c)] = Math.floor(Math.random() * colors);
      }
    }
    function resolve() {
      var total = 0, chain = 1, m;
      while (true) {
        m = findMatches();
        if (!m.length) break;
        for (var i = 0; i < m.length; i++) board[m[i]] = -1;
        total += 10 * m.length * chain;
        beep(380 + chain * 60, 0.06);
        gravity();
        chain++;
      }
      return total;
    }
    function render() {
      var el = $("m3Grid");
      el.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
      el.innerHTML = "";
      for (var i = 0; i < n * n; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.className = "m3-cell" + (i === sel ? " sel" : "");
          b.style.background = PAL[board[i]];
          b.addEventListener("click", function () { tap(i); });
          el.appendChild(b);
        })(i);
      }
    }
    function adjacent(a, b) {
      var r1 = Math.floor(a / n), c1 = a % n, r2 = Math.floor(b / n), c2 = b % n;
      return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    }
    function tap(i) {
      if (done) return;
      if (sel === -1 || sel === i || !adjacent(sel, i)) {
        sel = sel === i ? -1 : i;
        render();
        return;
      }
      var a = board[sel], b = board[i];
      board[sel] = b; board[i] = a;
      if (!findMatches().length) {
        board[sel] = a; board[i] = b;
        beep(160, 0.08);
        sel = -1;
        render();
        return;
      }
      sel = -1;
      moves--;
      $("m3Moves").textContent = moves;
      score += resolve();
      $("m3Score").textContent = score;
      var guard = 0;
      while (!hasMove() && guard < 60) { genBoard(); guard++; }
      render();
      if (moves <= 0) finish();
    }
    function finish() {
      done = true;
      var best = lsGet("gb_match3_best_" + diff(), 0);
      if (score > best) { best = score; lsSet("gb_match3_best_" + diff(), best); }
      $("m3Best").textContent = best;
      banner($("m3Banner"), "Out of moves! Score: <b>" + score + "</b>");
      beep(650, 0.25);
    }
    $("m3New").addEventListener("click", reset);
    reset();
  })();
  /* ============ 41. NONOGRAM ============ */
  (function () {
    var n, sol, cluesR, cluesC, grid, done, t0, timer = null;
    function cfg() { return DP.nono[diff()]; }
    function runs(line) {
      var out = [], run = 0;
      for (var i = 0; i < line.length; i++) {
        if (line[i] === 1) run++;
        else if (run > 0) { out.push(run); run = 0; }
      }
      if (run > 0) out.push(run);
      return out;
    }
    function gen() {
      n = cfg().n;
      sol = [];
      for (var r = 0; r < n; r++) {
        sol.push([]);
        for (var c = 0; c < n; c++) sol[r].push(Math.random() < 0.52 ? 1 : 0);
      }
      for (var r2 = 0; r2 < n; r2++) {
        var empty = true;
        for (var c2 = 0; c2 < n; c2++) if (sol[r2][c2]) { empty = false; break; }
        if (empty) sol[r2][Math.floor(Math.random() * n)] = 1;
      }
      for (var c3 = 0; c3 < n; c3++) {
        var empty2 = true;
        for (var r3 = 0; r3 < n; r3++) if (sol[r3][c3]) { empty2 = false; break; }
        if (empty2) sol[Math.floor(Math.random() * n)][c3] = 1;
      }
      cluesR = []; cluesC = [];
      for (var r4 = 0; r4 < n; r4++) cluesR.push(runs(sol[r4]));
      for (var c4 = 0; c4 < n; c4++) {
        var col = [];
        for (var r5 = 0; r5 < n; r5++) col.push(sol[r5][c4]);
        cluesC.push(runs(col));
      }
    }
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }
    function clueSpans(cl) {
      var s = "";
      for (var i = 0; i < cl.length; i++) s += "<span>" + cl[i] + "</span>";
      return s || "<span>0</span>";
    }
    function reset() {
      gen();
      grid = [];
      for (var r = 0; r < n; r++) { grid.push([]); for (var c = 0; c < n; c++) grid[r].push(0); }
      done = false;
      var best = lsGet("gb_nono_best_" + diff(), 0);
      $("noBest").textContent = best ? fmt(best) : "\u2014";
      $("noTime").textContent = "0:00";
      hideBanner($("noBanner"));
      if (timer) { clearInterval(timer); timer = null; }
      t0 = Date.now();
      timer = setInterval(function () {
        if (!done) $("noTime").textContent = fmt(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
      render();
    }
    function render() {
      var el = $("noWrap");
      el.style.gridTemplateColumns = "auto repeat(" + n + ", 1fr)";
      el.innerHTML = "";
      var corner = document.createElement("div");
      corner.className = "no-clue";
      el.appendChild(corner);
      for (var c = 0; c < n; c++) {
        (function (c) {
          var d = document.createElement("div");
          d.className = "no-clue col";
          d.innerHTML = clueSpans(cluesC[c]);
          el.appendChild(d);
        })(c);
      }
      for (var r = 0; r < n; r++) {
        (function (r) {
          var rc = document.createElement("div");
          rc.className = "no-clue row";
          rc.innerHTML = clueSpans(cluesR[r]);
          el.appendChild(rc);
          for (var c = 0; c < n; c++) {
            (function (r, c) {
              var b = document.createElement("button");
              b.className = "no-cell";
              if (grid[r][c] === 1) b.className += " fill";
              else if (grid[r][c] === 2) { b.className += " cross"; b.textContent = "\u00D7"; }
              b.addEventListener("click", function () { tap(r, c); });
              el.appendChild(b);
            })(r, c);
          }
        })(r);
      }
    }
    function tap(r, c) {
      if (done) return;
      grid[r][c] = (grid[r][c] + 1) % 3;
      beep(grid[r][c] === 1 ? 500 : 300, 0.04);
      render();
      checkWin();
    }
    function lineMatches(line, clue) {
      var rr = runs(line);
      if (rr.length !== clue.length) return false;
      for (var k = 0; k < rr.length; k++) if (rr[k] !== clue[k]) return false;
      return true;
    }
    function checkWin() {
      for (var r = 0; r < n; r++) {
        var line = [];
        for (var c = 0; c < n; c++) line.push(grid[r][c] === 1 ? 1 : 0);
        if (!lineMatches(line, cluesR[r])) return;
      }
      for (var c2 = 0; c2 < n; c2++) {
        var col = [];
        for (var r2 = 0; r2 < n; r2++) col.push(grid[r2][c2] === 1 ? 1 : 0);
        if (!lineMatches(col, cluesC[c2])) return;
      }
      done = true;
      if (timer) { clearInterval(timer); timer = null; }
      var secs = Math.floor((Date.now() - t0) / 1000);
      var best = lsGet("gb_nono_best_" + diff(), 0);
      if (!best || secs < best) { best = secs; lsSet("gb_nono_best_" + diff(), best); }
      $("noBest").textContent = fmt(best);
      $("noTime").textContent = fmt(secs);
      banner($("noBanner"), "Solved in <b>" + fmt(secs) + "</b>!");
      beep(750, 0.3);
    }
    stopFns.nono = function () { if (timer) { clearInterval(timer); timer = null; } };
    $("noNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 42. WORDLE ============ */
  (function () {
    var POOLS = {
      4: ["COLD","WARM","GAME","PLAY","CODE","TREE","FISH","BIRD","CAKE","RAIN","SNOW","WIND","FIRE","STAR","MOON","ROCK","LEAF","WOLF","BEAR","LION","GOLD","SILK","SHIP","DOOR","BOOK","SONG","HAND","FOOT","RING","COIN"],
      5: ["CRANE","SLATE","ADIEU","ROAST","PLANT","STONE","BREAD","CLOUD","DREAM","EAGLE","FLAME","GRASS","HOUSE","LIGHT","MUSIC","NIGHT","OCEAN","PIANO","QUEEN","RIVER","SNAKE","TIGER","WATER","WORLD","YOUTH","ZEBRA","APPLE","BEACH","CHAIR","DANCE"],
      6: ["PLANET","BRIDGE","CASTLE","DRAGON","ENGINE","FOREST","GARDEN","HAMMER","ISLAND","JUNGLE","KNIGHT","LADDER","MAGNET","NICKEL","ORANGE","PENCIL","QUARTZ","ROCKET","SILVER","TEMPLE","WALNUT","YELLOW","ZIGZAG","BANANA","CAMERA","DANGER","EFFORT","FLOWER","GOBLIN","HELMET"],
      7: ["RAINBOW","PYRAMID","VOLCANO","DOLPHIN","PENGUIN","GIRAFFE","MACHINE","BALLOON","CABINET","DIAMOND","EMPEROR","FURNACE","HAMMOCK","ICEBERG","JOURNEY","KINGDOM","LANTERN","OCTOPUS","PIONEER","QUALITY","TRIBUTE","UNICORN","VILLAGE","WHISPER","FANTASY","JUSTICE","LIBERTY","MYSTERY","PASTIME","QUICKLY"]
    };
    var KEYROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    var target, len, guesses, row, cur, done, keyState;
    function cfg() { return DP.wordle[diff()]; }
    function reset() {
      len = cfg().len; guesses = cfg().guesses;
      var pool = POOLS[len];
      target = pool[Math.floor(Math.random() * pool.length)];
      row = 0; cur = ""; done = false; keyState = {};
      var best = lsGet("gb_wordle_best_" + diff(), 0);
      $("wlBest").textContent = best || "\u2014";
      $("wlLeft").textContent = guesses;
      $("wlMsg").textContent = "Guess the " + len + "-letter word.";
      hideBanner($("wlBanner"));
      renderGrid();
      renderKeys();
    }
    function renderGrid() {
      var el = $("wlGrid");
      el.innerHTML = "";
      for (var r = 0; r < guesses; r++) {
        var rd = document.createElement("div");
        rd.className = "wl-row";
        for (var c = 0; c < len; c++) {
          var t = document.createElement("div");
          t.className = "wl-tile";
          t.id = "wl-t-" + r + "-" + c;
          rd.appendChild(t);
        }
        el.appendChild(rd);
      }
    }
    function renderKeys() {
      var el = $("wlKeys");
      el.innerHTML = "";
      for (var i = 0; i < KEYROWS.length; i++) {
        (function (i) {
          var rd = document.createElement("div");
          rd.className = "wl-krow";
          var rowStr = KEYROWS[i];
          for (var k = 0; k < rowStr.length; k++) {
            (function (ch) {
              var b = document.createElement("button");
              b.className = "wl-key";
              b.id = "wl-k-" + ch;
              b.textContent = ch;
              b.addEventListener("click", function () { input(ch); });
              rd.appendChild(b);
            })(rowStr[k]);
          }
          if (i === 2) {
            var enter = document.createElement("button");
            enter.className = "wl-key wide";
            enter.textContent = "ENTER";
            enter.addEventListener("click", function () { submit(); });
            rd.appendChild(enter);
            var del = document.createElement("button");
            del.className = "wl-key wide";
            del.textContent = "\u232B";
            del.addEventListener("click", function () { input("\u232B"); });
            rd.appendChild(del);
          }
          el.appendChild(rd);
        })(i);
      }
    }
    function paintTile(r, c, letter, state) {
      var t = $("wl-t-" + r + "-" + c);
      t.textContent = letter;
      t.className = "wl-tile " + state;
    }
    function setKeyState(ch, state) {
      var rank = { absent: 1, present: 2, correct: 3 };
      if (!keyState[ch] || rank[state] > rank[keyState[ch]]) {
        keyState[ch] = state;
        var k = $("wl-k-" + ch);
        if (k) k.className = "wl-key " + state;
      }
    }
    function input(ch) {
      if (done) return;
      if (ch === "\u232B") { cur = cur.slice(0, -1); paintRow(); return; }
      if (cur.length < len) { cur += ch; paintRow(); beep(440, 0.03); }
    }
    function paintRow() {
      for (var c = 0; c < len; c++) {
        var t = $("wl-t-" + row + "-" + c);
        t.textContent = cur[c] || "";
        t.className = "wl-tile";
      }
    }
    function submit() {
      if (done) return;
      if (cur.length < len) { $("wlMsg").textContent = "Not enough letters."; beep(180, 0.1); return; }
      var pool = POOLS[len];
      if (pool.indexOf(cur) === -1) { $("wlMsg").textContent = "Not in word list."; beep(180, 0.1); return; }
      var res = evaluate(cur);
      for (var c = 0; c < len; c++) {
        paintTile(row, c, cur[c], res[c]);
        setKeyState(cur[c], res[c]);
      }
      var allCorrect = true;
      for (var c2 = 0; c2 < len; c2++) if (res[c2] !== "correct") allCorrect = false;
      if (allCorrect) { win(row + 1); return; }
      row++;
      cur = "";
      $("wlLeft").textContent = guesses - row;
      if (row >= guesses) { lose(); return; }
      $("wlMsg").textContent = "Guess " + (row + 1) + " of " + guesses + ".";
    }
    function evaluate(guess) {
      var res = [], i;
      for (i = 0; i < len; i++) res.push("absent");
      var remaining = {};
      for (i = 0; i < len; i++) {
        if (guess[i] === target[i]) res[i] = "correct";
        else remaining[target[i]] = (remaining[target[i]] || 0) + 1;
      }
      for (i = 0; i < len; i++) {
        if (res[i] === "correct") continue;
        var ch = guess[i];
        if (remaining[ch] > 0) { res[i] = "present"; remaining[ch]--; }
      }
      return res;
    }
    function win(used) {
      done = true;
      var best = lsGet("gb_wordle_best_" + diff(), 0);
      if (!best || used < best) { best = used; lsSet("gb_wordle_best_" + diff(), best); }
      $("wlBest").textContent = best;
      $("wlMsg").textContent = "You got it in " + used + "!";
      banner($("wlBanner"), "Solved in <b>" + used + "</b> guess" + (used === 1 ? "" : "es") + "!");
      beep(750, 0.3);
    }
    function lose() {
      done = true;
      $("wlMsg").textContent = "The word was " + target + ".";
      banner($("wlBanner"), "Out of guesses! It was <b>" + target + "</b>.");
      beep(200, 0.3);
    }
    document.addEventListener("keydown", function (e) {
      if (current !== "wordle") return;
      if (e.key === "Enter") { e.preventDefault(); submit(); }
      else if (e.key === "Backspace") { e.preventDefault(); input("\u232B"); }
      else if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); input(e.key.toUpperCase()); }
    });
    $("wlNew").addEventListener("click", reset);
    reset();
  })();

/* ============ 43. CHECKERS ============ */
(function () {
  var ckBoard = $("ckBoard");
  var ckMsg = $("ckMsg");
  var ckYou = $("ckYou");
  var ckDraw = $("ckDraw");
  var ckCpu = $("ckCpu");
  var ckBanner = $("ckBanner");

  var board = [];
  var turn = 1;
  var sel = null;
  var selMoves = [];
  var over = false;
  var cpuTimer = null;
  var msgTimer = null;
  var you = 0;
  var draws = 0;
  var cpu = 0;
  var sinceCap = 0;

  function cfg() { return DP.checkers[diff()]; }

  function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

  function isSide(v, side) {
    return side === 1 ? (v === 1 || v === 2) : (v === 3 || v === 4);
  }

  function isEnemy(v, side) {
    return side === 1 ? (v === 3 || v === 4) : (v === 1 || v === 2);
  }

  function copyBoard(b) {
    var nb = [];
    for (var i = 0; i < 8; i++) nb.push(b[i].slice());
    return nb;
  }

  function dirsFor(v, side) {
    if (v === 2 || v === 4) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return side === 1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function jumpDFS(b, r, c, v, side, path, jumps) {
    var ds = dirsFor(v, side);
    var extended = false;
    for (var d = 0; d < ds.length; d++) {
      var mr = r + ds[d][0];
      var mc = c + ds[d][1];
      var lr = r + 2 * ds[d][0];
      var lc = c + 2 * ds[d][1];
      if (inb(lr, lc) && isEnemy(b[mr][mc], side) && b[lr][lc] === 0) {
        var nb = copyBoard(b);
        nb[r][c] = 0;
        nb[mr][mc] = 0;
        var nv = v;
        if (side === 1 && v === 1 && lr === 0) nv = 2;
        if (side === 2 && v === 3 && lr === 7) nv = 4;
        nb[lr][lc] = nv;
        var newPath = path.concat([[lr, lc]]);
        extended = true;
        if (nv !== v) {
          jumps.push({ from: path[0], path: newPath });
        } else {
          jumpDFS(nb, lr, lc, nv, side, newPath, jumps);
        }
      }
    }
    if (!extended && path.length > 1) {
      jumps.push({ from: path[0], path: path });
    }
  }

  function genMoves(b, side) {
    var jumps = [];
    var r, c, d;
    for (r = 0; r < 8; r++) {
      for (c = 0; c < 8; c++) {
        if (isSide(b[r][c], side)) {
          jumpDFS(b, r, c, b[r][c], side, [[r, c]], jumps);
        }
      }
    }
    if (jumps.length > 0) return jumps;
    var moves = [];
    for (r = 0; r < 8; r++) {
      for (c = 0; c < 8; c++) {
        if (isSide(b[r][c], side)) {
          var ds = dirsFor(b[r][c], side);
          for (d = 0; d < ds.length; d++) {
            var nr = r + ds[d][0];
            var nc = c + ds[d][1];
            if (inb(nr, nc) && b[nr][nc] === 0) {
              moves.push({ from: [r, c], path: [[nr, nc]] });
            }
          }
        }
      }
    }
    return moves;
  }

  function applyMove(b, move, side) {
    var nb = copyBoard(b);
    var from = move.from;
    var path = move.path;
    nb[from[0]][from[1]] = 0;
    for (var i = 0; i < path.length - 1; i++) {
      var a = path[i];
      var bb = path[i + 1];
      if (Math.abs(bb[0] - a[0]) === 2) {
        nb[(a[0] + bb[0]) / 2][(a[1] + bb[1]) / 2] = 0;
      }
    }
    var last = path[path.length - 1];
    var v = b[from[0]][from[1]];
    if (side === 1 && v === 1 && last[0] === 0) v = 2;
    if (side === 2 && v === 3 && last[0] === 7) v = 4;
    nb[last[0]][last[1]] = v;
    return nb;
  }

  function evaluate(b) {
    var s = 0;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var v = b[r][c];
        if (v === 1) s += 100 + (7 - r) * 4;
        else if (v === 2) s += 300;
        else if (v === 3) s -= 100 + r * 4;
        else if (v === 4) s -= 300;
      }
    }
    return s;
  }

  function minimax(b, depth, maximizing, alpha, beta) {
    var side = maximizing ? 1 : 2;
    var moves = genMoves(b, side);
    if (depth === 0) return evaluate(b);
    if (moves.length === 0) return maximizing ? -100000 : 100000;
    var i;
    if (maximizing) {
      var best = -Infinity;
      for (i = 0; i < moves.length; i++) {
        var nb = applyMove(b, moves[i], 1);
        best = Math.max(best, minimax(nb, depth - 1, false, alpha, beta));
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    }
    var best2 = Infinity;
    for (i = 0; i < moves.length; i++) {
      var nb2 = applyMove(b, moves[i], 2);
      best2 = Math.min(best2, minimax(nb2, depth - 1, true, alpha, beta));
      beta = Math.min(beta, best2);
      if (beta <= alpha) break;
    }
    return best2;
  }

  function render() {
    ckBoard.innerHTML = "";
    ckBoard.style.gridTemplateColumns = "repeat(8, 1fr)";
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        (function (r, c) {
          var v = board[r][c];
          var cls = "ck-cell" + ((r + c) % 2 === 0 ? " light" : " dark");
          if (v === 1 || v === 2) cls += " p1";
          if (v === 3 || v === 4) cls += " p2";
          if (v === 2 || v === 4) cls += " king";
          if (sel && sel[0] === r && sel[1] === c) cls += " sel";
          for (var m = 0; m < selMoves.length; m++) {
            var p = selMoves[m].path;
            var last = p[p.length - 1];
            if (last[0] === r && last[1] === c) { cls += " hint"; break; }
          }
          var btn = document.createElement("button");
          btn.className = cls;
          btn.addEventListener("click", function () { tapCell(r, c); });
          ckBoard.appendChild(btn);
        })(r, c);
      }
    }
  }

  function tapCell(r, c) {
    if (over || turn !== 1) return;
    var m, i;
    if (sel) {
      for (m = 0; m < selMoves.length; m++) {
        var p = selMoves[m].path;
        var last = p[p.length - 1];
        if (last[0] === r && last[1] === c) {
          var move = selMoves[m];
          var fromV = board[move.from[0]][move.from[1]];
          board = applyMove(board, move, 1);
          var wasJump = move.path.length > 2;
          var wasPromo = (fromV === 1 && last[0] === 0);
          sinceCap = (wasJump || wasPromo) ? 0 : sinceCap + 1;
          sel = null;
          selMoves = [];
          afterMove();
          return;
        }
      }
    }
    if (board[r][c] === 1 || board[r][c] === 2) {
      var all = genMoves(board, 1);
      var mine = [];
      for (i = 0; i < all.length; i++) {
        if (all[i].from[0] === r && all[i].from[1] === c) mine.push(all[i]);
      }
      if (mine.length > 0) {
        sel = [r, c];
        selMoves = mine;
        beep(400, 0.04);
        render();
      } else {
        ckMsg.textContent = "Another piece must jump.";
        if (msgTimer) clearTimeout(msgTimer);
        msgTimer = setTimeout(function () {
          if (!over && turn === 1) ckMsg.textContent = "Your turn.";
        }, 1200);
      }
    } else {
      sel = null;
      selMoves = [];
      render();
    }
  }

  function afterMove() {
    if (sinceCap >= 80) { gameOver(0); return; }
    turn = (turn === 1 ? 2 : 1);
    if (genMoves(board, turn).length === 0) {
      gameOver(turn === 1 ? 2 : 1);
      return;
    }
    if (turn === 2) {
      ckMsg.textContent = "CPU thinking…";
      render();
      cpuTimer = setTimeout(function () { cpuMove(); }, 450);
    } else {
      ckMsg.textContent = "Your turn.";
      render();
    }
  }

  function cpuMove() {
    if (over) return;
    var depth = cfg().depth;
    var moves = genMoves(board, 2);
    if (moves.length === 0) { gameOver(1); return; }
    var best = null;
    var i;
    if (depth === 1 && Math.random() < 0.25) {
      best = moves[Math.floor(Math.random() * moves.length)];
    } else {
      var bestV = Infinity;
      var bestIdxs = [];
      for (i = 0; i < moves.length; i++) {
        var nb = applyMove(board, moves[i], 2);
        var v = minimax(nb, depth - 1, true, -Infinity, Infinity);
        if (v < bestV) { bestV = v; bestIdxs = [i]; }
        else if (v === bestV) { bestIdxs.push(i); }
      }
      best = moves[bestIdxs[Math.floor(Math.random() * bestIdxs.length)]];
    }
    var fromV = board[best.from[0]][best.from[1]];
    var last = best.path[best.path.length - 1];
    var wasJump = best.path.length > 2;
    var wasPromo = (fromV === 3 && last[0] === 7);
    board = applyMove(board, best, 2);
    sinceCap = (wasJump || wasPromo) ? 0 : sinceCap + 1;
    afterMove();
  }

  function gameOver(result) {
    over = true;
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
    if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
    if (result === 1) you++;
    else if (result === 2) cpu++;
    else draws++;
    ckYou.textContent = you;
    ckDraw.textContent = draws;
    ckCpu.textContent = cpu;
    var html;
    if (result === 1) { ckMsg.textContent = "You win!"; html = "You win! 🎉"; }
    else if (result === 2) { ckMsg.textContent = "CPU wins."; html = "CPU wins."; }
    else { ckMsg.textContent = "Draw."; html = "Draw."; }
    banner(ckBanner, html);
    beep(result === 1 ? 750 : 200, 0.3);
    render();
  }

  function reset() {
    board = [];
    for (var r = 0; r < 8; r++) {
      var row = [];
      for (var c = 0; c < 8; c++) {
        var v = 0;
        if ((r + c) % 2 === 1) {
          if (r <= 2) v = 3;
          else if (r >= 5) v = 1;
        }
        row.push(v);
      }
      board.push(row);
    }
    turn = 1;
    sel = null;
    selMoves = [];
    over = false;
    sinceCap = 0;
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
    if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
    ckYou.textContent = you;
    ckDraw.textContent = draws;
    ckCpu.textContent = cpu;
    ckMsg.textContent = "Your turn — blue moves first.";
    hideBanner(ckBanner);
    render();
  }

  stopFns.checkers = function () {
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
    if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
  };

  $("ckNew").addEventListener("click", reset);
  reset();
})();

/* ============ 44. MANCALA ============ */
(function () {
  var mcBoard = $("mcBoard");
  var mcMsg = $("mcMsg");
  var mcYou = $("mcYou");
  var mcDraw = $("mcDraw");
  var mcCpu = $("mcCpu");
  var mcBanner = $("mcBanner");

  var board = [];
  var turn = 0;
  var over = false;
  var cpuTimer = null;
  var you = 0;
  var draws = 0;
  var cpu = 0;

  function cfg() { return DP.mancala[diff()]; }

  function myStore(side) { return side === 0 ? 6 : 13; }
  function oppStore(side) { return side === 0 ? 13 : 6; }
  function isMyPit(i, side) { return side === 0 ? (i >= 0 && i <= 5) : (i >= 7 && i <= 12); }

  function sow(b, pit, side) {
    var nb = b.slice();
    var stones = nb[pit];
    nb[pit] = 0;
    var i = pit;
    while (stones > 0) {
      i = (i + 1) % 14;
      if (i === oppStore(side)) continue;
      nb[i]++;
      stones--;
    }
    var extra = (i === myStore(side));
    if (!extra && isMyPit(i, side) && nb[i] === 1) {
      var opp = 12 - i;
      if (nb[opp] > 0) {
        nb[myStore(side)] += nb[opp] + 1;
        nb[opp] = 0;
        nb[i] = 0;
      }
    }
    return { board: nb, extra: extra };
  }

  function legalMoves(b, side) {
    var ms = [];
    var i;
    if (side === 0) {
      for (i = 0; i <= 5; i++) { if (b[i] > 0) ms.push(i); }
    } else {
      for (i = 7; i <= 12; i++) { if (b[i] > 0) ms.push(i); }
    }
    return ms;
  }

  function isEnd(b) {
    var i;
    var empty0 = true;
    for (i = 0; i <= 5; i++) {
      if (b[i] > 0) { empty0 = false; break; }
    }
    if (empty0) return true;
    for (i = 7; i <= 12; i++) {
      if (b[i] > 0) return false;
    }
    return true;
  }

  function finalize(b) {
    var nb = b.slice();
    var s0 = 0;
    var s1 = 0;
    var i;
    for (i = 0; i <= 5; i++) s0 += nb[i];
    for (i = 7; i <= 12; i++) s1 += nb[i];
    nb[6] += s0;
    nb[13] += s1;
    for (i = 0; i <= 5; i++) nb[i] = 0;
    for (i = 7; i <= 12; i++) nb[i] = 0;
    return nb;
  }

  function evalBoard(b) { return b[6] - b[13]; }

  function minimax(b, depth, side) {
    if (depth === 0 || isEnd(b)) {
      var bb = isEnd(b) ? finalize(b) : b;
      return evalBoard(bb);
    }
    var moves = legalMoves(b, side);
    var i;
    if (side === 0) {
      var best = -Infinity;
      for (i = 0; i < moves.length; i++) {
        var res = sow(b, moves[i], 0);
        var v = res.extra ? minimax(res.board, depth - 1, 0) : minimax(res.board, depth - 1, 1);
        if (v > best) best = v;
      }
      return best;
    }
    var best2 = Infinity;
    for (i = 0; i < moves.length; i++) {
      var res2 = sow(b, moves[i], 1);
      var v2 = res2.extra ? minimax(res2.board, depth - 1, 1) : minimax(res2.board, depth - 1, 0);
      if (v2 < best2) best2 = v2;
    }
    return best2;
  }

  function render() {
    mcBoard.innerHTML = "";
    var s = document.createElement("div");
    s.className = "mc-store cpu";
    s.textContent = board[13];
    mcBoard.appendChild(s);
    var i;
    for (i = 7; i <= 12; i++) {
      var p = document.createElement("div");
      p.className = "mc-pit";
      p.textContent = board[i];
      mcBoard.appendChild(p);
    }
    var ys = document.createElement("div");
    ys.className = "mc-store you";
    ys.textContent = board[6];
    mcBoard.appendChild(ys);
    for (i = 0; i <= 5; i++) {
      (function (i) {
        var btn = document.createElement("button");
        btn.className = "mc-pit mine" + (board[i] === 0 ? " empty" : "");
        btn.textContent = board[i];
        btn.addEventListener("click", function () { tapPit(i); });
        mcBoard.appendChild(btn);
      })(i);
    }
  }

  function tapPit(i) {
    if (over || turn !== 0) return;
    if (!isMyPit(i, 0) || board[i] === 0) return;
    var res = sow(board, i, 0);
    board = res.board;
    beep(450, 0.05);
    afterMove(res.extra ? 0 : 1);
  }

  function afterMove(nextTurn) {
    if (isEnd(board)) {
      board = finalize(board);
      gameOver();
      return;
    }
    turn = nextTurn;
    if (turn === 1) {
      mcMsg.textContent = "CPU thinking…";
      render();
      cpuTimer = setTimeout(function () { cpuMove(); }, 500);
    } else {
      mcMsg.textContent = "Your turn — tap one of your pits.";
      render();
    }
  }

  function cpuMove() {
    if (over) return;
    var depth = cfg().depth;
    var moves = legalMoves(board, 1);
    if (moves.length === 0) {
      board = finalize(board);
      gameOver();
      return;
    }
    var best = moves[0];
    var i;
    if (depth === 1 && Math.random() < 0.25) {
      best = moves[Math.floor(Math.random() * moves.length)];
    } else {
      var bestV = Infinity;
      var bestIdxs = [];
      for (i = 0; i < moves.length; i++) {
        var res = sow(board, moves[i], 1);
        var v = res.extra ? minimax(res.board, depth - 1, 1) : minimax(res.board, depth - 1, 0);
        if (v < bestV) { bestV = v; bestIdxs = [i]; }
        else if (v === bestV) { bestIdxs.push(i); }
      }
      best = moves[bestIdxs[Math.floor(Math.random() * bestIdxs.length)]];
    }
    var res2 = sow(board, best, 1);
    board = res2.board;
    afterMove(res2.extra ? 1 : 0);
  }

  function gameOver() {
    over = true;
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
    var html;
    var playerWon = board[6] > board[13];
    if (playerWon) { you++; html = "You win! 🎉"; }
    else if (board[13] > board[6]) { cpu++; html = "CPU wins."; }
    else { draws++; html = "Draw."; }
    mcYou.textContent = you;
    mcDraw.textContent = draws;
    mcCpu.textContent = cpu;
    mcMsg.textContent = "Stores — you: " + board[6] + ", CPU: " + board[13];
    banner(mcBanner, html);
    beep(playerWon ? 750 : 200, 0.3);
    render();
  }

  function reset() {
    board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
    turn = 0;
    over = false;
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
    mcYou.textContent = you;
    mcDraw.textContent = draws;
    mcCpu.textContent = cpu;
    mcMsg.textContent = "Your turn — tap one of your pits.";
    hideBanner(mcBanner);
    render();
  }

  stopFns.mancala = function () {
    if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
  };

  $("mcNew").addEventListener("click", reset);
  reset();
})();

/* ============ 47. AIR HOCKEY ============ */
(function () {
  var W = 360, H = 360, GOAL_W = 120, MALLET_R = 22, PUCK_R = 12;
  var player = { x: W / 2, y: H - 60, vx: 0, vy: 0, r: MALLET_R };
  var cpu = { x: W / 2, y: 60, vx: 0, vy: 0, r: MALLET_R };
  var puck = { x: W / 2, y: H / 2, vx: 0, vy: 0, r: PUCK_R };
  var youScore = 0, cpuScore = 0, running = false, raf = null, over = false;
  var pointer = null;
  var best = 0;

  function cfg() { return DP.hockey[diff()]; }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function updatePlayer() {
    var ox = player.x, oy = player.y;
    if (pointer) {
      var tx = clamp(pointer.x, MALLET_R, W - MALLET_R);
      var ty = clamp(pointer.y, H / 2 + MALLET_R, H - MALLET_R);
      player.x = tx;
      player.y = ty;
    }
    player.vx = player.x - ox;
    player.vy = player.y - oy;
  }

  function updateCpu() {
    var ox = cpu.x, oy = cpu.y;
    var tx, ty;
    if (puck.y < H / 2 && puck.vy < 0.5) {
      var t = clamp((cpu.y - puck.y) / (puck.vy || -1), 0, 60);
      tx = clamp(puck.x + puck.vx * t, MALLET_R, W - MALLET_R);
      ty = clamp(puck.y, MALLET_R + 4, H / 2 - MALLET_R);
    } else {
      tx = W / 2;
      ty = MALLET_R + 24;
    }
    var sp = cfg().cpu;
    var dx = tx - cpu.x, dy = ty - cpu.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d > sp) {
      cpu.x += dx / d * sp;
      cpu.y += dy / d * sp;
    } else {
      cpu.x = tx;
      cpu.y = ty;
    }
    cpu.vx = cpu.x - ox;
    cpu.vy = cpu.y - oy;
  }

  function updatePuck() {
    puck.x += puck.vx;
    puck.y += puck.vy;
    puck.vx *= 0.995;
    puck.vy *= 0.995;
    var sp = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
    if (sp > 15) {
      puck.vx = puck.vx / sp * 15;
      puck.vy = puck.vy / sp * 15;
    }
    if (puck.x < puck.r) { puck.x = puck.r; puck.vx = Math.abs(puck.vx); beep(300, 0.03); }
    if (puck.x > W - puck.r) { puck.x = W - puck.r; puck.vx = -Math.abs(puck.vx); beep(300, 0.03); }
    var inGoal = (puck.x > W / 2 - GOAL_W / 2 && puck.x < W / 2 + GOAL_W / 2);
    if (puck.y < puck.r) {
      if (inGoal) { goal(1); return; }
      puck.y = puck.r;
      puck.vy = Math.abs(puck.vy);
      beep(300, 0.03);
    }
    if (puck.y > H - puck.r) {
      if (inGoal) { goal(2); return; }
      puck.y = H - puck.r;
      puck.vy = -Math.abs(puck.vy);
      beep(300, 0.03);
    }
    collide(player);
    collide(cpu);
  }

  function collide(m) {
    var dx = puck.x - m.x, dy = puck.y - m.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var minD = m.r + puck.r;
    if (dist < minD && dist > 0.001) {
      var nx = dx / dist, ny = dy / dist;
      puck.x = m.x + nx * minD;
      puck.y = m.y + ny * minD;
      var rvx = puck.vx - m.vx, rvy = puck.vy - m.vy;
      var dot = rvx * nx + rvy * ny;
      if (dot < 0) {
        puck.vx = rvx - 2 * dot * nx + m.vx * 1.2;
        puck.vy = rvy - 2 * dot * ny + m.vy * 1.2;
        beep(500, 0.04);
      }
    }
  }

  function goal(side) {
    if (side === 1) { youScore++; } else { cpuScore++; }
    $("hkYou").textContent = youScore;
    $("hkCpu").textContent = cpuScore;
    beep(side === 1 ? 700 : 200, 0.25);
    if (youScore >= 7 || cpuScore >= 7) { endGame(); return; }
    serve();
  }

  function serve() {
    var a = Math.random() * Math.PI * 2;
    puck.x = W / 2;
    puck.y = H / 2;
    puck.vx = Math.cos(a) * 4;
    puck.vy = Math.sin(a) * 4;
    player.x = W / 2; player.y = H - 60; player.vx = 0; player.vy = 0;
    cpu.x = W / 2; cpu.y = 60; cpu.vx = 0; cpu.vy = 0;
  }

  function endGame() {
    running = false;
    over = true;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    var win = youScore > cpuScore;
    if (win) {
      best = lsGet("gb_hockey_best_" + diff(), 0);
      if (!best || cpuScore < best) {
        best = cpuScore;
        lsSet("gb_hockey_best_" + diff(), best);
      }
    }
    banner($("hkBanner"), win ? "You win <b>" + youScore + "–" + cpuScore + "</b>!" : "CPU wins <b>" + cpuScore + "–" + youScore + "</b>.");
    beep(win ? 750 : 200, 0.3);
    draw();
  }

  function step() {
    if (!running) { raf = null; return; }
    updatePlayer();
    updateCpu();
    updatePuck();
    draw();
    raf = requestAnimationFrame(step);
  }

  function draw() {
    var c = $("hkCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#0b0f13";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#2c3743";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#12351f";
    ctx.fillRect(W / 2 - GOAL_W / 2, 0, GOAL_W, 4);
    ctx.fillStyle = "#3b1414";
    ctx.fillRect(W / 2 - GOAL_W / 2, H - 4, GOAL_W, 4);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, puck.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.arc(cpu.x, cpu.y, cpu.r, 0, Math.PI * 2);
    ctx.fill();
    if (!running) {
      ctx.fillStyle = "#8a97a5";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Tap Start to play", W / 2, H / 2 + 80);
    }
  }

  function setPointer(e) {
    var rect = $("hkCanvas").getBoundingClientRect();
    var cx, cy;
    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }
    pointer = {
      x: (cx - rect.left) / rect.width * W,
      y: (cy - rect.top) / rect.height * H
    };
  }

  var cv = $("hkCanvas");
  cv.addEventListener("touchstart", function (e) { e.preventDefault(); setPointer(e); }, { passive: false });
  cv.addEventListener("touchmove", function (e) { e.preventDefault(); setPointer(e); }, { passive: false });
  cv.addEventListener("mousedown", function (e) { setPointer(e); });
  cv.addEventListener("mousemove", function (e) { setPointer(e); });

  function start() {
    reset();
    running = true;
    if (!raf) raf = requestAnimationFrame(step);
  }

  function reset() {
    youScore = 0;
    cpuScore = 0;
    over = false;
    running = false;
    $("hkYou").textContent = "0";
    $("hkCpu").textContent = "0";
    hideBanner($("hkBanner"));
    serve();
    draw();
  }

  $("hkStart").addEventListener("click", start);
  stopFns.hockey = function () {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  };
  reset();
})();

/* ============ 48. SLOTS ============ */
(function () {
  var SYM = ["\uD83C\uDF52","\uD83C\uDF4B","\uD83C\uDF47","\uD83C\uDF49","\u2B50","\uD83D\uDC8E","7"];
  var PAY = [15, 20, 30, 40, 60, 100, 250];
  var coins = 0, spinning = false, best = 0;
  var ivs = [], tms = [];

  function cfg() { return DP.slots[diff()]; }

  function randSym() { return Math.floor(Math.random() * SYM.length); }

  function updateSpinBtn() {
    $("scSpin").disabled = spinning || coins < 10;
    $("scSpin").textContent = spinning ? "Spinning…" : (coins < 10 ? "Need 10" : "Spin (10)");
  }

  function spin() {
    if (spinning || coins < 10) return;
    coins -= 10;
    $("scCoins").textContent = coins;
    spinning = true;
    updateSpinBtn();
    $("scMsg").textContent = "Spinning…";
    var result = [randSym(), randSym(), randSym()];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var iv = setInterval(function () {
          $("scR" + i).textContent = SYM[Math.floor(Math.random() * SYM.length)];
          $("scR" + i).classList.add("spin");
        }, 60);
        ivs.push(iv);
        var tm = setTimeout(function () {
          clearInterval(iv);
          $("scR" + i).classList.remove("spin");
          $("scR" + i).textContent = SYM[result[i]];
          if (i === 2) settle(result);
        }, 500 + i * 350);
        tms.push(tm);
      })(i);
    }
  }

  function settle(result) {
    spinning = false;
    updateSpinBtn();
    var mult = cfg().mult;
    if (result[0] === result[1] && result[1] === result[2]) {
      var idx = SYM.indexOf(result[0]);
      var win = Math.round(PAY[idx] * mult);
      coins += win;
      $("scMsg").textContent = (win >= 200 ? "JACKPOT! +" : "Three " + result[0] + " ! +") + win;
      beep(700, 0.3);
    } else {
      $("scMsg").textContent = "No match. -10";
      beep(200, 0.15);
    }
    $("scCoins").textContent = coins;
    if (coins > best) {
      best = coins;
      lsSet("gb_slots_best_" + diff(), best);
      $("scBest").textContent = best;
    }
    if (coins < 10) {
      banner($("scBanner"), "Out of coins! Best: <b>" + best + "</b>. Press New to rebuy.");
    }
  }

  function reset() {
    coins = cfg().coins;
    spinning = false;
    for (var i = 0; i < ivs.length; i++) clearInterval(ivs[i]);
    for (var j = 0; j < tms.length; j++) clearTimeout(tms[j]);
    ivs = [];
    tms = [];
    best = lsGet("gb_slots_best_" + diff(), 0);
    $("scCoins").textContent = coins;
    $("scBest").textContent = best;
    $("scMsg").textContent = "Match three of a kind to win. 7-7-7 is the jackpot.";
    hideBanner($("scBanner"));
    $("scR0").textContent = SYM[0];
    $("scR1").textContent = SYM[1];
    $("scR2").textContent = SYM[2];
    updateSpinBtn();
  }

  $("scSpin").addEventListener("click", spin);
  $("scNew").addEventListener("click", reset);
  stopFns.slots = function () {
    for (var i = 0; i < ivs.length; i++) clearInterval(ivs[i]);
    for (var j = 0; j < tms.length; j++) clearTimeout(tms[j]);
    ivs = [];
    tms = [];
    spinning = false;
  };
  reset();
})();

/* ============ 45. FLOW FREE ============ */
(function () {
  var fwGrid = $("fwGrid");
  var fwMoves = $("fwMoves");
  var fwBest = $("fwBest");
  var fwBanner = $("fwBanner");

  var n, pairs, endpoints, paths, grid, complete, active, dragging, done, moves;

  var PAL = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];

  function cfg() { return DP.flow[diff()]; }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }

  function hamiltonian(n) {
    var total = n * n;
    var visited = [];
    var path = [];
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    var budget = 200000;
    var nodes = 0;

    for (var i = 0; i < n; i++) { visited.push(new Array(n).fill(false)); }

    var sr = Math.floor(Math.random() * n);
    var sc = Math.floor(Math.random() * n);

    function dfs(r, c) {
      if (++nodes > budget) return false;
      path.push([r, c]);
      visited[r][c] = true;
      if (path.length === total) return true;
      shuffle(dirs);
      for (var d = 0; d < 4; d++) {
        var nr = r + dirs[d][0], nc = c + dirs[d][1];
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc]) {
          if (dfs(nr, nc)) return true;
        }
      }
      path.pop();
      visited[r][c] = false;
      return false;
    }

    if (dfs(sr, sc)) return path;
    return null;
  }

  function snakePath(n) {
    var path = [];
    for (var r = 0; r < n; r++) {
      if (r % 2 === 0) {
        for (var c = 0; c < n; c++) path.push([r, c]);
      } else {
        for (var c = n - 1; c >= 0; c--) path.push([r, c]);
      }
    }
    return path;
  }

  function gen() {
    n = cfg().n; pairs = cfg().pairs;
    var path = snakePath(n);
    var total = n * n;
    var segLen = total / pairs;
    endpoints = []; paths = []; grid = [];
    for (var r = 0; r < n; r++) { grid.push([]); for (var c = 0; c < n; c++) grid[r].push(-1); }
    for (var i = 0; i < pairs; i++) {
      var start = Math.round(i * segLen);
      var end = Math.round((i + 1) * segLen);
      if (i === pairs - 1) end = total;
      if (end <= start) end = start + 1;
      var seg = path.slice(start, end);
      if (seg.length < 2) continue;
      var ep = [seg[0], seg[seg.length - 1]];
      endpoints.push(ep);
      paths.push(null);
      grid[ep[0][0]][ep[0][1]] = i;
      grid[ep[1][0]][ep[1][1]] = i;
    }
    complete = [];
    for (var k = 0; k < pairs; k++) complete.push(false);
    active = -1; dragging = false; done = false; moves = 0;
  }

  function reset() {
    gen();
    fwMoves.textContent = "0";
    var best = lsGet("gb_flow_best_" + diff(), 0);
    fwBest.textContent = best || "\u221E";
    hideBanner(fwBanner);
    render();
  }

  function render() {
    fwGrid.innerHTML = "";
    fwGrid.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        (function (r, c) {
          var d = document.createElement("div");
          d.className = "fw-cell";
          var val = grid[r][c];
          if (val >= 0) {
            d.style.background = PAL[val];
            d.className += " pipe";
          }
          for (var k = 0; k < endpoints.length; k++) {
            if ((endpoints[k][0][0] === r && endpoints[k][0][1] === c) ||
                (endpoints[k][1][0] === r && endpoints[k][1][1] === c)) {
              d.className += " dot";
              break;
            }
          }
          fwGrid.appendChild(d);
        })(r, c);
      }
    }
  }

  function cellFromEvent(e, rect) {
    var cx = e.clientX, cy = e.clientY;
    if (e.touches && e.touches.length > 0) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    var c = Math.floor((cx - rect.left) / rect.width * n);
    var r = Math.floor((cy - rect.top) / rect.height * n);
    if (r < 0 || r >= n || c < 0 || c >= n) return null;
    return [r, c];
  }

  function startDrag(r, c) {
    var val = grid[r][c];
    if (val < 0) return false;
    for (var k = 0; k < endpoints.length; k++) {
      if ((endpoints[k][0][0] === r && endpoints[k][0][1] === c) ||
          (endpoints[k][1][0] === r && endpoints[k][1][1] === c)) {
        active = k;
        paths[k] = [[r, c]];
        complete[k] = false;
        dragging = true;
        beep(420, 0.04);
        return true;
      }
    }
    if (paths[val]) {
      for (var i = 0; i < paths[val].length; i++) {
        if (paths[val][i][0] === r && paths[val][i][1] === c) {
          var ep = endpoints[val];
          if (ep[0][0] === r && ep[0][1] === c) continue;
          if (ep[1][0] === r && ep[1][1] === c) continue;
          paths[val] = paths[val].slice(0, i + 1);
          for (var j = i + 1; j < paths[val].length; j++) {
            var cell = paths[val][j];
            if (!(cell[0] === ep[0][0] && cell[1] === ep[0][1]) &&
                !(cell[0] === ep[1][0] && cell[1] === ep[1][1])) {
              grid[cell[0]][cell[1]] = -1;
            }
          }
          active = val;
          dragging = true;
          beep(420, 0.04);
          return true;
        }
      }
    }
    return false;
  }

  function continueDrag(r, c) {
    if (active < 0 || !dragging) return;
    var path = paths[active];
    if (!path) return;
    var head = path[path.length - 1];
    if (Math.abs(r - head[0]) + Math.abs(c - head[1]) !== 1) return;
    if (path.length >= 2 && r === path[path.length - 2][0] && c === path[path.length - 2][1]) {
      var popped = path.pop();
      var ep = endpoints[active];
      if (!(popped[0] === ep[0][0] && popped[1] === ep[0][1]) &&
          !(popped[0] === ep[1][0] && popped[1] === ep[1][1])) {
        grid[popped[0]][popped[1]] = -1;
      }
      render();
      return;
    }
    var ep = endpoints[active];
    var otherEp = (ep[0][0] === head[0] && ep[0][1] === head[1]) ? ep[1] : ep[0];
    if (r === otherEp[0] && c === otherEp[1]) {
      path.push([r, c]);
      grid[r][c] = active;
      complete[active] = true;
      active = -1;
      dragging = false;
      moves++;
      fwMoves.textContent = moves;
      beep(600, 0.06);
      render();
      checkWin();
      return;
    }
    if (grid[r][c] === -1) {
      path.push([r, c]);
      grid[r][c] = active;
      render();
      return;
    }
    active = -1;
    dragging = false;
  }

  function endDrag() {
    dragging = false;
    active = -1;
  }

  function checkWin() {
    for (var k = 0; k < pairs; k++) {
      if (!complete[k]) return;
    }
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (grid[r][c] === -1) return;
      }
    }
    done = true;
    var best = lsGet("gb_flow_best_" + diff(), 0);
    if (!best || moves < best) { best = moves; lsSet("gb_flow_best_" + diff(), best); }
    fwBest.textContent = best;
    banner(fwBanner, "Connected all <b>" + pairs + "</b> pairs in <b>" + moves + "</b> moves!");
    beep(750, 0.3);
  }

  var rectCache = null;
  function getRect() {
    if (!rectCache) rectCache = fwGrid.getBoundingClientRect();
    return rectCache;
  }

  fwGrid.addEventListener("touchstart", function (e) {
    rectCache = fwGrid.getBoundingClientRect();
    var rc = cellFromEvent(e, rectCache);
    if (rc) startDrag(rc[0], rc[1]);
    render();
  }, { passive: true });

  fwGrid.addEventListener("touchmove", function (e) {
    e.preventDefault();
    var rc = cellFromEvent(e, rectCache);
    if (rc) continueDrag(rc[0], rc[1]);
  }, { passive: false });

  fwGrid.addEventListener("touchend", function (e) {
    endDrag();
  }, { passive: true });

  fwGrid.addEventListener("mousedown", function (e) {
    rectCache = fwGrid.getBoundingClientRect();
    var rc = cellFromEvent(e, rectCache);
    if (rc) startDrag(rc[0], rc[1]);
    render();
  });

  fwGrid.addEventListener("mousemove", function (e) {
    if (e.buttons & 1) {
      var rc = cellFromEvent(e, rectCache);
      if (rc) continueDrag(rc[0], rc[1]);
    }
  });

  fwGrid.addEventListener("mouseup", function (e) {
    endDrag();
  });

  stopFns.flow = function () { active = -1; dragging = false; };

  $("fwNew").addEventListener("click", reset);
  reset();
})();

/* ============ 46. TYPING TEST ============ */
(function () {
  var tyWord = $("tyWord");
  var tyInput = $("tyInput");
  var tyWpm = $("tyWpm");
  var tyTime = $("tyTime");
  var tyBest = $("tyBest");
  var tyBanner = $("tyBanner");

  var WORDS = [
    "the","and","for","are","but","not","you","all","can","her","was","one","our","out","day","get","has","him","his","how","man","new","now","old","see","two","way","who","boy","did","its","let","put","say","she","too","use",
    "about","after","again","below","could","every","first","found","great","house","large","learn","never","other","place","plant","point","right","small","sound","spell","still","study","their","there","these","thing","think","three","water","where","which","world","would","write",
    "always","because","become","before","behind","better","bring","brother","careful","change","children","classic","clever","close","colour","common","correct","dancer","dinner","doctor","dollar","double","easier","family","famous","father","friend","future","garden","gentle","golden","happen","hazard","health","heaven","hidden","hunger","imagine","island","jungle","kitten","ladder","lively","lovely","market","master","memory","middle","minute","mirror","modern","mother","mountain","muscle","mystery","narrow","native","nearly","needle","nickel","nobody","notion","number","object","office","online","orange","palace","parent","partly","patience","people","period","person","picture","pioneer","plastic","player","please","plenty","pocket","poetry","police","polite","popular","portrait","poster","potato","powder","prayer","prefer","pretty","priest","prince","prison","profit","proper","public","purple","puzzle","quarrel","rabbit","rarely","rather","really","reason","recent","recipe","regret","relief","remain","remote","repair","repeat","report","rescue","result","return","reveal","review","reward","ribbon","rocket","rubber","saddle","safety","salary","sample","school","screen","script","search","season","second","secret","sector","senior","serial","shadow","shelter","shortage","shoulder","silver","simple","sister","sketch","smooth","soccer","solar","somehow","speaker","special","spirit","splash","spoken","spread","spring","square","stable","station","stomach","stone","strike","strong","studio","submit","subtle","sudden","summer","sunset","supply","surely","survey","switch","symbol","system","tackle","talent","temple","tender","tennis","thanks","theory","thirty","thought","thunder","tobacco","tomorrow","tongue","toward","trader","traffic","travel","treaty","tunnel","twelve","twenty","unique","united","unless","update","useful","valley","various","vendor","verbal","verify","victory","village","violin","virtue","vision","visual","volume","voyage","wander","warmth","wealth","weapon","weekly","weight","whisper","widely","window","winner","winter","wisdom","wonder","worker","writer","yellow","yesterday","youngster","zebra","zigzag"
  ];

  var pool, current, typed, chars, errors, timeLeft, timer, running, t0, lastVal;

  function cfg() { return DP.type[diff()]; }

  function reset() {
    pool = WORDS.filter(function (w) { return w.length >= 3 && w.length <= cfg().maxlen; });
    current = pool[Math.floor(Math.random() * pool.length)];
    typed = 0; chars = 0; errors = 0; timeLeft = cfg().time; running = true; t0 = Date.now(); lastVal = "";
    tyInput.value = "";
    tyWpm.textContent = "0";
    tyTime.textContent = cfg().time;
    var best = lsGet("gb_type_best_" + diff(), 0);
    tyBest.textContent = best || "0";
    hideBanner(tyBanner);
    renderWord();
    if (timer) { clearInterval(timer); timer = null; }
    timer = setInterval(tick, 100);
    try { tyInput.focus(); } catch (e) {}
  }

  function tick() {
    if (!running) return;
    timeLeft -= 0.1;
    tyTime.textContent = Math.max(0, Math.ceil(timeLeft));
    if (timeLeft <= 0) finish();
  }

  function renderWord() {
    var v = tyInput.value;
    var html = "";
    for (var i = 0; i < current.length; i++) {
      if (i < v.length && v[i] === current[i]) {
        html += "<span style='color:#4ade80'>" + current[i] + "</span>";
      } else if (i < v.length) {
        html += "<span style='color:#f87171'>" + current[i] + "</span>";
      } else {
        html += "<span>" + current[i] + "</span>";
      }
    }
    tyWord.innerHTML = html;
  }

  function updateWpm() {
    var elapsed = (Date.now() - t0) / 1000;
    if (elapsed < 1/60) elapsed = 1/60;
    var wpm = Math.round((chars / 5) / (elapsed / 60));
    tyWpm.textContent = wpm;
  }

  function finish() {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
    updateWpm();
    var wpm = parseInt(tyWpm.textContent, 10) || 0;
    var acc = (chars + errors) > 0 ? Math.round(chars / (chars + errors) * 100) : 100;
    var best = lsGet("gb_type_best_" + diff(), 0);
    if (wpm > best) { best = wpm; lsSet("gb_type_best_" + diff(), best); }
    tyBest.textContent = best;
    banner(tyBanner, "Time! <b>" + wpm + "</b> WPM \u00b7 " + acc + "% accuracy \u00b7 " + typed + " words");
    beep(700, 0.3);
  }

  tyInput.addEventListener("input", function () {
    if (!running) return;
    var v = tyInput.value;
    if (v === current) {
      chars += current.length;
      typed++;
      beep(650, 0.05);
      var newWord = current;
      while (newWord === current && pool.length > 1) newWord = pool[Math.floor(Math.random() * pool.length)];
      current = newWord;
      tyInput.value = "";
      lastVal = "";
      updateWpm();
      renderWord();
    } else {
      if (v.length > lastVal.length && current.indexOf(v) !== 0) {
        errors++;
      }
      lastVal = v;
      renderWord();
    }
  });

  stopFns.type = function () {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
  };

  $("tyNew").addEventListener("click", reset);
  reset();
})();

/* ============ 49. QUIZ ============ */
(function () {
  var BANK = [
    [
      { q: "What colour do you get by mixing blue and yellow?", opts: ["Green", "Purple", "Orange", "Red"], a: 0 },
      { q: "How many days are there in a week?", opts: ["Five", "Six", "Seven", "Eight"], a: 2 },
      { q: "What is 9 + 10?", opts: ["19", "20", "21", "18"], a: 0 },
      { q: "Which animal says 'moo'?", opts: ["Dog", "Cat", "Cow", "Pig"], a: 2 },
      { q: "What is the capital of France?", opts: ["London", "Paris", "Rome", "Berlin"], a: 1 },
      { q: "How many legs does a spider have?", opts: ["Six", "Eight", "Ten", "Four"], a: 1 },
      { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Jupiter", "Mars", "Saturn"], a: 2 },
      { q: "What is H2O more commonly called?", opts: ["Salt", "Water", "Air", "Sugar"], a: 1 },
      { q: "How many sides does a triangle have?", opts: ["Two", "Three", "Four", "Five"], a: 1 },
      { q: "What is the largest ocean on Earth?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], a: 3 },
      { q: "Which season comes after summer?", opts: ["Spring", "Winter", "Autumn", "Summer"], a: 2 },
      { q: "What is 100 - 50?", opts: ["25", "50", "75", "100"], a: 1 },
      { q: "Which fruit is yellow and curved?", opts: ["Apple", "Banana", "Grape", "Orange"], a: 1 },
      { q: "How many minutes are in an hour?", opts: ["30", "60", "90", "100"], a: 1 },
      { q: "What do bees make?", opts: ["Milk", "Honey", "Silk", "Wool"], a: 1 }
    ],
    [
      { q: "What is the capital of Japan?", opts: ["Beijing", "Seoul", "Tokyo", "Bangkok"], a: 2 },
      { q: "Which gas do plants absorb from the air?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], a: 1 },
      { q: "What is 12 x 12?", opts: ["124", "132", "144", "156"], a: 2 },
      { q: "Who painted the Mona Lisa?", opts: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], a: 2 },
      { q: "What is the largest planet in our solar system?", opts: ["Earth", "Mars", "Jupiter", "Saturn"], a: 2 },
      { q: "How many continents are there?", opts: ["Five", "Six", "Seven", "Eight"], a: 2 },
      { q: "What is the chemical symbol for gold?", opts: ["Ag", "Au", "Gd", "Go"], a: 1 },
      { q: "Which country is home to the kangaroo?", opts: ["New Zealand", "Australia", "South Africa", "Brazil"], a: 1 },
      { q: "What is the square root of 64?", opts: ["6", "7", "8", "9"], a: 2 },
      { q: "In which year did humans first land on the Moon?", opts: ["1959", "1965", "1969", "1975"], a: 2 },
      { q: "What is the smallest prime number?", opts: ["0", "1", "2", "3"], a: 2 },
      { q: "What is the capital of Canada?", opts: ["Toronto", "Vancouver", "Ottawa", "Montreal"], a: 2 },
      { q: "How many bones are in the adult human body?", opts: ["106", "206", "306", "406"], a: 1 },
      { q: "Which element has the atomic number 1?", opts: ["Helium", "Hydrogen", "Oxygen", "Carbon"], a: 1 },
      { q: "Which of these is a primary colour?", opts: ["Green", "Orange", "Red", "Purple"], a: 2 }
    ],
    [
      { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Perth"], a: 2 },
      { q: "Which war ended in 1945?", opts: ["World War I", "World War II", "Cold War", "Korean War"], a: 1 },
      { q: "What is the approximate speed of light?", opts: ["300,000 km/s", "150,000 km/s", "30,000 km/s", "1,000,000 km/s"], a: 0 },
      { q: "Who developed the theory of relativity?", opts: ["Newton", "Einstein", "Bohr", "Heisenberg"], a: 1 },
      { q: "What is the currency of Switzerland?", opts: ["Euro", "Franc", "Krona", "Mark"], a: 1 },
      { q: "Which organelle is the powerhouse of the cell?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], a: 2 },
      { q: "What is 17 squared?", opts: ["269", "289", "309", "329"], a: 1 },
      { q: "What is the hardest natural substance?", opts: ["Quartz", "Diamond", "Titanium", "Obsidian"], a: 1 },
      { q: "In computing, what does 'HTTP' stand for?", opts: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transit Protocol", "Host Text Transfer Protocol"], a: 0 },
      { q: "What is the capital of Brazil?", opts: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], a: 2 },
      { q: "Which blood type is known as the universal donor?", opts: ["A", "B", "AB", "O negative"], a: 3 },
      { q: "In what year did the Berlin Wall fall?", opts: ["1987", "1989", "1991", "1993"], a: 1 },
      { q: "What is the approximate value of Pi to two decimals?", opts: ["3.12", "3.14", "3.16", "3.18"], a: 1 },
      { q: "Which planet has the most confirmed moons?", opts: ["Jupiter", "Saturn", "Uranus", "Neptune"], a: 1 },
      { q: "What is the longest river in the world (commonly cited)?", opts: ["Amazon", "Nile", "Yangtze", "Mississippi"], a: 1 }
    ],
    [
      { q: "What is the capital of Kazakhstan?", opts: ["Almaty", "Astana", "Tashkent", "Bishkek"], a: 1 },
      { q: "Which element has the chemical symbol 'W'?", opts: ["Tungsten", "Iron", "Lead", "Tin"], a: 0 },
      { q: "What is the smallest country in the world?", opts: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], a: 1 },
      { q: "Who wrote 'One Hundred Years of Solitude'?", opts: ["Jorge Luis Borges", "Gabriel García Márquez", "Pablo Neruda", "Isabel Allende"], a: 1 },
      { q: "What is the only mammal capable of true sustained flight?", opts: ["Flying squirrel", "Sugar glider", "Bat", "Colugo"], a: 2 },
      { q: "In which year was the first iPhone released?", opts: ["2005", "2007", "2009", "2010"], a: 1 },
      { q: "What is the most abundant gas in Earth's atmosphere?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], a: 2 },
      { q: "Which mathematician is known as the father of geometry?", opts: ["Pythagoras", "Euclid", "Archimedes", "Eratosthenes"], a: 1 },
      { q: "What is the capital of Mongolia?", opts: ["Ulaanbaatar", "Astana", "Tashkent", "Kathmandu"], a: 0 },
      { q: "How many hearts does an octopus have?", opts: ["One", "Two", "Three", "Four"], a: 2 },
      { q: "What is the chemical formula for table salt?", opts: ["NaCl", "KCl", "CaCO3", "H2SO4"], a: 0 },
      { q: "Which country has the most time zones (including territories)?", opts: ["Russia", "USA", "France", "China"], a: 2 },
      { q: "What is the largest desert in the world?", opts: ["Sahara", "Gobi", "Antarctic Desert", "Arabian"], a: 2 },
      { q: "Who was the first woman to win a Nobel Prize?", opts: ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Dorothy Hodgkin"], a: 0 },
      { q: "What is the approximate speed of sound in air?", opts: ["343 m/s", "150 m/s", "1000 m/s", "500 m/s"], a: 0 }
    ]
  ];
  var pool, qNum, score, streak, timeLeft, timer, nextTimer, current, locked, over, lastIdx, best;

  function cfg() { return DP.quiz[diff()]; }

  function reset() {
    pool = BANK[cfg().pool];
    qNum = 0;
    score = 0;
    streak = 0;
    over = false;
    locked = false;
    lastIdx = -1;
    if (timer) { clearInterval(timer); timer = null; }
    if (nextTimer) { clearTimeout(nextTimer); nextTimer = null; }
    $("qzScore").textContent = "0";
    best = lsGet("gb_quiz_best_" + diff(), 0);
    $("qzBest").textContent = best;
    hideBanner($("qzBanner"));
    nextQuestion();
  }

  function nextQuestion() {
    if (qNum >= 10) { finish(); return; }
    var idx;
    if (pool.length > 1) {
      do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastIdx);
    } else {
      idx = 0;
    }
    lastIdx = idx;
    current = pool[idx];
    qNum++;
    locked = false;
    $("qzQ").textContent = current.q;
    var cont = $("qzOpts");
    cont.innerHTML = "";
    for (var i = 0; i < current.opts.length; i++) {
      (function (i) {
        var btn = document.createElement("button");
        btn.className = "qz-opt";
        btn.textContent = current.opts[i];
        btn.addEventListener("click", function () { answer(i); });
        cont.appendChild(btn);
      })(i);
    }
    timeLeft = cfg().time;
    $("qzTime").textContent = Math.ceil(timeLeft);
    if (timer) { clearInterval(timer); }
    timer = setInterval(tick, 100);
  }

  function tick() {
    if (locked || over) return;
    timeLeft -= 0.1;
    $("qzTime").textContent = Math.max(0, Math.ceil(timeLeft));
    if (timeLeft <= 0) { timeout(); }
  }

  function timeout() {
    if (locked || over) return;
    locked = true;
    clearInterval(timer);
    streak = 0;
    var opts = $("qzOpts").children;
    for (var i = 0; i < opts.length; i++) {
      if (i === current.a) { opts[i].className = "qz-opt good"; }
      opts[i].disabled = true;
    }
    beep(200, 0.2);
    nextTimer = setTimeout(nextQuestion, 1000);
  }

  function answer(i) {
    if (locked || over) return;
    locked = true;
    clearInterval(timer);
    var correct = (i === current.a);
    var opts = $("qzOpts").children;
    if (correct) {
      streak++;
      var pts = 10 + (streak - 1) * 5;
      score += pts;
      beep(600, 0.08);
      opts[i].className = "qz-opt good";
    } else {
      streak = 0;
      beep(200, 0.2);
      opts[i].className = "qz-opt bad";
      opts[current.a].className = "qz-opt good";
    }
    for (var j = 0; j < opts.length; j++) { opts[j].disabled = true; }
    $("qzScore").textContent = score;
    nextTimer = setTimeout(nextQuestion, 1000);
  }

  function finish() {
    over = true;
    clearInterval(timer);
    clearTimeout(nextTimer);
    best = lsGet("gb_quiz_best_" + diff(), 0);
    if (score > best) {
      best = score;
      lsSet("gb_quiz_best_" + diff(), best);
    }
    $("qzBest").textContent = best;
    banner($("qzBanner"), "Round over! Score: <b>" + score + "</b> · Best: " + best);
    beep(700, 0.3);
  }

  $("qzNew").addEventListener("click", reset);
  stopFns.quiz = function () {
    if (timer) { clearInterval(timer); timer = null; }
    if (nextTimer) { clearTimeout(nextTimer); nextTimer = null; }
  };
  reset();
})();

/* ============ 50. BUBBLE SHOOTER ============ */
(function () {
  var W = 360, H = 360, COLS = 9, R = 20, ROW_H = R * 1.732, DEADLINE = H - 90;
  var PAL = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c"];
  var rows, topParity, numColors, current, next, flying, aim, shotsUntilDrop, score, best, running, raf, over;

  function cfg() { return DP.bubble[diff()]; }

  function rowLength(r) {
    var parity = (topParity + r) % 2;
    return parity === 0 ? COLS : COLS - 1;
  }

  function cellCenter(r, c) {
    var parity = (topParity + r) % 2;
    var x = (parity === 0 ? R : 2 * R) + c * 2 * R;
    var y = R + r * ROW_H;
    return { x: x, y: y };
  }

  function neighbors(r, c) {
    var list = [[r, c - 1], [r, c + 1]];
    if ((topParity + r) % 2 === 0) {
      list.push([r - 1, c - 1]);
      list.push([r - 1, c]);
      list.push([r + 1, c - 1]);
      list.push([r + 1, c]);
    } else {
      list.push([r - 1, c]);
      list.push([r - 1, c + 1]);
      list.push([r + 1, c]);
      list.push([r + 1, c + 1]);
    }
    return list;
  }

  function randomPresentColor() {
    var set = {};
    var r, c;
    for (r = 0; r < rows.length; r++) {
      for (c = 0; c < rows[r].length; c++) {
        if (rows[r][c] >= 0) { set[rows[r][c]] = true; }
      }
    }
    var keys = [];
    for (var k in set) { keys.push(parseInt(k, 10)); }
    if (keys.length === 0) {
      for (var i = 0; i < numColors; i++) { keys.push(i); }
    }
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function ensureRow(r) {
    while (rows.length <= r) {
      var len = rowLength(rows.length);
      var row = [];
      for (var i = 0; i < len; i++) { row.push(-1); }
      rows.push(row);
    }
  }

  function floodGroup(r, c, color) {
    var seen = {};
    var out = [];
    var stack = [[r, c]];
    seen[r + "," + c] = true;
    while (stack.length > 0) {
      var cell = stack.pop();
      var cr = cell[0], cc = cell[1];
      out.push(cell);
      var ns = neighbors(cr, cc);
      for (var i = 0; i < ns.length; i++) {
        var nr = ns[i][0], nc = ns[i][1];
        var key = nr + "," + nc;
        if (seen[key]) { continue; }
        if (nr < 0 || nr >= rows.length) { continue; }
        if (nc < 0 || nc >= rows[nr].length) { continue; }
        if (rows[nr][nc] !== color) { continue; }
        seen[key] = true;
        stack.push([nr, nc]);
      }
    }
    return out;
  }

  function connectedToTop() {
    var conn = {};
    var stack = [];
    var c, i;
    if (rows.length > 0) {
      for (c = 0; c < rows[0].length; c++) {
        if (rows[0][c] >= 0) {
          conn["0," + c] = true;
          stack.push([0, c]);
        }
      }
    }
    while (stack.length > 0) {
      var cell = stack.pop();
      var ns = neighbors(cell[0], cell[1]);
      for (i = 0; i < ns.length; i++) {
        var nr = ns[i][0], nc = ns[i][1];
        var key = nr + "," + nc;
        if (conn[key]) { continue; }
        if (nr < 0 || nr >= rows.length) { continue; }
        if (nc < 0 || nc >= rows[nr].length) { continue; }
        if (rows[nr][nc] < 0) { continue; }
        conn[key] = true;
        stack.push([nr, nc]);
      }
    }
    return conn;
  }

  function hitBubble(f) {
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        if (rows[r][c] < 0) { continue; }
        var ctr = cellCenter(r, c);
        var dx = ctr.x - f.x, dy = ctr.y - f.y;
        if (dx * dx + dy * dy < (2 * R - 2) * (2 * R - 2)) { return true; }
      }
    }
    return false;
  }

  function snap(f) {
    var candidates = [];
    var r, c, i, nr, nc, ctr, dx, dy, d;
    if (f.y <= R + 1) {
      for (c = 0; c < rowLength(0); c++) {
        if (rows.length === 0 || rows[0][c] < 0) { candidates.push([0, c]); }
      }
    } else {
      var bestD = Infinity, br = -1, bc = -1;
      for (r = 0; r < rows.length; r++) {
        for (c = 0; c < rows[r].length; c++) {
          if (rows[r][c] < 0) { continue; }
          ctr = cellCenter(r, c);
          dx = ctr.x - f.x; dy = ctr.y - f.y;
          d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; br = r; bc = c; }
        }
      }
      if (br >= 0) {
        var ns = neighbors(br, bc);
        for (i = 0; i < ns.length; i++) {
          nr = ns[i][0]; nc = ns[i][1];
          if (nr < 0 || nc < 0 || nr > rows.length) { continue; }
          if (nr === rows.length) {
            if (nc < rowLength(nr)) { candidates.push([nr, nc]); }
          } else if (nc < rows[nr].length && rows[nr][nc] < 0) {
            candidates.push([nr, nc]);
          }
        }
      }
    }
    if (candidates.length === 0) {
      for (r = 0; r < rows.length; r++) {
        for (c = 0; c < rows[r].length; c++) {
          if (rows[r][c] >= 0) { continue; }
          if (r === 0) { candidates.push([r, c]); continue; }
          var ns2 = neighbors(r, c);
          for (i = 0; i < ns2.length; i++) {
            nr = ns2[i][0]; nc = ns2[i][1];
            if (nr >= 0 && nr < rows.length && nc >= 0 && nc < rows[nr].length && rows[nr][nc] >= 0) {
              candidates.push([r, c]);
              break;
            }
          }
        }
      }
    }
    if (candidates.length === 0) { return null; }
    var bestC = null, bestCD = Infinity;
    for (i = 0; i < candidates.length; i++) {
      ctr = cellCenter(candidates[i][0], candidates[i][1]);
      dx = ctr.x - f.x; dy = ctr.y - f.y;
      d = dx * dx + dy * dy;
      if (d < bestCD) { bestCD = d; bestC = candidates[i]; }
    }
    return bestC;
  }

  function descend() {
    topParity = (topParity + 1) % 2;
    var len = rowLength(0);
    var newRow = [];
    for (var i = 0; i < len; i++) { newRow.push(Math.floor(Math.random() * numColors)); }
    rows.unshift(newRow);
  }

  function fire() {
    if (flying || over || !running) { return; }
    var spd = 12;
    flying = { x: W / 2, y: H - 40, vx: Math.cos(aim) * spd, vy: Math.sin(aim) * spd, color: current };
    current = next;
    next = randomPresentColor();
    beep(500, 0.04);
  }

  function updateFlying() {
    if (!flying) { return; }
    flying.x += flying.vx;
    flying.y += flying.vy;
    if (flying.x < R) { flying.x = R; flying.vx = Math.abs(flying.vx); }
    if (flying.x > W - R) { flying.x = W - R; flying.vx = -Math.abs(flying.vx); }
    if (flying.y <= R || hitBubble(flying)) {
      var cell = snap(flying);
      if (cell) {
        ensureRow(cell[0]);
        rows[cell[0]][cell[1]] = flying.color;
        resolve(cell[0], cell[1]);
      }
      flying = null;
      shotsUntilDrop--;
      if (shotsUntilDrop <= 0) {
        descend();
        shotsUntilDrop = 5;
      }
      checkLose();
    }
  }

  function resolve(r, c) {
    var color = rows[r][c];
    var group = floodGroup(r, c, color);
    if (group.length >= 3) {
      for (var i = 0; i < group.length; i++) {
        rows[group[i][0]][group[i][1]] = -1;
      }
      score += group.length * 10;
      beep(600, 0.1);
      var conn = connectedToTop();
      var dropped = 0;
      for (var rr = 0; rr < rows.length; rr++) {
        for (var cc = 0; cc < rows[rr].length; cc++) {
          if (rows[rr][cc] < 0) { continue; }
          if (!conn[rr + "," + cc]) {
            rows[rr][cc] = -1;
            dropped++;
          }
        }
      }
      if (dropped > 0) {
        score += dropped * 20;
        beep(700, 0.15);
      }
      $("bbScore").textContent = score;
    }
  }

  function checkLose() {
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        if (rows[r][c] < 0) { continue; }
        if (cellCenter(r, c).y >= DEADLINE) { gameOver(); return; }
      }
    }
  }

  function gameOver() {
    running = false;
    over = true;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    best = lsGet("gb_bubble_best_" + diff(), 0);
    if (score > best) {
      best = score;
      lsSet("gb_bubble_best_" + diff(), best);
    }
    $("bbBest").textContent = best;
    banner($("bbBanner"), "Game over! Score: <b>" + score + "</b>");
    beep(180, 0.3);
    draw();
  }

  function draw() {
    var cv = $("bbCanvas");
    var ctx = cv.getContext("2d");
    ctx.fillStyle = "#0b0f13";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#f87171";
    if (ctx.setLineDash) { ctx.setLineDash([6, 6]); }
    ctx.beginPath();
    ctx.moveTo(0, DEADLINE);
    ctx.lineTo(W, DEADLINE);
    ctx.stroke();
    if (ctx.setLineDash) { ctx.setLineDash([]); }
    var r, c, ctr;
    for (r = 0; r < rows.length; r++) {
      for (c = 0; c < rows[r].length; c++) {
        if (rows[r][c] < 0) { continue; }
        ctr = cellCenter(r, c);
        ctx.fillStyle = PAL[rows[r][c]];
        ctx.beginPath();
        ctx.arc(ctr.x, ctr.y, R, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = PAL[current];
    ctx.beginPath();
    ctx.arc(W / 2, H - 40, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAL[next];
    ctx.beginPath();
    ctx.arc(W / 2 + 40, H - 40, R * 0.6, 0, Math.PI * 2);
    ctx.fill();
    var dx = Math.cos(aim), dy = Math.sin(aim);
    var px = W / 2, py = H - 40;
    var vx = dx, vy = dy;
    ctx.fillStyle = "#8a97a5";
    for (var s = 0; s < 150; s += 10) {
      px += vx * 10;
      py += vy * 10;
      if (px < R) { px = R; vx = Math.abs(vx); }
      if (px > W - R) { px = W - R; vx = -Math.abs(vx); }
      if (py < R) { break; }
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    if (flying) {
      ctx.fillStyle = PAL[flying.color];
      ctx.beginPath();
      ctx.arc(flying.x, flying.y, R, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!running) {
      ctx.fillStyle = "#8a97a5";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Tap Start to play", W / 2, H / 2);
    }
  }

  function step() {
    if (!running) { raf = null; return; }
    updateFlying();
    draw();
    raf = requestAnimationFrame(step);
  }

  function start() {
    reset();
    running = true;
    if (!raf) { raf = requestAnimationFrame(step); }
  }

  function reset() {
    numColors = (diff() === "easy" || diff() === "medium") ? 4 : 5;
    topParity = 0;
    rows = [];
    for (var r = 0; r < cfg().rows; r++) {
      var len = rowLength(r);
      var row = [];
      for (var c = 0; c < len; c++) {
        row.push(Math.floor(Math.random() * numColors));
      }
      rows.push(row);
    }
    shotsUntilDrop = 5;
    score = 0;
    over = false;
    running = false;
    flying = null;
    aim = -Math.PI / 2;
    current = randomPresentColor();
    next = randomPresentColor();
    $("bbScore").textContent = "0";
    best = lsGet("gb_bubble_best_" + diff(), 0);
    $("bbBest").textContent = best;
    hideBanner($("bbBanner"));
    draw();
  }

  function onPointer(ev) {
    var cv = $("bbCanvas");
    var rect = cv.getBoundingClientRect();
    var px, py;
    if (ev.touches && ev.touches.length > 0) {
      px = ev.touches[0].clientX;
      py = ev.touches[0].clientY;
    } else {
      px = ev.clientX;
      py = ev.clientY;
    }
    var x = (px - rect.left) * (W / rect.width);
    var y = (py - rect.top) * (H / rect.height);
    var dx = x - W / 2, dy = y - (H - 40);
    aim = Math.atan2(dy, dx);
    if (aim > -0.35) { aim = -0.35; }
    if (aim < -Math.PI + 0.35) { aim = -Math.PI + 0.35; }
    fire();
  }

  $("bbCanvas").addEventListener("mousedown", onPointer);
  $("bbCanvas").addEventListener("touchstart", function (ev) {
    ev.preventDefault();
    onPointer(ev);
  }, { passive: false });
  $("bbStart").addEventListener("click", start);
  stopFns.bubble = function () {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  };
  reset();
})();

  /* ============ 51. TOWER DEFENSE ============ */
  (function () {
    var W = 360, CELL = 36, GRID = 10;
    var canvas = $("tdCanvas"), ctx = canvas.getContext("2d");
    var TYPES = {
      gun:    { name: "Gun",    cost: 100, dmg: 12, range: 2.2, rate: 0.35, color: "#38bdf8", splash: 0 },
      cannon: { name: "Cannon", cost: 200, dmg: 30, range: 2.6, rate: 0.9,  color: "#fbbf24", splash: 0.9 },
      frost:  { name: "Frost",  cost: 150, dmg: 6,  range: 2.4, rate: 0.5,  color: "#22d3ee", splash: 0 }
    };
    var ECOL = { grunt: "#f87171", runner: "#fbbf24", tank: "#a78bfa" };
    var segs, totalLen, pathSet;
    var enemies, towers, beams, wave, toSpawn, spawnT, waveRunning;
    var gold, lives, kills, over, paused, running, raf = null, lastT = 0;
    var selType = "gun", sellMode = false;

    function cfg() { return DP.towerdef[diff()]; }

    function buildPath() {
      var pts = [[-1, 5], [4, 5], [4, 1], [8, 1], [8, 8], [1, 8], [1, 2], [6, 2], [6, 5], [10, 5]];
      segs = []; totalLen = 0; pathSet = {};
      var i, c, r, a, b, x1, y1, x2, y2, len;
      for (i = 0; i < pts.length - 1; i++) {
        a = pts[i]; b = pts[i + 1];
        x1 = (a[0] + 0.5) * CELL; y1 = (a[1] + 0.5) * CELL;
        x2 = (b[0] + 0.5) * CELL; y2 = (b[1] + 0.5) * CELL;
        len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        segs.push({ x1: x1, y1: y1, x2: x2, y2: y2, len: len, start: totalLen });
        totalLen += len;
        for (c = Math.min(a[0], b[0]); c <= Math.max(a[0], b[0]); c++) {
          for (r = Math.min(a[1], b[1]); r <= Math.max(a[1], b[1]); r++) {
            if (c >= 0 && c < GRID && r >= 0 && r < GRID) pathSet[c + "," + r] = 1;
          }
        }
      }
    }

    function posAt(d) {
      if (d < 0) d = 0;
      if (d > totalLen) d = totalLen;
      var s = segs[0], i;
      for (i = 0; i < segs.length; i++) {
        if (d <= segs[i].start + segs[i].len) { s = segs[i]; break; }
      }
      var t = (s.len === 0) ? 0 : (d - s.start) / s.len;
      return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t };
    }

    function startWave() {
      if (over || waveRunning) return;
      wave++;
      toSpawn = 6 + 2 * wave;
      spawnT = 0.4;
      waveRunning = true;
      paused = false;
      beep(620, 0.08);
      updateBtns();
      updateHud();
      if (!running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(step);
      }
    }

    function spawnEnemy() {
      var n = wave;
      var hpMult = 1 + 0.35 * (n - 1) + 0.02 * (n - 1) * (n - 1);
      var type = "grunt", speed = 1.4, hp = 40, reward = 8;
      var r = Math.random();
      if (n >= 5 && r < 0.15) { type = "tank"; hp = 140; speed = 0.9; reward = 30; }
      else if (n >= 3 && r < 0.4) { type = "runner"; hp = 24; speed = 2.6; reward = 12; }
      hp = Math.max(1, Math.round(hp * hpMult));
      enemies.push({ dist: 0, hp: hp, maxhp: hp, speed: speed, reward: reward, type: type, dead: false, slowT: 0 });
    }

    function spawnUpdate(dt) {
      if (!waveRunning || over) return;
      spawnT -= dt;
      var interval = Math.max(0.4, 0.8 - wave * 0.02);
      while (toSpawn > 0 && spawnT <= 0) {
        spawnEnemy();
        toSpawn--;
        spawnT += interval;
      }
    }

    function enemyUpdate(dt) {
      var i, e;
      for (i = 0; i < enemies.length; i++) {
        e = enemies[i];
        if (e.dead) continue;
        if (e.slowT > 0) e.slowT -= dt;
        var spd = e.speed * (e.slowT > 0 ? 0.6 : 1);
        e.dist += spd * CELL * dt;
        if (e.dist >= totalLen) {
          e.dead = true;
          lives--;
          beep(180, 0.15);
          updateHud();
          if (lives <= 0) { gameOver(false); return; }
        }
      }
    }

    function towerStats(t) {
      var base = TYPES[t.type];
      return {
        dmg: base.dmg * Math.pow(1.5, t.level - 1),
        range: (base.range + 0.3 * (t.level - 1)) * CELL,
        rate: base.rate * Math.pow(0.85, t.level - 1),
        color: base.color,
        splash: base.splash
      };
    }

    function hurtEnemy(e, dmg) {
      e.hp -= dmg;
      if (e.hp <= 0 && !e.dead) {
        e.dead = true;
        kills++;
        gold += e.reward;
        beep(880, 0.05);
        updateHud();
      }
    }

    function towerUpdate(dt) {
      var i, j, t, e, best, bd, p, st, cx, cy, dx, dy, d, q;
      for (i = 0; i < towers.length; i++) {
        t = towers[i];
        t.cd -= dt;
        if (t.cd > 0) continue;
        st = towerStats(t);
        cx = (t.c + 0.5) * CELL; cy = (t.r + 0.5) * CELL;
        best = null; bd = -1;
        for (j = 0; j < enemies.length; j++) {
          e = enemies[j];
          if (e.dead) continue;
          p = posAt(e.dist);
          dx = p.x - cx; dy = p.y - cy;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d <= st.range && e.dist > bd) { bd = e.dist; best = e; }
        }
        if (!best) continue;
        t.cd = st.rate;
        p = posAt(best.dist);
        beams.push({ x1: cx, y1: cy, x2: p.x, y2: p.y, life: 0.22, color: st.color });
        if (st.splash > 0) {
          var sr = st.splash * CELL;
          for (j = 0; j < enemies.length; j++) {
            e = enemies[j];
            if (e.dead) continue;
            q = posAt(e.dist);
            dx = q.x - p.x; dy = q.y - p.y;
            if (Math.sqrt(dx * dx + dy * dy) <= sr) hurtEnemy(e, st.dmg);
          }
        } else if (t.type === "frost") {
          best.slowT = 1.2;
          hurtEnemy(best, st.dmg);
        } else {
          hurtEnemy(best, st.dmg);
        }
      }
    }

    function waveCleared() {
      waveRunning = false;
      gold += 50 + 10 * wave;
      beep(980, 0.1);
      updateHud();
      if (wave >= 15) { gameOver(true); return; }
      updateBtns();
    }

    function gameOver(win) {
      over = true;
      waveRunning = false;
      paused = false;
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (win) {
        banner($("tdBanner"), "Wave 15 cleared &#8212; <b>you win!</b>");
        beep(1046, 0.3);
      } else {
        banner($("tdBanner"), "The base has fallen &#8212; <b>you lost.</b>");
        beep(120, 0.4);
      }
      updateBtns();
      draw();
    }

    function updateHud() {
      $("tdGold").textContent = gold;
      $("tdLives").textContent = lives;
      $("tdWave").textContent = wave + "/15";
    }

    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    function updateBtns() {
      var nw = $("tdNext");
      if (over) { nw.textContent = "Game Over"; nw.disabled = true; }
      else if (waveRunning) { nw.textContent = "Fighting..."; nw.disabled = true; }
      else if (paused) { nw.textContent = "Resume"; nw.disabled = false; }
      else { nw.textContent = "Next Wave"; nw.disabled = false; }
      var list = ["gun", "cannon", "frost"], k, t;
      for (k = 0; k < list.length; k++) {
        t = list[k];
        $("td" + cap(t)).textContent = TYPES[t].name + " " + TYPES[t].cost;
        $("td" + cap(t)).classList.toggle("sel", !sellMode && selType === t);
      }
      $("tdSell").textContent = sellMode ? "Sell: ON" : "Sell";
      $("tdSell").classList.toggle("sel", sellMode);
    }

    function clickCell(c, r) {
      var key = c + "," + r;
      var i, tower = null;
      for (i = 0; i < towers.length; i++) {
        if (towers[i].c === c && towers[i].r === r) { tower = towers[i]; break; }
      }
      if (sellMode && tower) {
        gold += Math.floor(tower.invested * 0.7);
        towers.splice(i, 1);
        beep(300, 0.08);
        updateHud();
        draw();
        return;
      }
      if (tower) {
        if (tower.level >= 3) { beep(140, 0.1); return; }
        var uc = Math.floor(TYPES[tower.type].cost * 0.75 * tower.level);
        if (gold >= uc) {
          gold -= uc;
          tower.invested += uc;
          tower.level++;
          beep(700, 0.07);
        } else {
          beep(140, 0.1);
        }
        updateHud();
        draw();
        return;
      }
      if (pathSet[key]) return;
      var st = TYPES[selType];
      if (gold < st.cost) { beep(140, 0.1); return; }
      gold -= st.cost;
      towers.push({ c: c, r: r, type: selType, level: 1, cd: 0, invested: st.cost });
      beep(520, 0.06);
      updateHud();
      draw();
    }

    function onPointer(ev) {
      if (over) return;
      var rect = canvas.getBoundingClientRect();
      var px, py;
      if (ev.touches && ev.touches.length > 0) { px = ev.touches[0].clientX; py = ev.touches[0].clientY; }
      else { px = ev.clientX; py = ev.clientY; }
      var x = (px - rect.left) * (W / rect.width);
      var y = (py - rect.top) * (W / rect.height);
      var c = Math.floor(x / CELL), r = Math.floor(y / CELL);
      if (c < 0 || c >= GRID || r < 0 || r >= GRID) return;
      clickCell(c, r);
    }

    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, W);
      var i, j, c, r, t, cx, cy, p, e, b;
      for (r = 0; r < GRID; r++) {
        for (c = 0; c < GRID; c++) {
          if (pathSet[c + "," + r]) {
            ctx.fillStyle = "#2a2415";
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          }
        }
      }
      ctx.strokeStyle = "#1d2530";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (i = 1; i < GRID; i++) {
        ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, W);
        ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL);
      }
      ctx.stroke();
      if (!sellMode) {
        for (r = 0; r < GRID; r++) {
          for (c = 0; c < GRID; c++) {
            if (pathSet[c + "," + r]) continue;
            var has = false;
            for (j = 0; j < towers.length; j++) {
              if (towers[j].c === c && towers[j].r === r) { has = true; break; }
            }
            if (has) continue;
            ctx.fillStyle = "rgba(56,189,248,0.07)";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          }
        }
      }
      for (i = 0; i < towers.length; i++) {
        t = towers[i];
        cx = (t.c + 0.5) * CELL; cy = (t.r + 0.5) * CELL;
        ctx.fillStyle = TYPES[t.type].color;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e8edf2";
        for (j = 0; j < t.level; j++) {
          ctx.fillRect(cx + (j - (t.level - 1) / 2) * 8 - 1, cy + 12, 2, 2);
        }
      }
      for (i = 0; i < enemies.length; i++) {
        e = enemies[i];
        if (e.dead) continue;
        p = posAt(e.dist);
        ctx.fillStyle = ECOL[e.type];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#5c1f1f";
        ctx.fillRect(p.x - 9, p.y - 16, 18, 3);
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(p.x - 9, p.y - 16, 18 * (e.hp / e.maxhp), 3);
      }
      for (i = 0; i < beams.length; i++) {
        b = beams[i];
        ctx.globalAlpha = Math.min(1, b.life / 0.1);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (wave === 0 && !waveRunning && !over) {
        ctx.fillStyle = "#8a97a5";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap Next Wave to start", W / 2, W / 2);
      }
    }

    function step() {
      if (!running) { raf = null; return; }
      var now = performance.now();
      var dt = Math.min(100, now - lastT) / 1000;
      lastT = now;
      spawnUpdate(dt);
      enemyUpdate(dt);
      towerUpdate(dt);
      var i;
      for (i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) enemies.splice(i, 1);
      }
      for (i = beams.length - 1; i >= 0; i--) {
        beams[i].life -= dt;
        if (beams[i].life <= 0) beams.splice(i, 1);
      }
      if (waveRunning && !over && toSpawn <= 0 && enemies.length === 0) waveCleared();
      draw();
      if (running) raf = requestAnimationFrame(step);
    }

    function reset() {
      buildPath();
      enemies = []; towers = []; beams = [];
      wave = 0; toSpawn = 0; spawnT = 0; waveRunning = false;
      gold = cfg().gold; lives = cfg().lives;
      kills = 0; over = false; paused = false; running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      hideBanner($("tdBanner"));
      updateHud();
      updateBtns();
      draw();
    }

    canvas.addEventListener("mousedown", onPointer);
    canvas.addEventListener("touchstart", function (ev) {
      ev.preventDefault();
      onPointer(ev);
    }, { passive: false });
    $("tdGun").addEventListener("click", function () { selType = "gun"; sellMode = false; updateBtns(); draw(); });
    $("tdCannon").addEventListener("click", function () { selType = "cannon"; sellMode = false; updateBtns(); draw(); });
    $("tdFrost").addEventListener("click", function () { selType = "frost"; sellMode = false; updateBtns(); draw(); });
    $("tdSell").addEventListener("click", function () { sellMode = !sellMode; updateBtns(); draw(); });
    $("tdNext").addEventListener("click", function () {
      if (over || waveRunning) return;
      if (paused) {
        paused = false;
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(step);
        updateBtns();
        return;
      }
      startWave();
    });
    $("tdNew").addEventListener("click", reset);
    stopFns.towerdef = function () {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (waveRunning && !over) paused = true;
      updateBtns();
    };
    reset();
  })();

  /* ============ 52. DOOM ============ */
  (function () {
    var W = 360, H = 240, COLS = 180, CW = 2;
    var SIZE = 21, FOV = 66;
    var canvas = $("dmCanvas"), ctx = canvas.getContext("2d");
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    var map, player, demons, packs, zbuf;
    var keys = {}, hurtT = 0, muzzleT = 0, fireCd = 0;
    var hp = 100, total = 0, kills = 0, dead = false, won = false;
    var running = false, raf = null, lastT = 0;
    var drag = null;

    function cfg() { return DP.doom[diff()]; }

    function genMap() {
      map = [];
      for (var r = 0; r < SIZE; r++) {
        var row = [];
        for (var c = 0; c < SIZE; c++) {
          row.push(r === 0 || r === SIZE - 1 || c === 0 || c === SIZE - 1 ? 1 : 0);
        }
        map.push(row);
      }
      var x = 10, y = 10, open = 1;
      map[10][10] = 0;
      var target = Math.floor(19 * 19 * 0.45);
      var guard = 0, nx, ny;
      while (open < target && guard < 100000) {
        guard++;
        var d = DIRS[Math.floor(Math.random() * 4)];
        nx = x + d[0]; ny = y + d[1];
        if (nx < 1 || nx > SIZE - 2 || ny < 1 || ny > SIZE - 2) continue;
        x = nx; y = ny;
        if (map[y][x] === 0) continue;
        map[y][x] = 0;
        open++;
      }
    }

    function openCells() {
      var list = [], r, c;
      for (r = 0; r < SIZE; r++) {
        for (c = 0; c < SIZE; c++) {
          if (map[r][c] === 0) list.push({ x: c + 0.5, y: r + 0.5 });
        }
      }
      return list;
    }

    function blockedAt(x, y) {
      var tx = Math.floor(x), ty = Math.floor(y);
      if (tx < 0 || tx >= SIZE || ty < 0 || ty >= SIZE) return true;
      return map[ty][tx] === 1;
    }

    function blockedRadius(x, y) {
      var r = 0.22;
      return blockedAt(x - r, y - r) || blockedAt(x + r, y - r) || blockedAt(x - r, y + r) || blockedAt(x + r, y + r);
    }

    function moveEntity(e, dx, dy) {
      if (!blockedRadius(e.x + dx, e.y)) e.x += dx;
      if (!blockedRadius(e.x, e.y + dy)) e.y += dy;
    }

    function hasLOS(x1, y1, x2, y2) {
      var dx = x2 - x1, dy = y2 - y1;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var steps = Math.ceil(dist / 0.1);
      for (var i = 1; i < steps; i++) {
        if (blockedAt(x1 + dx * i / steps, y1 + dy * i / steps)) return false;
      }
      return true;
    }

    function castRay(px, py, dx, dy) {
      var mapX = Math.floor(px), mapY = Math.floor(py);
      var deltaX = Math.abs(1 / dx), deltaY = Math.abs(1 / dy);
      var stepX, stepY, sideX, sideY;
      var side = 0;
      if (dx < 0) { stepX = -1; sideX = (px - mapX) * deltaX; }
      else { stepX = 1; sideX = (mapX + 1 - px) * deltaX; }
      if (dy < 0) { stepY = -1; sideY = (py - mapY) * deltaY; }
      else { stepY = 1; sideY = (mapY + 1 - py) * deltaY; }
      var guard = 0;
      while (guard++ < 64) {
        if (sideX < sideY) { sideX += deltaX; mapX += stepX; side = 0; }
        else { sideY += deltaY; mapY += stepY; side = 1; }
        if (mapX < 0 || mapX >= SIZE || mapY < 0 || mapY >= SIZE) break;
        if (map[mapY][mapX] === 1) break;
      }
      var perp = (side === 0) ? sideX - deltaX : sideY - deltaY;
      return { dist: perp, side: side };
    }

    function pickOpen(minD) {
      var list = openCells();
      var i, c, dx, dy;
      for (i = 0; i < 200; i++) {
        c = list[Math.floor(Math.random() * list.length)];
        dx = c.x - player.x; dy = c.y - player.y;
        if (dx * dx + dy * dy >= minD * minD) return c;
      }
      return list[Math.floor(Math.random() * list.length)];
    }

    function updateHud() {
      $("dmHp").textContent = Math.max(0, hp);
      $("dmDems").textContent = total - kills;
    }

    function startGame() {
      genMap();
      var c = cfg();
      player = { x: 10.5, y: 10.5, angle: 0 };
      demons = []; packs = [];
      total = c.dems; kills = 0;
      hp = 100; dead = false; won = false;
      hurtT = 0; muzzleT = 0; fireCd = 0;
      var i, p;
      for (i = 0; i < total; i++) {
        p = pickOpen(6);
        demons.push({ x: p.x, y: p.y, hp: c.hp, dmg: c.dmg, spd: c.spd, atkT: Math.random() });
      }
      for (i = 0; i < 4; i++) {
        p = pickOpen(4);
        packs.push({ x: p.x, y: p.y });
      }
      hideBanner($("dmBanner"));
      updateHud();
    }

    function fire() {
      if (dead || won) return;
      if (fireCd > 0) return;
      fireCd = 0.25;
      muzzleT = 0.1;
      var dx = Math.cos(player.angle), dy = Math.sin(player.angle);
      var wallDist = castRay(player.x, player.y, dx, dy).dist;
      var best = null, bestAlong = wallDist;
      var i, d, rx, ry, along, perp;
      for (i = 0; i < demons.length; i++) {
        d = demons[i];
        if (d.hp <= 0) continue;
        rx = d.x - player.x; ry = d.y - player.y;
        along = rx * dx + ry * dy;
        perp = Math.abs(rx * dy - ry * dx);
        if (along > 0 && along < wallDist && perp < 0.45 && along < bestAlong) {
          best = d; bestAlong = along;
        }
      }
      if (best) {
        best.hp -= 34;
        if (best.hp <= 0) {
          kills++;
          beep(880, 0.05);
          updateHud();
          if (kills >= total) win();
        }
      }
      beep(200, 0.05);
    }

    function hurt(dmg) {
      if (dead || won) return;
      hp -= dmg;
      hurtT = 0.4;
      beep(110, 0.1);
      updateHud();
      if (hp <= 0) die();
    }

    function win() {
      won = true;
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      banner($("dmBanner"), "Sector cleared! <b>&#8212; all demons slain.</b>");
      $("dmStart").textContent = "New Sector";
      beep(1046, 0.3);
      draw();
    }

    function die() {
      dead = true;
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      banner($("dmBanner"), "You died. <b>Click Start for a new sector.</b>");
      $("dmStart").textContent = "New Sector";
      beep(120, 0.4);
      draw();
    }

    function update(dt) {
      var mv = 0, turn = 0, i, d;
      if (keys["ArrowUp"] || keys["KeyW"] || keys["w"]) mv += 1;
      if (keys["ArrowDown"] || keys["KeyS"] || keys["s"]) mv -= 1;
      if (keys["ArrowLeft"] || keys["KeyA"] || keys["a"]) turn -= 1;
      if (keys["ArrowRight"] || keys["KeyD"] || keys["d"]) turn += 1;
      player.angle += turn * 2.6 * dt;
      if (mv !== 0) {
        var spd = 2.6 * dt * mv;
        moveEntity(player, Math.cos(player.angle) * spd, Math.sin(player.angle) * spd);
      }
      if ((keys[" "] || keys["Space"]) && !dead && !won) fire();
      fireCd -= dt;
      muzzleT -= dt;
      hurtT -= dt;
      for (i = 0; i < demons.length; i++) {
        d = demons[i];
        if (d.hp <= 0) continue;
        var dx = player.x - d.x, dy = player.y - d.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        d.atkT -= dt;
        if (d.atkT <= 0 && !dead) {
          if (dist < 1.1) { d.atkT = 0.7; hurt(cfg().dmg); }
          else if (dist < 4.5 && hasLOS(d.x, d.y, player.x, player.y)) { d.atkT = 0.9; hurt(cfg().dmg); }
          else { d.atkT = 0.1; }
        }
        if (dist < 8 && dist > 0.9 && hasLOS(d.x, d.y, player.x, player.y)) {
          var sx = (dx / dist) * d.spd * dt, sy = (dy / dist) * d.spd * dt;
          moveEntity(d, sx, sy);
        }
      }
      for (i = packs.length - 1; i >= 0; i--) {
        var pk = packs[i];
        var pdx = pk.x - player.x, pdy = pk.y - player.y;
        if (pdx * pdx + pdy * pdy < 0.25 && !dead) {
          hp = Math.min(100, hp + 25);
          packs.splice(i, 1);
          beep(1000, 0.06);
          updateHud();
        }
      }
    }

    function project(wx, wy, dirX, dirY, planeX, planeY) {
      var dx = wx - player.x, dy = wy - player.y;
      var invDet = 1 / (planeX * dirY - dirX * planeY);
      var tX = invDet * (dirY * dx - dirX * dy);
      var tY = invDet * (-planeY * dx + planeX * dy);
      return { sx: W / 2 * (1 + tX / tY), d: tY };
    }

    function drawDemonColumn(x, top, h, u) {
      ctx.fillStyle = "#c2410c";
      ctx.fillRect(x, top + h * 0.3, CW, h * 0.7);
      ctx.fillStyle = "#7c2d12";
      ctx.fillRect(x, top, CW, h * 0.3);
      if ((u > 0.33 && u < 0.41) || (u > 0.59 && u < 0.67)) {
        ctx.fillStyle = "#fde047";
        ctx.fillRect(x, top + h * 0.12, CW, h * 0.09);
      }
    }

    function drawSprite(s) {
      var p = s.pr;
      if (p.d <= 0.05) return;
      var h = (s.demon ? 0.7 : 0.3) * H / p.d;
      var w = h * 0.55;
      var left = p.sx - w / 2, top = (H - h) / 2;
      if (p.sx + w / 2 < 0 || p.sx - w / 2 > W) return;
      var st;
      for (st = Math.max(0, Math.floor(left)); st < Math.min(W, p.sx + w / 2); st += CW) {
        var col = Math.floor(st / CW);
        if (col < 0 || col >= COLS) continue;
        if (p.d >= zbuf[col]) continue;
        if (s.demon) drawDemonColumn(st, top, h, (st - left) / w);
        else {
          ctx.fillStyle = "#4ade80";
          ctx.fillRect(st, top + h * 0.2, CW, h * 0.6);
        }
      }
    }

    function draw() {
      var i, c;
      var dirX = Math.cos(player.angle), dirY = Math.sin(player.angle);
      var T = Math.tan(FOV / 2 * Math.PI / 180);
      var planeX = -dirY * T, planeY = dirX * T;
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H / 2);
      ctx.fillStyle = "#1a1f27";
      ctx.fillRect(0, H / 2, W, H / 2);
      zbuf = [];
      for (c = 0; c < COLS; c++) {
        var camX = 2 * c / COLS - 1;
        var rdX = dirX + planeX * camX, rdY = dirY + planeY * camX;
        var hit = castRay(player.x, player.y, rdX, rdY);
        var d = Math.max(0.01, hit.dist);
        var lineH = H / d;
        var top = (H - lineH) / 2;
        var br = (hit.side ? 0.8 : 1) * Math.max(0.22, 1 - d / 14);
        ctx.fillStyle = "rgb(" + Math.floor(96 * br) + "," + Math.floor(100 * br) + "," + Math.floor(112 * br) + ")";
        ctx.fillRect(c * CW, top, CW, lineH);
        zbuf.push(d);
      }
      var sprites = [];
      var p;
      for (i = 0; i < demons.length; i++) {
        if (demons[i].hp <= 0) continue;
        p = project(demons[i].x, demons[i].y, dirX, dirY, planeX, planeY);
        sprites.push({ pr: p, demon: true });
      }
      for (i = 0; i < packs.length; i++) {
        p = project(packs[i].x, packs[i].y, dirX, dirY, planeX, planeY);
        sprites.push({ pr: p, demon: false });
      }
      sprites.sort(function (a, b) { return b.pr.d - a.pr.d; });
      for (i = 0; i < sprites.length; i++) drawSprite(sprites[i]);
      ctx.strokeStyle = "#e8edf2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 6, H / 2); ctx.lineTo(W / 2 - 2, H / 2);
      ctx.moveTo(W / 2 + 2, H / 2); ctx.lineTo(W / 2 + 6, H / 2);
      ctx.moveTo(W / 2, H / 2 - 6); ctx.lineTo(W / 2, H / 2 - 2);
      ctx.moveTo(W / 2, H / 2 + 2); ctx.lineTo(W / 2, H / 2 + 6);
      ctx.stroke();
      if (muzzleT > 0) {
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var m = 0; m < 6; m++) {
          var ma = m * 1.05;
          var ml = 10 + 6 * ((m * 7) % 3);
          ctx.moveTo(W / 2, H / 2);
          ctx.lineTo(W / 2 + Math.cos(ma) * ml, H / 2 + Math.sin(ma) * ml);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      if (hurtT > 0) {
        ctx.fillStyle = "rgba(248,113,113," + (hurtT / 0.4 * 0.45) + ")";
        ctx.fillRect(0, 0, W, H);
      }
      if (dead) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f87171";
        ctx.font = "28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("You died", W / 2, H / 2);
      } else if (won) {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Sector cleared!", W / 2, H / 2);
      }
    }

    function step() {
      if (!running) { raf = null; return; }
      var now = performance.now();
      var dt = Math.min(100, now - lastT) / 1000;
      lastT = now;
      update(dt);
      draw();
      if (running) raf = requestAnimationFrame(step);
    }

    function start() {
      startGame();
      $("dmStart").textContent = "New Sector";
      running = true;
      lastT = performance.now();
      if (!raf) raf = requestAnimationFrame(step);
    }

    function padHold(btn, key) {
      btn.addEventListener("pointerdown", function (e) { e.preventDefault(); keys[key] = true; });
      btn.addEventListener("pointerup", function () { keys[key] = false; });
      btn.addEventListener("pointerleave", function () { keys[key] = false; });
    }

    document.addEventListener("keydown", function (e) {
      keys[e.key] = true;
      keys[e.code] = true;
      if (current !== "doom") return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") e.preventDefault();
      if (e.key === " " || e.key === "Enter") { if (!e.repeat) fire(); }
    });
    document.addEventListener("keyup", function (e) {
      keys[e.key] = false;
      keys[e.code] = false;
    });
    padHold($("dmFwd"), "KeyW");
    padHold($("dmBack"), "KeyS");
    padHold($("dmTurnL"), "KeyA");
    padHold($("dmTurnR"), "KeyD");
    padHold($("dmFire"), " ");
    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      drag = { lx: e.clientX, ly: e.clientY, dist: 0 };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag || current !== "doom") return;
      var dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
      drag.lx = e.clientX; drag.ly = e.clientY;
      drag.dist += Math.abs(dx) + Math.abs(dy);
      player.angle += dx * 0.004;
    });
    window.addEventListener("pointerup", function () {
      if (!drag) return;
      var tap = drag.dist < 14;
      drag = null;
      if (tap && current === "doom") fire();
    });
    $("dmStart").addEventListener("click", start);
    stopFns.doom = function () {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      keys = {};
      drag = null;
    };
    startGame();
    draw();
  })();

  /* ============ 53. ROGUE DUNGEON ============ */
  (function () {
    var W = 360, H = 240, MW = 30, MH = 20, TILE = 12, RADIUS = 8;
    var canvas = $("rlCanvas"), ctx = canvas.getContext("2d");
    var STATS = {
      rat:    { hp: 8,  dmg: 2,  xp: 5 },
      goblin: { hp: 16, dmg: 4,  xp: 12 },
      orc:    { hp: 30, dmg: 7,  xp: 25 },
      troll:  { hp: 55, dmg: 12, xp: 60 }
    };
    var COLORS = { rat: "#94a3b8", goblin: "#4ade80", orc: "#f87171", troll: "#a78bfa" };
    var map, vis, seen, rooms, player, monsters, potions, goldPiles, stairs;
    var depth, lvl, xp, hp, maxHp, gold, pots, dead, won, rlFlash, msgLog;

    function cfg() { return DP.rogue[diff()]; }

    function roomFits(x, y, w, h) {
      var r, c;
      for (r = y - 1; r <= y + h; r++) {
        for (c = x - 1; c <= x + w; c++) {
          if (r < 0 || r >= MH || c < 0 || c >= MW) return false;
          if (map[r][c] !== 1) return false;
        }
      }
      return true;
    }

    function corridor(x1, y1, x2, y2) {
      var c, r;
      for (c = Math.min(x1, x2); c <= Math.max(x1, x2); c++) map[y1][c] = 0;
      for (r = Math.min(y1, y2); r <= Math.max(y1, y2); r++) map[r][x2] = 0;
    }

    function occupied(x, y) {
      if (player.x === x && player.y === y) return true;
      for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].x === x && monsters[i].y === y) return true;
      }
      return false;
    }

    function findOpen(minD) {
      var i, x, y, dx, dy;
      for (i = 0; i < 300; i++) {
        x = 1 + Math.floor(Math.random() * (MW - 2));
        y = 1 + Math.floor(Math.random() * (MH - 2));
        if (map[y][x] !== 0) continue;
        dx = Math.abs(x - player.x); dy = Math.abs(y - player.y);
        if (Math.max(dx, dy) < minD) continue;
        if (occupied(x, y)) continue;
        return { x: x, y: y };
      }
      return null;
    }

    function genLevel() {
      map = [];
      rooms = [];
      var r, c, i;
      for (r = 0; r < MH; r++) {
        var row = [];
        for (c = 0; c < MW; c++) row.push(1);
        map.push(row);
      }
      var attempts = 8 + Math.floor(Math.random() * 3);
      for (i = 0; i < attempts; i++) {
        var w = 3 + Math.floor(Math.random() * 6);
        var h = 3 + Math.floor(Math.random() * 6);
        var x = 1 + Math.floor(Math.random() * (MW - w - 2));
        var y = 1 + Math.floor(Math.random() * (MH - h - 2));
        if (roomFits(x, y, w, h)) {
          for (r = y; r < y + h; r++) for (c = x; c < x + w; c++) map[r][c] = 0;
          rooms.push({ x: x, y: y, w: w, h: h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) });
        }
      }
      for (i = 1; i < rooms.length; i++) corridor(rooms[i - 1].cx, rooms[i - 1].cy, rooms[i].cx, rooms[i].cy);
      player = { x: rooms[0].cx, y: rooms[0].cy };
      stairs = { x: rooms[rooms.length - 1].cx, y: rooms[rooms.length - 1].cy };
      monsters = [];
      var count = cfg().mon + 2 * depth;
      var types = depth < 2 ? ["rat"] : depth < 4 ? ["rat", "goblin"] : depth < 6 ? ["goblin", "orc"] : ["orc", "troll"];
      for (i = 0; i < count; i++) {
        var t = types[Math.floor(Math.random() * types.length)];
        var s = STATS[t];
        var pos = findOpen(4);
        if (!pos) break;
        var mh = Math.round(s.hp * (1 + 0.15 * (depth - 1)));
        monsters.push({ type: t, x: pos.x, y: pos.y, hp: mh, maxhp: mh, dmg: Math.round(s.dmg * cfg().dmult), xp: s.xp });
      }
      potions = [];
      var pn = 3 + Math.floor(Math.random() * 3);
      for (i = 0; i < pn; i++) {
        var pp = findOpen(2);
        if (pp) potions.push({ x: pp.x, y: pp.y });
      }
      goldPiles = [];
      var gn = 3 + Math.floor(Math.random() * 4);
      for (i = 0; i < gn; i++) {
        var gp = findOpen(2);
        if (gp) goldPiles.push({ x: gp.x, y: gp.y, v: 10 + Math.floor(Math.random() * 21) });
      }
      vis = [];
      seen = [];
      for (r = 0; r < MH; r++) {
        vis.push([]); seen.push([]);
        for (c = 0; c < MW; c++) { vis[r].push(false); seen[r].push(false); }
      }
      computeFov();
    }

    function lineClear(x0, y0, x1, y1) {
      var dx = x1 - x0, dy = y1 - y0;
      var dist = Math.max(Math.abs(dx), Math.abs(dy));
      if (dist === 0) return true;
      var steps = Math.ceil(dist / 0.25);
      for (var i = 1; i < steps; i++) {
        if (map[Math.floor(y0 + dy * i / steps)][Math.floor(x0 + dx * i / steps)] === 1) return false;
      }
      return true;
    }

    function computeFov() {
      var r, c;
      for (r = 0; r < MH; r++) {
        for (c = 0; c < MW; c++) {
          vis[r][c] = false;
          if (Math.max(Math.abs(c - player.x), Math.abs(r - player.y)) > RADIUS) continue;
          if (lineClear(player.x, player.y, c, r)) vis[r][c] = true;
          if (vis[r][c]) seen[r][c] = true;
        }
      }
    }

    function log(msg) {
      msgLog.push(msg);
      if (msgLog.length > 4) msgLog.shift();
      $("rlLog").innerHTML = msgLog.join("<br>");
    }

    function updateHud() {
      $("rlDepth").textContent = depth;
      $("rlHp").textContent = Math.max(0, hp);
      $("rlLvl").textContent = lvl;
      $("rlPot").textContent = pots;
      $("rlGold").textContent = gold;
    }

    function checkLevel() {
      var need = Math.floor(40 * Math.pow(lvl, 1.5));
      while (xp >= need) {
        xp -= need;
        lvl++;
        maxHp = 100 + 10 * (lvl - 1);
        hp = maxHp;
        log("Level up! You are now level " + lvl + ".");
        beep(880, 0.12);
        need = Math.floor(40 * Math.pow(lvl, 1.5));
      }
    }

    function canStep(x, y) {
      if (x < 0 || x >= MW || y < 0 || y >= MH) return false;
      if (map[y][x] === 1) return false;
      if (x === player.x && y === player.y) return false;
      for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].x === x && monsters[i].y === y) return false;
      }
      return true;
    }

    function monstersAct() {
      var i, m, hit = false;
      for (i = 0; i < monsters.length; i++) {
        m = monsters[i];
        var dx = player.x - m.x, dy = player.y - m.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > RADIUS) continue;
        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
          var dmg = Math.floor(Math.random() * (m.dmg + 1));
          hp -= dmg;
          rlFlash = 0.35;
          hit = true;
          log("The " + m.type + " hits you for " + dmg + ".");
          beep(150, 0.1);
          if (hp <= 0) {
            dead = true;
            banner($("rlBanner"), "You died on depth " + depth + ". <b>Game over.</b>");
            beep(120, 0.4);
            log("You die...");
            updateHud();
            draw();
            return;
          }
          continue;
        }
        var sx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        var sy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        var tx, ty;
        if (Math.abs(dx) >= Math.abs(dy)) {
          tx = m.x + sx; ty = m.y;
          if (!canStep(tx, ty)) { tx = m.x; ty = m.y + sy; }
        } else {
          tx = m.x; ty = m.y + sy;
          if (!canStep(tx, ty)) { tx = m.x + sx; ty = m.y; }
        }
        if (canStep(tx, ty)) { m.x = tx; m.y = ty; }
      }
      if (hit) flashFade();
    }

    function flashFade() {
      if (current === "rogue" && rlFlash > 0) {
        rlFlash -= 0.05;
        draw();
        setTimeout(flashFade, 40);
      } else {
        rlFlash = 0;
      }
    }

    function endTurn() {
      monstersAct();
      computeFov();
      updateHud();
      draw();
    }

    function tryMove(dx, dy) {
      if (dead || won) return;
      var nx = player.x + dx, ny = player.y + dy;
      if (nx < 0 || nx >= MW || ny < 0 || ny >= MH) return;
      if (map[ny][nx] === 1) return;
      var i, found = null;
      for (i = 0; i < monsters.length; i++) {
        if (monsters[i].x === nx && monsters[i].y === ny) { found = monsters[i]; break; }
      }
      if (found) {
        var dmg = 8 + 3 * (lvl - 1) + Math.floor(Math.random() * 4);
        found.hp -= dmg;
        log("You hit the " + found.type + " for " + dmg + ".");
        beep(400, 0.05);
        if (found.hp <= 0) {
          log("The " + found.type + " dies. +" + found.xp + " XP.");
          monsters.splice(i, 1);
          xp += found.xp;
          checkLevel();
        }
        endTurn();
        return;
      }
      for (i = potions.length - 1; i >= 0; i--) {
        if (potions[i].x === nx && potions[i].y === ny) {
          pots++;
          potions.splice(i, 1);
          log("You pick up a potion.");
          beep(700, 0.05);
        }
      }
      for (i = goldPiles.length - 1; i >= 0; i--) {
        if (goldPiles[i].x === nx && goldPiles[i].y === ny) {
          gold += goldPiles[i].v;
          log("You pick up " + goldPiles[i].v + " gold.");
          beep(900, 0.05);
          goldPiles.splice(i, 1);
        }
      }
      player.x = nx;
      player.y = ny;
      endTurn();
    }

    function drink() {
      if (dead || won) return;
      if (pots <= 0) {
        log("You have no potions.");
        return;
      }
      pots--;
      var heal = Math.floor(maxHp * 0.4);
      hp = Math.min(maxHp, hp + heal);
      log("You drink a potion. +" + heal + " HP.");
      beep(520, 0.08);
      endTurn();
    }

    function descend() {
      if (dead || won) return;
      if (player.x !== stairs.x || player.y !== stairs.y) {
        log("The stairs are somewhere else.");
        return;
      }
      if (depth >= 10) {
        won = true;
        banner($("rlBanner"), "You escaped the dungeon! <b>You win!</b>");
        beep(1046, 0.3);
        log("You emerge into daylight. You are free!");
        updateHud();
        draw();
        return;
      }
      depth++;
      genLevel();
      hp = Math.min(maxHp, hp + Math.floor(maxHp * 0.25));
      log("You descend to depth " + depth + ".");
      beep(400, 0.1);
      updateHud();
      draw();
    }

    function tileAlpha(x, y) {
      return vis[y][x] ? 1 : (seen[y][x] ? 0.35 : 0);
    }

    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      var r, c, i;
      for (r = 0; r < MH; r++) {
        for (c = 0; c < MW; c++) {
          var alpha = vis[r][c] ? 1 : (seen[r][c] ? 0.35 : 0);
          if (alpha === 0) continue;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = map[r][c] === 1 ? "#2c3743" : "#141a21";
          ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
          if (map[r][c] === 0 && stairs.x === c && stairs.y === r) {
            ctx.fillStyle = "#22d3ee";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(">", c * TILE + TILE / 2, r * TILE + 9);
          }
        }
      }
      for (i = 0; i < potions.length; i++) {
        var pa = tileAlpha(potions[i].x, potions[i].y);
        if (pa === 0) continue;
        ctx.globalAlpha = pa;
        ctx.fillStyle = "#f472b6";
        ctx.fillRect(potions[i].x * TILE + 4, potions[i].y * TILE + 4, 4, 4);
      }
      for (i = 0; i < goldPiles.length; i++) {
        var ga = tileAlpha(goldPiles[i].x, goldPiles[i].y);
        if (ga === 0) continue;
        ctx.globalAlpha = ga;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(goldPiles[i].x * TILE + 4, goldPiles[i].y * TILE + 4, 4, 4);
      }
      for (i = 0; i < monsters.length; i++) {
        var ma = tileAlpha(monsters[i].x, monsters[i].y);
        if (ma === 0) continue;
        ctx.globalAlpha = ma;
        ctx.fillStyle = COLORS[monsters[i].type];
        ctx.beginPath();
        ctx.arc(monsters[i].x * TILE + TILE / 2, monsters[i].y * TILE + TILE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(player.x * TILE + TILE / 2, player.y * TILE + TILE / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (rlFlash > 0) {
        ctx.fillStyle = "rgba(248,113,113," + Math.min(0.5, rlFlash) + ")";
        ctx.fillRect(0, 0, W, H);
      }
    }

    function reset() {
      depth = 1; lvl = 1; xp = 0; gold = 0; pots = 0;
      dead = false; won = false; rlFlash = 0; msgLog = [];
      maxHp = 100;
      hp = maxHp;
      genLevel();
      hideBanner($("rlBanner"));
      log("You enter the dungeon. Depth 1.");
      updateHud();
      draw();
    }

    document.addEventListener("keydown", function (e) {
      if (current !== "rogue") return;
      var k = e.key;
      if (k === "ArrowUp" || k === "w" || k === "W") { e.preventDefault(); tryMove(0, -1); }
      else if (k === "ArrowDown" || k === "s" || k === "S") { e.preventDefault(); tryMove(0, 1); }
      else if (k === "ArrowLeft" || k === "a" || k === "A") { e.preventDefault(); tryMove(-1, 0); }
      else if (k === "ArrowRight" || k === "d" || k === "D") { e.preventDefault(); tryMove(1, 0); }
      else if (k === "p" || k === "P") { drink(); }
      else if (k === ">" || k === "Enter") { e.preventDefault(); descend(); }
    });
    $("rlUp").addEventListener("click", function () { tryMove(0, -1); });
    $("rlDown").addEventListener("click", function () { tryMove(0, 1); });
    $("rlLeft").addEventListener("click", function () { tryMove(-1, 0); });
    $("rlRight").addEventListener("click", function () { tryMove(1, 0); });
    $("rlPotion").addEventListener("click", drink);
    $("rlDescend").addEventListener("click", descend);
    $("rlNew").addEventListener("click", reset);
    stopFns.rogue = function () {};
    reset();
  })();

  /* ============ 54. CHESS ============ */
  (function () {
    var chBoard = $("chBoard");
    var chMsg = $("chMsg");
    var chBanner = $("chBanner");

    var pos, turn, sel, selMoves, over, cpuTimer, lastMove, maxL = 0;
    var nodes = 0;
    var PV = { 1: 100, 2: 320, 3: 330, 4: 500, 5: 900, 6: 20000 };
    var GLYPH = { 1: "\u2659", 2: "\u2658", 3: "\u2657", 4: "\u2656", 5: "\u2655", 6: "\u2654", "-1": "\u265F", "-2": "\u265E", "-3": "\u265D", "-4": "\u265C", "-5": "\u265B", "-6": "\u265A" };

    function cfg() { return DP.chess[diff()]; }
    function pieceColor(v) { return v > 0 ? 1 : (v < 0 ? -1 : 0); }
    function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
    function idx(r, c) { return r * 8 + c; }

    function startpos() {
      var b = [];
      var back = [4, 2, 3, 5, 6, 3, 2, 4];
      for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
          var v = 0;
          if (r === 0) v = -back[c];
          else if (r === 1) v = -1;
          else if (r === 6) v = 1;
          else if (r === 7) v = back[c];
          b.push(v);
        }
      }
      return { b: b, cr: [true, true, true, true], ep: -1, hm: 0 };
    }

    function attacked(b, i, by) {
      var r = Math.floor(i / 8), c = i % 8, k;
      var pr = by === 1 ? r + 1 : r - 1;
      for (var pc = c - 1; pc <= c + 1; pc += 2) {
        if (inb(pr, pc) && b[idx(pr, pc)] === by * 1) return true;
      }
      var NK = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (k = 0; k < 8; k++) {
        if (inb(r + NK[k][0], c + NK[k][1]) && b[idx(r + NK[k][0], c + NK[k][1])] === by * 2) return true;
      }
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (inb(r + dr, c + dc) && b[idx(r + dr, c + dc)] === by * 6) return true;
        }
      }
      var RAYS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (k = 0; k < 8; k++) {
        var d = RAYS[k];
        var onlyDiag = k >= 4;
        var jr = r + d[0], jc = c + d[1];
        while (inb(jr, jc)) {
          var v = b[idx(jr, jc)];
          if (v !== 0) {
            var at = Math.abs(v);
            if (pieceColor(v) === by && (at === 5 || (at === 4 && !onlyDiag) || (at === 3 && onlyDiag))) return true;
            break;
          }
          jr += d[0];
          jc += d[1];
        }
      }
      return false;
    }

    function kingIdx(b, side) {
      for (var i = 0; i < 64; i++) if (b[i] === side * 6) return i;
      return -1;
    }
    function inCheck(p, side) {
      var k = kingIdx(p.b, side);
      if (k < 0) return false;
      return attacked(p.b, k, -side);
    }

    function pushPawn(moves, f, t, promoRank, cap) {
      if (Math.floor(t / 8) === promoRank) moves.push({ f: f, t: t, promo: 5, cap: !!cap });
      else moves.push({ f: f, t: t, cap: !!cap });
    }

    function castleMoves(p, moves, side) {
      var b = p.b;
      if (side === 1) {
        if (p.cr[0] && b[61] === 0 && b[62] === 0 && b[63] === 4 &&
            !attacked(b, 60, -1) && !attacked(b, 61, -1) && !attacked(b, 62, -1)) moves.push({ f: 60, t: 62, castle: 1 });
        if (p.cr[1] && b[59] === 0 && b[58] === 0 && b[57] === 0 && b[56] === 4 &&
            !attacked(b, 60, -1) && !attacked(b, 59, -1) && !attacked(b, 58, -1)) moves.push({ f: 60, t: 58, castle: 2 });
      } else {
        if (p.cr[2] && b[5] === 0 && b[6] === 0 && b[7] === -4 &&
            !attacked(b, 4, 1) && !attacked(b, 5, 1) && !attacked(b, 6, 1)) moves.push({ f: 4, t: 6, castle: 1 });
        if (p.cr[3] && b[3] === 0 && b[2] === 0 && b[1] === 0 && b[0] === -4 &&
            !attacked(b, 4, 1) && !attacked(b, 3, 1) && !attacked(b, 2, 1)) moves.push({ f: 4, t: 2, castle: 2 });
      }
    }

    function pseudoMoves(p, side) {
      var b = p.b;
      var moves = [];
      var i, r, c, v, t;
      for (i = 0; i < 64; i++) {
        v = b[i];
        if (v === 0 || pieceColor(v) !== side) continue;
        t = Math.abs(v);
        r = Math.floor(i / 8);
        c = i % 8;
        if (t === 1) {
          var fwd = side === 1 ? -1 : 1;
          var startRank = side === 1 ? 6 : 1;
          var promoRank = side === 1 ? 0 : 7;
          var nr1 = r + fwd;
          if (inb(nr1, c) && b[idx(nr1, c)] === 0) {
            pushPawn(moves, i, idx(nr1, c), promoRank, false);
            var nr2 = r + 2 * fwd;
            if (r === startRank && b[idx(nr2, c)] === 0) moves.push({ f: i, t: idx(nr2, c), dp: true, cap: false });
          }
          for (var dc = -1; dc <= 1; dc += 2) {
            var nc = c + dc;
            if (!inb(nr1, nc)) continue;
            var ti = idx(nr1, nc);
            var tv = b[ti];
            if (tv !== 0 && pieceColor(tv) === -side) pushPawn(moves, i, ti, promoRank, true);
            if (ti === p.ep && p.ep >= 0) moves.push({ f: i, t: ti, ep: true, cap: true });
          }
        } else if (t === 2) {
          var NK2 = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
          for (var k2 = 0; k2 < 8; k2++) {
            var nr = r + NK2[k2][0], ncc = c + NK2[k2][1];
            if (inb(nr, ncc) && pieceColor(b[idx(nr, ncc)]) !== side) moves.push({ f: i, t: idx(nr, ncc), cap: b[idx(nr, ncc)] !== 0 });
          }
        } else if (t === 6) {
          for (var dr3 = -1; dr3 <= 1; dr3++) {
            for (var dc3 = -1; dc3 <= 1; dc3++) {
              if (dr3 === 0 && dc3 === 0) continue;
              var kr = r + dr3, kc = c + dc3;
              if (inb(kr, kc) && pieceColor(b[idx(kr, kc)]) !== side) moves.push({ f: i, t: idx(kr, kc), cap: b[idx(kr, kc)] !== 0 });
            }
          }
          if ((side === 1 && i === 60) || (side === -1 && i === 4)) castleMoves(p, moves, side);
        } else {
          var RAYS2 = t === 4 ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : (t === 3 ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]);
          for (var k3 = 0; k3 < RAYS2.length; k3++) {
            var jr2 = r + RAYS2[k3][0], jc2 = c + RAYS2[k3][1];
            while (inb(jr2, jc2)) {
              var tv2 = b[idx(jr2, jc2)];
              if (tv2 === 0) moves.push({ f: i, t: idx(jr2, jc2), cap: false });
              else {
                if (pieceColor(tv2) === -side) moves.push({ f: i, t: idx(jr2, jc2), cap: true });
                break;
              }
              jr2 += RAYS2[k3][0];
              jc2 += RAYS2[k3][1];
            }
          }
        }
      }
      return moves;
    }

    function applyMove(p, m) {
      var nb = p.b.slice();
      var v = nb[m.f];
      var side = v > 0 ? 1 : -1;
      nb[m.f] = 0;
      if (m.promo) nb[m.t] = side * m.promo;
      else nb[m.t] = v;
      if (m.ep) nb[idx(Math.floor(m.f / 8), m.t % 8)] = 0;
      if (m.castle) {
        if (m.t === 62) { nb[63] = 0; nb[61] = 4; }
        if (m.t === 58) { nb[56] = 0; nb[59] = 4; }
        if (m.t === 6) { nb[7] = 0; nb[5] = -4; }
        if (m.t === 2) { nb[0] = 0; nb[3] = -4; }
      }
      var ncr = p.cr.slice();
      if (v === 6) { ncr[0] = false; ncr[1] = false; }
      if (v === -6) { ncr[2] = false; ncr[3] = false; }
      if (m.f === 63 || m.t === 63) ncr[0] = false;
      if (m.f === 56 || m.t === 56) ncr[1] = false;
      if (m.f === 7 || m.t === 7) ncr[2] = false;
      if (m.f === 0 || m.t === 0) ncr[3] = false;
      var nep = m.dp ? (m.f + m.t) / 2 : -1;
      var nhm = (m.cap || Math.abs(v) === 1) ? 0 : p.hm + 1;
      return { b: nb, cr: ncr, ep: nep, hm: nhm };
    }

    function legalMoves(p, side) {
      var ps = pseudoMoves(p, side);
      var out = [];
      for (var i = 0; i < ps.length; i++) {
        var np = applyMove(p, ps[i]);
        if (!inCheck(np, side)) out.push(ps[i]);
      }
      return out;
    }

    function evaluate(p) {
      var b = p.b;
      var s = 0;
      for (var i = 0; i < 64; i++) {
        var v = b[i];
        if (v === 0) continue;
        var t = Math.abs(v);
        var w = PV[t];
        var r = Math.floor(i / 8), c = i % 8;
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) w += 8;
        if (t === 1) w += (v > 0 ? (6 - r) * 4 : (r - 1) * 4);
        s += v > 0 ? w : -w;
      }
      return s;
    }

    function minimax(p, depth, alpha, beta, maximizing) {
      nodes++;
      if (nodes > 200000) return evaluate(p);
      var side = maximizing ? 1 : -1;
      var moves = legalMoves(p, side);
      if (moves.length === 0) {
        if (inCheck(p, side)) return maximizing ? -100000 - depth : 100000 + depth;
        return 0;
      }
      if (depth === 0) return evaluate(p);
      var b = p.b;
      moves.sort(function (a, c2) {
        var av = a.cap ? (PV[Math.abs(b[a.t])] || 0) : 0;
        var cv = c2.cap ? (PV[Math.abs(b[c2.t])] || 0) : 0;
        return cv - av;
      });
      if (maximizing) {
        var best = -Infinity;
        for (var i = 0; i < moves.length; i++) {
          var np = applyMove(p, moves[i]);
          var v2 = minimax(np, depth - 1, alpha, beta, false);
          if (v2 > best) best = v2;
          if (best > alpha) alpha = best;
          if (beta <= alpha) break;
        }
        return best;
      }
      var best2 = Infinity;
      for (var j = 0; j < moves.length; j++) {
        var np2 = applyMove(p, moves[j]);
        var v3 = minimax(np2, depth - 1, alpha, beta, true);
        if (v3 < best2) best2 = v3;
        if (best2 < beta) beta = best2;
        if (beta <= alpha) break;
      }
      return best2;
    }

    function insufficient(b) {
      var list = [];
      for (var i = 0; i < 64; i++) if (b[i] !== 0) list.push({ v: b[i], i: i });
      var n = list.length;
      if (n <= 2) return true;
      if (n === 3) {
        for (var j = 0; j < 3; j++) if (Math.abs(list[j].v) === 2 || Math.abs(list[j].v) === 3) return true;
        return false;
      }
      if (n === 4) {
        var cols = [], bishops = true;
        for (var k = 0; k < 4; k++) {
          if (Math.abs(list[k].v) !== 3) { bishops = false; break; }
          cols.push((Math.floor(list[k].i / 8) + list[k].i % 8) % 2);
        }
        if (bishops && cols[0] === cols[1] && cols[1] === cols[2] && cols[2] === cols[3]) return true;
      }
      return false;
    }

    function status(p, side) {
      var moves = legalMoves(p, side);
      if (moves.length === 0) return inCheck(p, side) ? (side === 1 ? "lose" : "win") : "draw";
      if (insufficient(p.b)) return "draw";
      if (p.hm >= 150) return "draw";
      return null;
    }

    function doMove(m) {
      lastMove = m;
      pos = applyMove(pos, m);
      sel = -1;
      selMoves = [];
      turn = -turn;
      beep(m.cap ? 300 : 440, 0.05);
      var st = status(pos, turn);
      if (st) { gameOver(st); return; }
      var chk = inCheck(pos, turn);
      chMsg.textContent = (turn === 1 ? "Your move." : "CPU thinking\u2026") + (chk ? " Check!" : "");
      render();
      if (turn === -1) cpuTimer = setTimeout(function () { cpuMove(); }, 350);
    }

    function cpuMove() {
      if (over) return;
      nodes = 0;
      var depth = cfg().depth;
      var moves = legalMoves(pos, -1);
      if (moves.length === 0) { gameOver(status(pos, -1)); return; }
      var best = null;
      if (depth === 1) {
        best = moves[Math.floor(Math.random() * moves.length)];
      } else {
        var bv = Infinity, ties = [];
        var bb = pos.b;
        moves.sort(function (a, c2) {
          var av = a.cap ? (PV[Math.abs(bb[a.t])] || 0) : 0;
          var cv = c2.cap ? (PV[Math.abs(bb[c2.t])] || 0) : 0;
          return cv - av;
        });
        for (var i = 0; i < moves.length; i++) {
          var np = applyMove(pos, moves[i]);
          var v = minimax(np, depth - 1, -Infinity, Infinity, true);
          if (v < bv) { bv = v; ties = [moves[i]]; }
          else if (v === bv) ties.push(moves[i]);
        }
        best = ties[Math.floor(Math.random() * ties.length)];
      }
      doMove(best);
    }

    function tapCell(i) {
      if (over || turn !== 1) return;
      var m2, k;
      if (sel >= 0) {
        for (k = 0; k < selMoves.length; k++) {
          if (selMoves[k].t === i) { doMove(selMoves[k]); return; }
        }
      }
      var v = pos.b[i];
      if (v > 0) {
        var all = legalMoves(pos, 1);
        var mine = [];
        for (m2 = 0; m2 < all.length; m2++) if (all[m2].f === i) mine.push(all[m2]);
        if (mine.length > 0) {
          sel = i;
          selMoves = mine;
          beep(400, 0.04);
          render();
        } else {
          chMsg.textContent = "That piece has no legal moves.";
          if (!inCheck(pos, 1)) sel = -1;
          selMoves = [];
          render();
        }
      } else {
        sel = -1;
        selMoves = [];
        render();
      }
    }

    function recKey() { return "gb_chess_rec_" + diff(); }

    function gameOver(st) {
      over = true;
      if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
      var rec = lsGet(recKey(), [0, 0, 0]);
      var html;
      if (st === "win") { rec[0]++; chMsg.textContent = "Checkmate — you win!"; html = "Checkmate! You win! &#127881;"; beep(750, 0.3); }
      else if (st === "lose") { rec[2]++; chMsg.textContent = "Checkmate — CPU wins."; html = "Checkmate. CPU wins."; beep(200, 0.3); }
      else { rec[1]++; chMsg.textContent = "Draw — stalemate or insufficient material."; html = "Draw."; beep(330, 0.2); }
      lsSet(recKey(), rec);
      $("chYou").textContent = rec[0];
      $("chDraw").textContent = rec[1];
      $("chCpu").textContent = rec[2];
      banner(chBanner, html);
      render();
    }

    function render() {
      chBoard.innerHTML = "";
      chBoard.style.gridTemplateColumns = "repeat(8, 1fr)";
      for (var i = 0; i < 64; i++) {
        (function (i) {
          var r = Math.floor(i / 8), c = i % 8;
          var v = pos.b[i];
          var btn = document.createElement("button");
          btn.className = "ch-cell " + ((r + c) % 2 === 0 ? "light" : "dark");
          if (v !== 0) {
            var sp = document.createElement("span");
            sp.textContent = GLYPH[v];
            sp.className = v > 0 ? "ch-w" : "ch-b";
            btn.appendChild(sp);
          }
          if (sel === i) btn.className += " ch-sel";
          for (var k = 0; k < selMoves.length; k++) {
            if (selMoves[k].t === i) {
              btn.className += (pos.b[i] !== 0 || selMoves[k].cap) ? " ch-cap" : " ch-target";
              break;
            }
          }
          if (lastMove && (lastMove.f === i || lastMove.t === i)) btn.className += " ch-last";
          btn.addEventListener("click", function () { tapCell(i); });
          chBoard.appendChild(btn);
        })(i);
      }
    }

    function reset() {
      pos = startpos();
      turn = 1;
      sel = -1;
      selMoves = [];
      over = false;
      lastMove = null;
      if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; }
      var rec = lsGet(recKey(), [0, 0, 0]);
      $("chYou").textContent = rec[0];
      $("chDraw").textContent = rec[1];
      $("chCpu").textContent = rec[2];
      chMsg.textContent = "Your move \u2014 white plays first.";
      hideBanner(chBanner);
      render();
    }

    stopFns.chess = function () { if (cpuTimer) { clearTimeout(cpuTimer); cpuTimer = null; } };
    $("chNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 55. KLONDIKE ============ */
  (function () {
    var klMsg = $("klMsg");
    var klBanner = $("klBanner");
    var klStockEl = $("klStock");
    var klWasteEl = $("klWaste");
    var klFoundEls = [$("klF0"), $("klF1"), $("klF2"), $("klF3")];
    var klColEls = [];
    for (var ci = 0; ci < 7; ci++) klColEls.push($("klT" + ci));

    var SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];
    var stock, waste, founds, tabs, drawN, redeals, moves, t0, timer, done, sel;

    function cfg() { return DP.klondike[diff()]; }
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }
    function colorOf(card) { return (card.s === 1 || card.s === 2) ? "red" : "black"; }
    function rankText(r) { return r === 1 ? "A" : (r === 11 ? "J" : (r === 12 ? "Q" : (r === 13 ? "K" : String(r)))); }

    function getPile(id) {
      if (id === "w") return waste;
      if (id.charAt(0) === "f") return founds[parseInt(id.substring(1), 10)];
      return tabs[parseInt(id.substring(1), 10)];
    }

    function newDeck() {
      var d = [];
      for (var s = 0; s < 4; s++) for (var r = 1; r <= 13; r++) d.push({ s: s, r: r, u: false });
      for (var i = d.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = d[i];
        d[i] = d[j];
        d[j] = tmp;
      }
      return d;
    }

    function cardEl(card, pileId, idx, faceUp) {
      var el = document.createElement("div");
      if (!faceUp) { el.className = "kl-card back"; return el; }
      el.className = "kl-card" + (colorOf(card) === "red" ? " red" : "");
      var rk = document.createElement("span");
      rk.className = "rk";
      rk.textContent = rankText(card.r);
      var st = document.createElement("span");
      st.className = "st";
      st.textContent = SUITS[card.s];
      el.appendChild(rk);
      el.appendChild(st);
      if (sel && sel.pile === pileId && sel.idx === idx) el.className += " kl-sel";
      el.addEventListener("click", function (e) { e.stopPropagation(); tapCard(pileId, idx); });
      el.addEventListener("dblclick", function (e) { e.stopPropagation(); autoFound(pileId, idx); });
      return el;
    }

    function tryMove(destId) {
      if (!sel) return false;
      if (sel.pile === destId) return false;
      var src = getPile(sel.pile);
      var cards = src.slice(sel.idx);
      var dest = getPile(destId);
      var ok = false;
      if (destId.charAt(0) === "f" && cards.length === 1) {
        var d = dest.length ? dest[dest.length - 1] : null;
        ok = (!d && cards[0].r === 1) || (d && d.s === cards[0].s && d.r === cards[0].r - 1);
      } else if (destId.charAt(0) === "t") {
        var dt = dest.length ? dest[dest.length - 1] : null;
        if (dt && dt.u) ok = (dt.r === cards[0].r + 1 && colorOf(dt) !== colorOf(cards[0]));
        if (!dt) ok = (cards[0].r === 13);
      }
      if (!ok) {
        beep(200, 0.05);
        klMsg.textContent = "Illegal move.";
        sel = null;
        render();
        return true;
      }
      src.splice(sel.idx, cards.length);
      for (var i = 0; i < cards.length; i++) dest.push(cards[i]);
      if (src.length && sel.pile.charAt(0) === "t" && !src[src.length - 1].u) src[src.length - 1].u = true;
      moves++;
      sel = null;
      beep(600, 0.05);
      $("klMoves").textContent = moves;
      checkWin();
      render();
      return true;
    }

    function autoFound(pileId, idx) {
      if (done) return;
      var pile = getPile(pileId);
      if (idx !== pile.length - 1) return;
      sel = { pile: pileId, idx: idx };
      for (var f = 0; f < 4; f++) {
        if (tryMove("f" + f)) return;
      }
      sel = null;
      render();
    }

    function tapCard(pileId, idx) {
      if (done) return;
      var pile = getPile(pileId);
      var card = pile[idx];
      if (!card) return;
      if (!card.u) { beep(200, 0.04); return; }
      if (pileId === "w" || pileId.charAt(0) === "f") {
        if (idx !== pile.length - 1) { beep(200, 0.04); return; }
      }
      if (sel && sel.pile === pileId && sel.idx === idx) { sel = null; render(); return; }
      if (sel && sel.pile !== pileId && tryMove(pileId)) return;
      sel = { pile: pileId, idx: idx };
      beep(440, 0.04);
      render();
    }

    function tapStock() {
      if (done) return;
      sel = null;
      if (stock.length === 0) {
        if (redeals <= 0) { klMsg.textContent = "No redeals left."; beep(200, 0.05); return; }
        redeals--;
        while (waste.length) { var c = waste.pop(); c.u = false; stock.push(c); }
        klMsg.textContent = "Redeal \u2014 " + redeals + " left.";
        beep(360, 0.05);
        render();
        return;
      }
      var n = Math.min(drawN, stock.length);
      for (var i = 0; i < n; i++) { var card = stock.pop(); card.u = true; waste.push(card); }
      moves++;
      $("klMoves").textContent = moves;
      beep(480, 0.05);
      render();
    }

    function checkWin() {
      var total = 0;
      for (var f = 0; f < 4; f++) total += founds[f].length;
      if (total === 52) {
        done = true;
        if (timer) { clearInterval(timer); timer = null; }
        var secs = Math.floor((Date.now() - t0) / 1000);
        var best = lsGet("gb_klondike_best_" + diff(), 0);
        if (!best || moves < best) { best = moves; lsSet("gb_klondike_best_" + diff(), best); }
        $("klBest").textContent = best;
        klMsg.textContent = "Solved!";
        banner(klBanner, "Solved in <b>" + moves + "</b> moves (" + fmt(secs) + ")!");
        beep(750, 0.3);
      }
    }

    function render() {
      klStockEl.innerHTML = "";
      if (stock.length > 0) {
        klStockEl.appendChild(cardEl(null, "stock", 0, false));
        var badge = document.createElement("div");
        badge.className = "kl-count";
        badge.textContent = stock.length;
        klStockEl.appendChild(badge);
      } else {
        var hint2 = document.createElement("div");
        hint2.className = "kl-stockhint";
        hint2.innerHTML = redeals > 0 ? "&#8635;" : "&#8212;";
        klStockEl.appendChild(hint2);
      }
      klWasteEl.innerHTML = "";
      var wn = waste.length;
      var w0 = Math.max(0, wn - drawN);
      for (var w = w0; w < wn; w++) {
        var el = cardEl(waste[w], "w", w, true);
        el.style.left = ((w - w0) * 14) + "px";
        klWasteEl.appendChild(el);
      }
      for (var f = 0; f < 4; f++) {
        klFoundEls[f].innerHTML = "";
        var fn = founds[f].length;
        if (fn > 0) klFoundEls[f].appendChild(cardEl(founds[f][fn - 1], "f" + f, fn - 1, true));
      }
      for (var t = 0; t < 7; t++) {
        klColEls[t].innerHTML = "";
        var arr = tabs[t];
        for (var k = 0; k < arr.length; k++) {
          var ce = cardEl(arr[k], "t" + t, k, arr[k].u);
          if (k > 0) ce.style.marginTop = (arr[k].u ? "-32px" : "-46px");
          klColEls[t].appendChild(ce);
        }
      }
    }

    function reset() {
      var c = cfg();
      drawN = c.draw;
      redeals = c.redeals;
      var deck = newDeck();
      tabs = [[], [], [], [], [], [], []];
      founds = [[], [], [], []];
      for (var col = 0; col < 7; col++) {
        for (var k = 0; k <= col; k++) {
          var card = deck.pop();
          card.u = (k === col);
          tabs[col].push(card);
        }
      }
      stock = deck;
      waste = [];
      moves = 0;
      done = false;
      sel = null;
      if (timer) { clearInterval(timer); timer = null; }
      t0 = Date.now();
      timer = setInterval(function () {
        if (!done) $("klTime").textContent = fmt(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
      var best = lsGet("gb_klondike_best_" + diff(), 0);
      $("klBest").textContent = best ? best : "\u2014";
      $("klMoves").textContent = "0";
      $("klTime").textContent = "0:00";
      klMsg.textContent = "Click the stock to deal. Build foundations A to K by suit.";
      hideBanner(klBanner);
      render();
    }

    klStockEl.addEventListener("click", function () { tapStock(); });
    for (var f2 = 0; f2 < 4; f2++) {
      (function (f2) {
        klFoundEls[f2].addEventListener("click", function () { if (sel) tryMove("f" + f2); });
      })(f2);
    }
    for (var t2 = 0; t2 < 7; t2++) {
      (function (t2) {
        klColEls[t2].addEventListener("click", function () { if (sel) tryMove("t" + t2); });
      })(t2);
    }
    stopFns.klondike = function () { if (timer) { clearInterval(timer); timer = null; } };
    $("klNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 56. MAHJONG ============ */
  (function () {
    var mjBoard = $("mjBoard");
    var mjMsg = $("mjMsg");
    var mjBanner = $("mjBanner");

    var TW = 36, TH = 48, DX = 18, DY = 22, SX = 40, SY = 52;
    var tiles, left, sel, t0, timer, done, hintTimer, maxL, hintIdx;

    function cfg() { return DP.mahjong[diff()]; }

    var DESIGNS = [
      { l: "1", c: "#f87171" }, { l: "2", c: "#f87171" }, { l: "3", c: "#f87171" }, { l: "4", c: "#f87171" }, { l: "5", c: "#f87171" }, { l: "6", c: "#f87171" }, { l: "7", c: "#f87171" }, { l: "8", c: "#f87171" }, { l: "9", c: "#f87171" },
      { l: "1", c: "#4ade80" }, { l: "2", c: "#4ade80" }, { l: "3", c: "#4ade80" }, { l: "4", c: "#4ade80" }, { l: "5", c: "#4ade80" }, { l: "6", c: "#4ade80" }, { l: "7", c: "#4ade80" }, { l: "8", c: "#4ade80" }, { l: "9", c: "#4ade80" },
      { l: "1", c: "#38bdf8" }, { l: "2", c: "#38bdf8" }, { l: "3", c: "#38bdf8" }, { l: "4", c: "#38bdf8" }, { l: "5", c: "#38bdf8" }, { l: "6", c: "#38bdf8" }, { l: "7", c: "#38bdf8" }, { l: "8", c: "#38bdf8" }, { l: "9", c: "#38bdf8" },
      { l: "E", c: "#a78bfa" }, { l: "S", c: "#a78bfa" }, { l: "W", c: "#a78bfa" }, { l: "N", c: "#a78bfa" },
      { l: "\u4E2D", c: "#fbbf24" }, { l: "\u767C", c: "#86efac" }, { l: "\u767D", c: "#e8edf2" },
      { l: "\u2605", c: "#fb923c" }, { l: "\u2600", c: "#facc15" }
    ];

    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }

    function covered(t) {
      if (t.l >= maxL) return false;
      for (var i = 0; i < tiles.length; i++) {
        var u = tiles[i];
        if (u.gone || u.l !== t.l + 1) continue;
        if (u.c >= t.c - 1 && u.c <= t.c && u.r >= t.r - 1 && u.r <= t.r) return true;
      }
      return false;
    }

    function blockedSide(t) {
      var bl = false, br = false;
      for (var i = 0; i < tiles.length; i++) {
        var u = tiles[i];
        if (u.gone || u.l !== t.l) continue;
        if (u.r === t.r) {
          if (u.c === t.c - 1) bl = true;
          if (u.c === t.c + 1) br = true;
        }
      }
      return bl && br;
    }

    function freeTile(t) { return !t.gone && !covered(t) && !blockedSide(t); }

    function anyMove() {
      var free = [];
      for (var i = 0; i < tiles.length; i++) if (freeTile(tiles[i])) free.push(i);
      for (var a = 0; a < free.length; a++) {
        for (var b = a + 1; b < free.length; b++) {
          if (tiles[free[a]].d === tiles[free[b]].d) return [free[a], free[b]];
        }
      }
      return null;
    }

    function checkEnd() {
      if (left === 0) {
        done = true;
        if (timer) { clearInterval(timer); timer = null; }
        var secs = Math.floor((Date.now() - t0) / 1000);
        var best = lsGet("gb_mahjong_best_" + diff(), 0);
        if (!best || secs < best) { best = secs; lsSet("gb_mahjong_best_" + diff(), best); }
        $("mjBest").textContent = fmt(best);
        mjMsg.textContent = "Cleared!";
        banner(mjBanner, "Cleared in <b>" + fmt(secs) + "</b>!");
        beep(750, 0.3);
        return;
      }
      if (!anyMove()) mjMsg.textContent = "No moves left \u2014 tap Shuffle.";
    }

    function tapTile(i) {
      if (done) return;
      var t = tiles[i];
      if (t.gone || !freeTile(t)) { beep(200, 0.04); return; }
      if (sel === i) { sel = -1; render(); return; }
      if (sel >= 0) {
        var s = tiles[sel];
        if (s.d === t.d) {
          s.gone = true;
          t.gone = true;
          left--;
          sel = -1;
          $("mjLeft").textContent = left;
          beep(700, 0.08);
          checkEnd();
          render();
          return;
        }
      }
      sel = i;
      beep(440, 0.04);
      render();
    }

    function shuffleLeft() {
      if (done) return;
      var remain = [];
      for (var i = 0; i < tiles.length; i++) if (!tiles[i].gone) remain.push(tiles[i].d);
      for (var s2 = remain.length - 1; s2 > 0; s2--) {
        var j = Math.floor(Math.random() * (s2 + 1));
        var tmp = remain[s2];
        remain[s2] = remain[j];
        remain[j] = tmp;
      }
      var ri = 0;
      for (var i2 = 0; i2 < tiles.length; i2++) if (!tiles[i2].gone) tiles[i2].d = remain[ri++];
      sel = -1;
      beep(520, 0.1);
      mjMsg.textContent = "Shuffled.";
      render();
    }

    function showHint() {
      if (done) return;
      var pair = anyMove();
      hintIdx = pair ? pair : [];
      if (!pair) { mjMsg.textContent = "No moves left \u2014 tap Shuffle."; render(); return; }
      beep(500, 0.06);
      render();
      if (hintTimer) clearTimeout(hintTimer);
      hintTimer = setTimeout(function () { hintIdx = []; if (!done) render(); }, 1400);
    }

    function render() {
      mjBoard.innerHTML = "";
      for (var i = 0; i < tiles.length; i++) {
        (function (i) {
          var t = tiles[i];
          var el = document.createElement("button");
          el.className = "mj-tile";
          var d = DESIGNS[t.d];
          el.textContent = d.l;
          el.style.color = d.c;
          el.style.left = (t.c * SX + DX * t.l + 4) + "px";
          el.style.top = (t.r * SY + DY * t.l + 4) + "px";
          el.style.zIndex = t.l;
          if (t.gone) el.className += " mj-gone";
          if (!freeTile(t)) el.className += " mj-blocked";
          if (sel === i) el.className += " mj-sel";
          if (hintIdx && hintIdx.indexOf(i) >= 0) el.className += " mj-hint";
          el.addEventListener("click", function () { tapTile(i); });
          mjBoard.appendChild(el);
        })(i);
      }
    }

    function reset() {
      var c = cfg();
      var layers = c.layers, rows = c.rows, cols = c.cols;
      maxL = layers - 1;
      var total = layers * rows * cols;
      var k = total / 4;
      var pool = [];
      for (var i = 0; i < DESIGNS.length; i++) pool.push(i);
      for (var s3 = pool.length - 1; s3 > 0; s3--) {
        var j1 = Math.floor(Math.random() * (s3 + 1));
        var tmp1 = pool[s3];
        pool[s3] = pool[j1];
        pool[j1] = tmp1;
      }
      var designList = [];
      for (var d = 0; d < k; d++) for (var x = 0; x < 4; x++) designList.push(pool[d]);
      for (var s4 = designList.length - 1; s4 > 0; s4--) {
        var j2 = Math.floor(Math.random() * (s4 + 1));
        var tmp2 = designList[s4];
        designList[s4] = designList[j2];
        designList[j2] = tmp2;
      }
      tiles = [];
      var di = 0;
      for (var l = 0; l < layers; l++) {
        for (var r = 0; r < rows; r++) {
          for (var cc = 0; cc < cols; cc++) {
            tiles.push({ d: designList[di++], l: l, r: r, c: cc, gone: false });
          }
        }
      }
      left = total / 2;
      sel = -1;
      done = false;
      hintIdx = [];
      var W = (cols - 1) * SX + DX * (layers - 1) + TW + 8;
      var H = (rows - 1) * SY + DY * (layers - 1) + TH + 8;
      mjBoard.style.width = W + "px";
      mjBoard.style.height = H + "px";
      if (timer) { clearInterval(timer); timer = null; }
      t0 = Date.now();
      timer = setInterval(function () {
        if (!done) $("mjTime").textContent = fmt(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
      $("mjLeft").textContent = left;
      $("mjTime").textContent = "0:00";
      var best = lsGet("gb_mahjong_best_" + diff(), 0);
      $("mjBest").textContent = best ? fmt(best) : "\u2014";
      mjMsg.textContent = "Tap a free tile, then its match.";
      hideBanner(mjBanner);
      render();
    }

    stopFns.mahjong = function () {
      if (timer) { clearInterval(timer); timer = null; }
      if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
    };
    $("mjNew").addEventListener("click", reset);
    $("mjHint").addEventListener("click", showHint);
    $("mjShuffle").addEventListener("click", shuffleLeft);
    reset();
  })();

  /* ============ 57. BOWLING ============ */
  (function () {
    var canvas = $("bwCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var bwMsg = $("bwMsg");
    var bwBanner = $("bwBanner");

    var BR = 9, PR = 7, GUT = 22;
    var frames, cur, mode, ball, pins, aim, raf, throwT, hookA, done;

    function cfg() { return DP.bowl[diff()]; }

    function pinSpots() {
      var p = [];
      for (var r = 0; r < 4; r++) {
        for (var k = 0; k <= r; k++) {
          var x = 180 - r * 9 + k * 18;
          var y = 56 + r * 18;
          p.push({ x: x, y: y, ox: x, oy: y, vx: 0, vy: 0, gone: false });
        }
      }
      return p;
    }

    function totalScore() {
      var t = 0, i, k;
      for (i = 0; i < 10; i++) {
        var f = frames[i];
        if (!f || !f.length) break;
        if (i < 9) {
          if (f[0] === 10) {
            var balls = [];
            for (k = i + 1; k < frames.length && balls.length < 2; k++)
              for (var m = 0; m < frames[k].length && balls.length < 2; m++) balls.push(frames[k][m]);
            t += 10 + (balls[0] || 0) + (balls[1] || 0);
          } else if (f.length === 2 && f[0] + f[1] === 10) {
            var nx = 0;
            if (frames[i + 1] && frames[i + 1].length) nx = frames[i + 1][0];
            t += 10 + nx;
          } else t += f[0] + (f[1] || 0);
        } else {
          for (k = 0; k < f.length; k++) t += f[k];
        }
      }
      return t;
    }

    function gameOver() {
      done = true;
      mode = "aim";
      var total = totalScore();
      var best = lsGet("gb_bowl_best_" + diff(), 0);
      if (total > best) { best = total; lsSet("gb_bowl_best_" + diff(), best); }
      $("bwBest").textContent = best;
      $("bwFrame").textContent = "10/10";
      bwMsg.textContent = "Game over — final score " + total;
      banner(bwBanner, "Final score: <b>" + total + "</b>");
      beep(750, 0.3);
    }

    function nextBall(down) {
      frames[cur].push(down);
      $("bwScore").textContent = totalScore();
      var msg = null;
      if (frames[cur].length === 1 && down === 10) msg = "Strike! X";
      else if (frames[cur].length === 2 && frames[cur][0] + frames[cur][1] === 10) msg = "Spare! /";
      if (cur < 9) {
        if ((frames[cur].length === 1 && down === 10) || frames[cur].length === 2) {
          cur++;
          frames.push([]);
          pins = pinSpots();
        }
      } else {
        var f10 = frames[9];
        if (f10.length === 3) { if (msg) bwMsg.textContent = msg; gameOver(); return; }
        if (f10.length === 2) {
          if (f10[0] === 10) { if (f10[1] === 10) pins = pinSpots(); }
          else if (f10[0] + f10[1] === 10) pins = pinSpots();
          else { gameOver(); return; }
        } else if (f10.length === 1 && f10[0] === 10) pins = pinSpots();
      }
      bwMsg.textContent = msg ? msg : ("Frame " + (cur + 1) + " \u2014 ball " + (frames[cur].length + 1));
    }

    function allStopped() {
      if (Math.abs(ball.vx) > 0.12 || Math.abs(ball.vy) > 0.12) return false;
      for (var i = 0; i < pins.length; i++) {
        var p = pins[i];
        if (p.gone) continue;
        if (Math.abs(p.vx) > 0.12 || Math.abs(p.vy) > 0.12) return false;
      }
      return true;
    }

    function resolveThrow() {
      mode = "aim";
      var down = 0;
      for (var i = 0; i < pins.length; i++) {
        var p = pins[i];
        if (p.gone) continue;
        var dx = p.x - p.ox, dy = p.y - p.oy;
        if (dx * dx + dy * dy > 25) { p.gone = true; down++; }
        else { p.ox = p.x; p.oy = p.y; p.vx = 0; p.vy = 0; }
      }
      ball.x = 180;
      ball.y = H - 30;
      ball.vx = 0;
      ball.vy = 0;
      ball.inGutter = false;
      hookA = 0;
      if (down > 0) beep(300 + down * 40, 0.1);
      nextBall(down);
      draw();
    }

    function step() {
      var i, j;
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.985;
      ball.vy *= 0.985;
      if (ball.x < GUT || ball.x > W - GUT) ball.inGutter = true;
      if (ball.inGutter) {
        ball.vx = 0;
        ball.x = ball.x < 180 ? GUT - 4 : W - GUT + 4;
      }
      if (hookA !== 0) {
        ball.vx += hookA;
        hookA *= 0.96;
        if (Math.abs(hookA) < 0.01) hookA = 0;
      }
      if (!ball.inGutter) {
        for (i = 0; i < pins.length; i++) {
          var p = pins[i];
          if (p.gone) continue;
          var ddx = p.x - ball.x, ddy = p.y - ball.y;
          var rr = BR + PR;
          if (ddx * ddx + ddy * ddy < rr * rr && (ddx !== 0 || ddy !== 0)) {
            var d = Math.sqrt(ddx * ddx + ddy * ddy);
            var nx = ddx / d, ny = ddy / d;
            var overlap = rr - d;
            p.x += nx * overlap * 0.7;
            p.y += ny * overlap * 0.7;
            var rvn = (p.vx - ball.vx) * nx + (p.vy - ball.vy) * ny;
            if (rvn < 0) {
              var ji = -(1.7) * rvn / (1 / 2 + 1 / 1);
              ball.vx -= (ji / 2) * nx;
              ball.vy -= (ji / 2) * ny;
              p.vx += ji * nx;
              p.vy += ji * ny;
            }
          }
        }
      }
      for (i = 0; i < pins.length; i++) {
        var p2 = pins[i];
        if (p2.gone) continue;
        p2.x += p2.vx;
        p2.y += p2.vy;
        p2.vx *= 0.94;
        p2.vy *= 0.94;
        if (p2.x < PR) { p2.x = PR; p2.vx = Math.abs(p2.vx) * 0.5; }
        if (p2.x > W - PR) { p2.x = W - PR; p2.vx = -Math.abs(p2.vx) * 0.5; }
        if (p2.y < PR) { p2.y = PR; p2.vy = Math.abs(p2.vy) * 0.5; }
      }
      for (i = 0; i < pins.length; i++) {
        for (j = i + 1; j < pins.length; j++) {
          var a = pins[i], b = pins[j];
          if (a.gone || b.gone) continue;
          var ddx2 = b.x - a.x, ddy2 = b.y - a.y;
          var d3 = Math.sqrt(ddx2 * ddx2 + ddy2 * ddy2);
          var rr2 = PR + PR;
          if (d3 < rr2 && d3 > 0.001) {
            var nx2 = ddx2 / d3, ny2 = ddy2 / d3;
            var overlap2 = rr2 - d3;
            a.x -= nx2 * overlap2 * 0.5;
            a.y -= ny2 * overlap2 * 0.5;
            b.x += nx2 * overlap2 * 0.5;
            b.y += ny2 * overlap2 * 0.5;
            var rvn2 = (b.vx - a.vx) * nx2 + (b.vy - a.vy) * ny2;
            if (rvn2 < 0) {
              var j3 = -(1.55) * rvn2 / 2;
              a.vx -= j3 * nx2;
              a.vy -= j3 * ny2;
              b.vx += j3 * nx2;
              b.vy += j3 * ny2;
            }
          }
        }
      }
      throwT++;
    }

    function loop() {
      if (mode !== "roll") { raf = null; return; }
      step();
      if (allStopped() || throwT > 300 || ball.y < -30) {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        resolveThrow();
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function evPos(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return [(cx - rect.left) * (W / rect.width), (cy - rect.top) * (H / rect.height)];
    }

    function press(e) {
      if (mode !== "aim" || done) return;
      var pt = evPos(e);
      aim = { x: pt[0], y: pt[1] };
    }
    function move(e) {
      if (!aim) return;
      var pt = evPos(e);
      aim.x = pt[0];
      aim.y = pt[1];
      draw();
    }
    function release() {
      if (!aim || mode !== "aim" || done) { aim = null; return; }
      var c = cfg();
      var dx = ball.x - aim.x, dy = ball.y - aim.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 14 || dy > -10) { aim = null; return; }
      var p = Math.min(len, 120) / 120;
      var speed = 4 + p * 8;
      var ang = Math.atan2(dy, dx) + (Math.random() - 0.5) * 2 * c.wobble;
      ball.vx = Math.cos(ang) * speed;
      ball.vy = Math.sin(ang) * speed;
      hookA = (ball.vx > 0 ? -1 : 1) * c.hook * 0.06;
      mode = "roll";
      throwT = 0;
      aim = null;
      beep(260, 0.08);
      raf = requestAnimationFrame(loop);
    }

    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#141a21";
      ctx.fillRect(0, 0, GUT - 6, H);
      ctx.fillRect(W - GUT + 6, 0, GUT - 6, H);
      ctx.fillStyle = "#232c37";
      ctx.fillRect(GUT - 6, 0, W - 2 * (GUT - 6), H);
      if (aim) {
        var dx = ball.x - aim.x, dy = ball.y - aim.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len > 4) {
          var p = Math.min(len, 120) / 120;
          ctx.strokeStyle = "rgba(74,222,128,0.9)";
          ctx.lineWidth = 2 + p * 4;
          ctx.beginPath();
          ctx.moveTo(ball.x, ball.y);
          ctx.lineTo(ball.x + dx / len * p * 140, ball.y + dy / len * p * 140);
          ctx.stroke();
        }
      }
      for (var i = 0; i < pins.length; i++) {
        var pin = pins[i];
        if (pin.gone) continue;
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, PR, 0, Math.PI * 2);
        ctx.fillStyle = "#e8edf2";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#f87171";
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
      ctx.strokeStyle = "#7dd3fc";
      ctx.stroke();
    }

    function reset() {
      frames = [[]];
      cur = 0;
      mode = "aim";
      done = false;
      ball = { x: 180, y: H - 30, vx: 0, vy: 0, inGutter: false };
      pins = pinSpots();
      aim = null;
      hookA = 0;
      var best = lsGet("gb_bowl_best_" + diff(), 0);
      $("bwBest").textContent = best ? best : "\u2014";
      $("bwScore").textContent = "0";
      $("bwFrame").textContent = "1/10";
      bwMsg.textContent = "Drag back from the ball to aim, release to throw.";
      hideBanner(bwBanner);
      draw();
    }

    canvas.addEventListener("touchstart", function (e) { e.preventDefault(); press(e); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); move(e); }, { passive: false });
    canvas.addEventListener("touchend", function (e) { e.preventDefault(); release(); }, { passive: false });
    canvas.addEventListener("mousedown", function (e) { press(e); });
    canvas.addEventListener("mousemove", function (e) { if (aim) move(e); });
    canvas.addEventListener("mouseup", function () { if (aim) release(); });
    stopFns.bowl = function () {
      mode = "aim";
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    $("bwNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 58. MINI GOLF ============ */
  (function () {
    var canvas = $("glCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var glMsg = $("glMsg");
    var glBanner = $("glBanner");
    var BR = 7;

    // [teeX, teeY, holeX, holeY, par], walls as [x, y, w, h]
    var HOLES = [
      { tee: [180, 320], hole: [180, 60], walls: [], par: 2 },
      { tee: [60, 300], hole: [300, 60], walls: [[120, 150, 120, 14]], par: 3 },
      { tee: [180, 310], hole: [180, 120], walls: [[60, 200, 118, 14], [182, 200, 118, 14]], par: 3 },
      { tee: [60, 60], hole: [300, 300], walls: [[90, 180, 180, 14]], par: 3 },
      { tee: [180, 300], hole: [90, 80], walls: [[30, 160, 14, 120], [180, 60, 160, 14]], par: 4 },
      { tee: [300, 300], hole: [60, 60], walls: [[120, 100, 14, 140], [120, 240, 140, 14]], par: 4 },
      { tee: [180, 320], hole: [180, 60], walls: [[150, 150, 60, 60]], par: 4 },
      { tee: [60, 300], hole: [300, 60], walls: [[60, 120, 200, 14], [200, 200, 14, 130]], par: 4 },
      { tee: [180, 300], hole: [100, 60], walls: [[0, 130, 230, 14], [230, 130, 14, 150]], par: 5 },
      { tee: [300, 320], hole: [60, 320], walls: [[80, 80, 14, 180], [80, 260, 200, 14], [266, 80, 14, 180]], par: 5 },
      { tee: [60, 60], hole: [60, 300], walls: [[120, 0, 14, 200], [120, 240, 14, 120], [230, 120, 130, 14]], par: 5 },
      { tee: [180, 300], hole: [180, 80], walls: [[0, 120, 240, 14], [120, 200, 240, 14]], par: 5 }
    ];

    var order, hi, strokes, total, ball, aim, raf, mode, done;

    function cfg() { return DP.golf[diff()]; }
    function hole() { return HOLES[order[hi]]; }

    function setupHole() {
      var hz = hole();
      ball = { x: hz.tee[0], y: hz.tee[1], vx: 0, vy: 0 };
      aim = null;
      strokes = 0;
      $("glHole").textContent = (hi + 1) + "/9";
      $("glStrokes").textContent = "0";
      $("glPar").textContent = hz.par;
      glMsg.textContent = "Hole " + (hi + 1) + " \u2014 par " + hz.par + ". Drag back to aim.";
      hideBanner(glBanner);
      draw();
    }

    function endGame() {
      done = true;
      mode = "aim";
      var best = lsGet("gb_golf_best_" + diff(), 0);
      if (!best || total < best) { best = total; lsSet("gb_golf_best_" + diff(), best); }
      $("glBest").textContent = best;
      glMsg.textContent = "Round done — " + total + " strokes.";
      banner(glBanner, "9 holes in <b>" + total + "</b> strokes!");
      beep(750, 0.3);
    }

    function sinkHole() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      mode = "aim";
      beep(700, 0.15);
      total += strokes;
      var hz = hole();
      var df = strokes - hz.par;
      var msg;
      if (strokes === 1) msg = "Hole in one! &#127881;";
      else if (df <= -2) msg = "Eagle!";
      else if (df === -1) msg = "Birdie!";
      else if (df === 0) msg = "Par.";
      else msg = "Bogey (+" + df + ").";
      glMsg.textContent = msg;
      hi++;
      if (hi >= 9) { endGame(); return; }
      setTimeout(function () { if (!done) setupHole(); }, 900);
    }

    function step() {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.985;
      ball.vy *= 0.985;
      if (ball.x < BR) { ball.x = BR; ball.vx = -ball.vx * 0.8; }
      if (ball.x > W - BR) { ball.x = W - BR; ball.vx = -ball.vx * 0.8; }
      if (ball.y < BR) { ball.y = BR; ball.vy = -ball.vy * 0.8; }
      if (ball.y > H - BR) { ball.y = H - BR; ball.vy = -ball.vy * 0.8; }
      var hz = hole();
      for (var i = 0; i < hz.walls.length; i++) {
        var w2 = hz.walls[i];
        var cx2 = Math.max(w2[0], Math.min(ball.x, w2[0] + w2[2]));
        var cy2 = Math.max(w2[1], Math.min(ball.y, w2[1] + w2[3]));
        var ddx = ball.x - cx2, ddy = ball.y - cy2;
        var d2 = ddx * ddx + ddy * ddy;
        if (d2 < BR * BR && d2 > 0.0001) {
          var d = Math.sqrt(d2);
          var nx = ddx / d, ny = ddy / d;
          ball.x = cx2 + nx * BR;
          ball.y = cy2 + ny * BR;
          var rvn = ball.vx * nx + ball.vy * ny;
          if (rvn < 0) {
            ball.vx -= 2 * rvn * nx * 0.85;
            ball.vy -= 2 * rvn * ny * 0.85;
          }
        }
      }
      var dxh = ball.x - hz.hole[0], dyh = ball.y - hz.hole[1];
      var rad = cfg().rad;
      var sp = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (dxh * dxh + dyh * dyh < rad * rad && sp < 2.6) {
        sinkHole();
        return;
      }
    }

    function loop() {
      if (mode !== "roll") { raf = null; return; }
      step();
      if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1) {
        mode = "aim";
        ball.vx = 0;
        ball.vy = 0;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        draw();
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function evPos(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return [(cx - rect.left) * (W / rect.width), (cy - rect.top) * (H / rect.height)];
    }

    function press(e) {
      if (mode !== "aim" || done) return;
      var pt = evPos(e);
      aim = { x: pt[0], y: pt[1] };
    }
    function move(e) {
      if (!aim) return;
      var pt = evPos(e);
      aim.x = pt[0];
      aim.y = pt[1];
      draw();
    }
    function release() {
      if (!aim || mode !== "aim" || done) { aim = null; return; }
      var dx = ball.x - aim.x, dy = ball.y - aim.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 10) { aim = null; return; }
      var p = Math.min(len, 110) / 110;
      var speed = 1.5 + p * 8.5;
      ball.vx = dx / len * speed;
      ball.vy = dy / len * speed;
      strokes++;
      $("glStrokes").textContent = strokes;
      beep(420, 0.06);
      aim = null;
      mode = "roll";
      raf = requestAnimationFrame(loop);
    }

    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#14532d";
      ctx.fillRect(2, 2, W - 4, H - 4);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      for (var y = 0; y < H; y += 24) ctx.fillRect(0, y, W, 12);
      var hz = hole();
      ctx.fillStyle = "#7a5230";
      for (var i = 0; i < hz.walls.length; i++) {
        var w2 = hz.walls[i];
        ctx.fillRect(w2[0], w2[1], w2[2], w2[3]);
      }
      ctx.beginPath();
      ctx.arc(hz.hole[0], hz.hole[1], cfg().rad, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.strokeStyle = "#e8edf2";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (aim) {
        var dx = ball.x - aim.x, dy = ball.y - aim.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len > 4) {
          var p = Math.min(len, 110) / 110;
          ctx.strokeStyle = "rgba(232,237,242,0.85)";
          ctx.lineWidth = 2 + p * 4;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          ctx.moveTo(ball.x, ball.y);
          ctx.lineTo(ball.x + dx / len * p * 130, ball.y + dy / len * p * 130);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();
    }

    function reset() {
      var c = cfg();
      order = [];
      for (var i = 0; i < 9; i++) order.push((c.start + i) % HOLES.length);
      hi = 0;
      strokes = 0;
      total = 0;
      mode = "aim";
      done = false;
      var best = lsGet("gb_golf_best_" + diff(), 0);
      $("glBest").textContent = best ? best : "\u2014";
      setupHole();
    }

    canvas.addEventListener("touchstart", function (e) { e.preventDefault(); press(e); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); move(e); }, { passive: false });
    canvas.addEventListener("touchend", function (e) { e.preventDefault(); release(); }, { passive: false });
    canvas.addEventListener("mousedown", function (e) { press(e); });
    canvas.addEventListener("mousemove", function (e) { if (aim) move(e); });
    canvas.addEventListener("mouseup", function () { if (aim) release(); });
    stopFns.golf = function () {
      mode = "aim";
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    $("glNew").addEventListener("click", reset);
    reset();
  })();

  /* ============ 59. FRUIT SLASH ============ */
  (function () {
    var canvas = $("fsCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var fsBanner = $("fsBanner");

    var COLORS = ["#f87171", "#fb923c", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa"];
    var fruits, halves, blade, drawing, lives, score, comboTimes, spawnT, playing, raf;

    function cfg() { return DP.slice[diff()]; }

    function pointSeg(px, py, x1, y1, x2, y2) {
      var dx = x2 - x1, dy = y2 - y1;
      var l2 = dx * dx + dy * dy;
      if (l2 < 0.0001) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
      var t = ((px - x1) * dx + (py - y1) * dy) / l2;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var cx = x1 + t * dx, cy = y1 + t * dy;
      return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
    }

    function spawn() {
      var c = cfg();
      var bomb = Math.random() < c.bomb;
      var x = 40 + Math.random() * (W - 80);
      fruits.push({
        x: x, y: H + 20,
        vx: (Math.random() - 0.5) * 3.4,
        vy: -(9 + Math.random() * 3.5) * c.speed,
        r: bomb ? 13 : 15 + Math.random() * 4,
        bomb: bomb,
        col: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    function endGame() {
      playing = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      var best = lsGet("gb_slice_best_" + diff(), 0);
      if (score > best) { best = score; lsSet("gb_slice_best_" + diff(), best); }
      $("fsBest").textContent = best;
      banner(fsBanner, "Score: <b>" + score + "</b>");
      beep(200, 0.3);
      $("fsStart").textContent = "Restart";
    }

    function sliceAt(x, y) {
      if (!playing) return;
      blade.push({ x: x, y: y });
      var prev = blade.length >= 2 ? blade[blade.length - 2] : null;
      if (!prev) return;
      var now = Date.now();
      var hit = false;
      for (var i = fruits.length - 1; i >= 0; i--) {
        var f = fruits[i];
        var d = pointSeg(f.x, f.y, prev.x, prev.y, x, y);
        if (d < f.r + 4) {
          if (f.bomb) {
            beep(120, 0.3);
            endGame();
            return;
          }
          hit = true;
          fruits.splice(i, 1);
          score++;
          comboTimes.push(now);
          halves.push({ x: f.x - 4, y: f.y, vx: f.vx - 2, vy: f.vy - 1, col: f.col, life: 30 });
          halves.push({ x: f.x + 4, y: f.y, vx: f.vx + 2, vy: f.vy - 1, col: f.col, life: 30 });
        }
      }
      if (hit) {
        while (comboTimes.length && now - comboTimes[0] > 900) comboTimes.shift();
        if (comboTimes.length >= 3) {
          score += comboTimes.length - 2;
          $("fsCombo").textContent = "x" + comboTimes.length;
          beep(520 + comboTimes.length * 30, 0.06);
        } else {
          beep(480, 0.04);
        }
        $("fsScore").textContent = score;
      }
    }

    function loop() {
      if (!playing) { raf = null; return; }
      var c = cfg();
      spawnT++;
      if (spawnT * 16 >= c.spawn) { spawnT = 0; spawn(c); }
      var alive = [];
      var missed = false;
      for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.22;
        if (f.y < H + 40) alive.push(f);
        else if (!f.bomb) missed = true;
        else if (f.x < -40 || f.x > W + 40) { /* gone sideways, no penalty */ }
      }
      fruits = alive;
      for (var h = halves.length - 1; h >= 0; h--) {
        var hh = halves[h];
        hh.x += hh.vx;
        hh.y += hh.vy;
        hh.vy += 0.22;
        hh.life--;
        if (hh.life <= 0) halves.splice(h, 1);
      }
      if (!drawing && blade.length) blade.shift();
      else while (blade.length > 14) blade.shift();
      if (missed) {
        lives--;
        $("fsLives").textContent = lives;
        beep(200, 0.15);
        if (lives <= 0) { endGame(); return; }
      }
      draw();
      raf = requestAnimationFrame(loop);
    }

    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      for (var h = 0; h < halves.length; h++) {
        var hh = halves[h];
        ctx.beginPath();
        ctx.arc(hh.x, hh.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = hh.col;
        ctx.globalAlpha = Math.max(0.1, hh.life / 30);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      for (var i = 0; i < fruits.length; i++) {
        var f = fruits[i];
        if (f.bomb) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = "#101418";
          ctx.fill();
          ctx.strokeStyle = "#5c6b7a";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.strokeStyle = "#f87171";
          ctx.beginPath();
          ctx.moveTo(f.x + f.r * 0.5, f.y - f.r * 0.5);
          ctx.lineTo(f.x + f.r + 5, f.y - f.r - 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = f.col;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(f.x - f.r * 0.25, f.y - f.r * 0.25, f.r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fill();
        }
      }
      if (blade.length > 1) {
        ctx.strokeStyle = "rgba(232,237,242,0.9)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(blade[0].x, blade[0].y);
        for (var b = 1; b < blade.length; b++) ctx.lineTo(blade[b].x, blade[b].y);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    }

    function startGame() {
      reset();
      playing = true;
      $("fsStart").textContent = "Restart";
      raf = requestAnimationFrame(loop);
    }

    function reset() {
      fruits = [];
      halves = [];
      blade = [];
      drawing = false;
      lives = 3;
      score = 0;
      comboTimes = [];
      spawnT = 0;
      playing = false;
      var best = lsGet("gb_slice_best_" + diff(), 0);
      $("fsBest").textContent = best ? best : "\u2014";
      $("fsScore").textContent = "0";
      $("fsCombo").textContent = "x0";
      $("fsLives").textContent = "3";
      hideBanner(fsBanner);
      draw();
    }

    function evPos(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return [(cx - rect.left) * (W / rect.width), (cy - rect.top) * (H / rect.height)];
    }

    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      var pt = evPos(e);
      blade = [{ x: pt[0], y: pt[1] }];
      drawing = true;
    }, { passive: false });
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (drawing) { var pt = evPos(e); sliceAt(pt[0], pt[1]); }
    }, { passive: false });
    canvas.addEventListener("touchend", function (e) { e.preventDefault(); drawing = false; }, { passive: false });
    canvas.addEventListener("mousedown", function (e) { var pt = evPos(e); blade = [{ x: pt[0], y: pt[1] }]; drawing = true; });
    canvas.addEventListener("mousemove", function (e) { if (drawing) { var pt = evPos(e); sliceAt(pt[0], pt[1]); } });
    canvas.addEventListener("mouseup", function () { drawing = false; });
    stopFns.slice = function () {
      playing = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    $("fsStart").addEventListener("click", startGame);
    reset();
  })();

  /* ============ 60. RHYTHM TILES ============ */
  (function () {
    var canvas = $("ptCanvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var ptBanner = $("ptBanner");

    var LANES = 4, LW = W / LANES, TH = 110, LINE = H - 90;
    var tiles, speed, spawnT, spawnEvery, score, combo, playing, raf, lastLane;

    function cfg() { return DP.tiles[diff()]; }

    function roundRect(c2, x, y, w2, h2, r) {
      c2.beginPath();
      c2.moveTo(x + r, y);
      c2.arcTo(x + w2, y, x + w2, y + h2, r);
      c2.arcTo(x + w2, y + h2, x, y + h2, r);
      c2.arcTo(x, y + h2, x, y, r);
      c2.arcTo(x, y, x + w2, y, r);
      c2.closePath();
    }

    function spawnTile() {
      var lane;
      do { lane = Math.floor(Math.random() * LANES); } while (lane === lastLane);
      lastLane = lane;
      tiles.push({ lane: lane, y: -TH });
    }

    function endGame() {
      playing = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      var best = lsGet("gb_tiles_best_" + diff(), 0);
      if (score > best) { best = score; lsSet("gb_tiles_best_" + diff(), best); }
      $("ptBest").textContent = best;
      banner(ptBanner, "Score: <b>" + score + "</b> tiles");
      beep(200, 0.3);
      $("ptStart").textContent = "Restart";
    }

    function tap(lane) {
      if (!playing) return;
      var hit = -1;
      for (var i = 0; i < tiles.length; i++) {
        var t2 = tiles[i];
        if (t2.lane !== lane) continue;
        if (t2.y + TH > LINE - 45 && t2.y < LINE + 45) { hit = i; break; }
      }
      if (hit < 0) { endGame(); return; }
      tiles.splice(hit, 1);
      score++;
      combo++;
      $("ptScore").textContent = score;
      $("ptCombo").textContent = "x" + combo;
      beep(Math.min(880, 440 + combo * 25), 0.05);
    }

    function loop() {
      if (!playing) { raf = null; return; }
      speed += cfg().acc;
      spawnT++;
      if (spawnT >= spawnEvery) { spawnT = 0; spawnTile(); }
      var alive = [];
      for (var i = 0; i < tiles.length; i++) {
        var t2 = tiles[i];
        t2.y += speed;
        if (t2.y > H) { endGame(); return; }
        alive.push(t2);
      }
      tiles = alive;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function draw() {
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#232c37";
      ctx.lineWidth = 2;
      for (var l = 1; l < LANES; l++) {
        ctx.beginPath();
        ctx.moveTo(l * LW, 0);
        ctx.lineTo(l * LW, H);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(74,222,128,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, LINE);
      ctx.lineTo(W, LINE);
      ctx.stroke();
      for (var i = 0; i < tiles.length; i++) {
        var t2 = tiles[i];
        var x = t2.lane * LW + 8;
        ctx.fillStyle = "#101418";
        ctx.strokeStyle = (t2.y + TH > LINE - 45 && t2.y < LINE + 45) ? "#4ade80" : "#e8edf2";
        ctx.lineWidth = 2;
        roundRect(ctx, x + 2, t2.y, LW - 12, TH, 10);
        ctx.fill();
        ctx.stroke();
      }
      ctx.lineWidth = 1;
    }

    function startGame() {
      reset();
      playing = true;
      $("ptStart").textContent = "Restart";
      raf = requestAnimationFrame(loop);
    }

    function reset() {
      tiles = [];
      speed = cfg().speed;
      spawnT = 0;
      spawnEvery = Math.round(560 / cfg().density / 16);
      score = 0;
      combo = 0;
      playing = false;
      lastLane = -1;
      var best = lsGet("gb_tiles_best_" + diff(), 0);
      $("ptBest").textContent = best ? best : "\u2014";
      $("ptScore").textContent = "0";
      $("ptCombo").textContent = "x0";
      hideBanner(ptBanner);
      draw();
    }

    function evPos(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return [(cx - rect.left) * (W / rect.width), (cy - rect.top) * (H / rect.height)];
    }

    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      var pt = evPos(e);
      tap(Math.max(0, Math.min(LANES - 1, Math.floor(pt[0] / LW))));
    }, { passive: false });
    canvas.addEventListener("mousedown", function (e) {
      var pt = evPos(e);
      tap(Math.max(0, Math.min(LANES - 1, Math.floor(pt[0] / LW))));
    });
    document.addEventListener("keydown", function (e) {
      if (current !== "tiles" || !playing) return;
      var lane = -1;
      if (e.key === "d" || e.key === "D") lane = 0;
      if (e.key === "f" || e.key === "F") lane = 1;
      if (e.key === "j" || e.key === "J") lane = 2;
      if (e.key === "k" || e.key === "K") lane = 3;
      if (lane >= 0) { e.preventDefault(); tap(lane); }
    });
    stopFns.tiles = function () {
      playing = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    $("ptStart").addEventListener("click", startGame);
    reset();
  })();

  /* ============ 61. YAHTZEE ============ */
  (function () {
    var yzMsg = $("yzMsg");
    var yzBanner = $("yzBanner");

    var PIPS = [
      [],
      [4],
      [0, 8],
      [0, 4, 8],
      [0, 2, 6, 8],
      [0, 2, 4, 6, 8],
      [0, 2, 3, 5, 6, 8]
    ];
    var CATS = [
      ["Ones", 1], ["Twos", 2], ["Threes", 3], ["Fours", 4], ["Fives", 5], ["Sixes", 6],
      ["3 of a Kind", 7], ["4 of a Kind", 8], ["Full House", 9], ["Sm Straight", 10], ["Lg Straight", 11], ["Yahtzee", 12], ["Chance", 13]
    ];

    var dice, keep, rollsLeft, rollsMax, turn, scores, bonusCnt, done;

    function cfg() { return DP.yaht[diff()]; }

    function totalScore() {
      var t = 0, up = 0;
      for (var k in scores) {
        t += scores[k];
        if (Number(k) <= 6) up += scores[k];
      }
      if (up >= 63) t += 35;
      t += bonusCnt * 100;
      return t;
    }

    function updateHud() {
      $("yzTotal").textContent = totalScore();
      $("yzRolls").textContent = (rollsMax - rollsLeft) + "/" + rollsMax;
    }

    function counts() {
      var c = [0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 5; i++) c[dice[i]]++;
      return c;
    }

    function catScore(cat) {
      var d = dice.slice().sort(function (a, b) { return a - b; });
      var c = counts();
      var sum = dice[0] + dice[1] + dice[2] + dice[3] + dice[4];
      if (cat >= 1 && cat <= 6) return c[cat] * cat;
      if (cat === 7 || cat === 8) {
        var need = cat === 7 ? 3 : 4;
        for (var v = 1; v <= 6; v++) if (c[v] >= need) return sum;
        return 0;
      }
      if (cat === 9) {
        var has3 = false, has2 = false;
        for (var v2 = 1; v2 <= 6; v2++) { if (c[v2] === 3) has3 = true; if (c[v2] === 2) has2 = true; }
        return (has3 && has2) ? 25 : 0;
      }
      if (cat === 10 || cat === 11) {
        var uniq = [];
        for (var i3 = 0; i3 < 5; i3++) if (!i3 || d[i3] !== d[i3 - 1]) uniq.push(d[i3]);
        var run = 1, best = 1;
        for (var i4 = 1; i4 < uniq.length; i4++) {
          if (uniq[i4] === uniq[i4 - 1] + 1) { run++; if (run > best) best = run; }
          else run = 1;
        }
        if (cat === 10) return best >= 4 ? 30 : 0;
        return best >= 5 ? 40 : 0;
      }
      if (cat === 12) { for (var v3 = 1; v3 <= 6; v3++) if (c[v3] === 5) return 50; return 0; }
      if (cat === 13) return sum;
      return 0;
    }

    function scoreCat(cat) {
      if (done) return;
      if (scores.hasOwnProperty(cat)) return;
      if (rollsLeft === rollsMax) { yzMsg.textContent = "Roll the dice first."; beep(200, 0.05); return; }
      var c = counts();
      var yahtz = false;
      for (var v = 1; v <= 6; v++) if (c[v] === 5) yahtz = true;
      if (yahtz && cat !== 12 && scores.hasOwnProperty(12) && scores[12] === 50) {
        bonusCnt++;
        yzMsg.textContent = "Yahtzee bonus! +100";
        beep(880, 0.15);
      }
      var s = catScore(cat);
      scores[cat] = s;
      turn++;
      beep(s > 0 ? 600 : 220, 0.1);
      if (turn >= 13) { endGame(); return; }
      rollsLeft = rollsMax;
      keep = [false, false, false, false, false];
      yzMsg.textContent = s > 0 ? ("Scored " + s + " — roll the next round.") : "Zeroed — roll the next round.";
      updateHud();
      render();
    }

    function endGame() {
      done = true;
      updateHud();
      var t = totalScore();
      var best = lsGet("gb_yaht_best_" + diff(), 0);
      if (t > best) { best = t; lsSet("gb_yaht_best_" + diff(), best); }
      $("yzBest").textContent = best;
      yzMsg.textContent = "Game over — final total " + t + ".";
      banner(yzBanner, "Final total: <b>" + t + "</b>");
      beep(750, 0.3);
      render();
    }

    function toggleKeep(i) {
      if (done || rollsLeft >= rollsMax || rollsLeft <= 0) return;
      keep[i] = !keep[i];
      beep(440, 0.03);
      render();
    }

    function rollDice() {
      if (done) return;
      if (rollsLeft <= 0) { yzMsg.textContent = "No rolls left — pick a category to score."; beep(200, 0.05); return; }
      rollsLeft--;
      for (var i = 0; i < 5; i++) {
        if (!keep[i]) dice[i] = 1 + Math.floor(Math.random() * 6);
      }
      beep(380 + Math.random() * 120, 0.08);
      yzMsg.textContent = rollsLeft > 0 ? "Tap dice to keep them, then Roll again — or score a category." : "Last roll — pick a category to score.";
      updateHud();
      render();
    }

    function render() {
      var yzDice = $("yzDice");
      yzDice.innerHTML = "";
      for (var i = 0; i < 5; i++) {
        (function (i) {
          var el = document.createElement("button");
          el.className = "yz-die" + (keep[i] ? " kept" : "");
          for (var p = 0; p < 9; p++) {
            var dot = document.createElement("span");
            dot.className = "yz-dot" + (PIPS[dice[i]].indexOf(p) >= 0 ? " on" : "");
            el.appendChild(dot);
          }
          el.addEventListener("click", function () { toggleKeep(i); });
          yzDice.appendChild(el);
        })(i);
      }
      var card = $("yzCard");
      card.innerHTML = "";
      for (var c = 0; c < CATS.length; c++) {
        (function (c) {
          var cat = CATS[c][1];
          var btn = document.createElement("button");
          btn.className = "yz-cat";
          var used = scores.hasOwnProperty(cat);
          if (used) btn.disabled = true;
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = used ? String(scores[cat]) : "";
          btn.appendChild(document.createTextNode(CATS[c][0]));
          btn.appendChild(sc);
          btn.addEventListener("click", function () { scoreCat(cat); });
          card.appendChild(btn);
        })(c);
      }
    }

    function reset() {
      dice = [1, 1, 1, 1, 1];
      keep = [false, false, false, false, false];
      rollsMax = cfg().rolls;
      rollsLeft = rollsMax;
      turn = 0;
      scores = {};
      bonusCnt = 0;
      done = false;
      var best = lsGet("gb_yaht_best_" + diff(), 0);
      $("yzBest").textContent = best ? best : "\u2014";
      updateHud();
      yzMsg.textContent = "Tap Roll to throw the dice.";
      hideBanner(yzBanner);
      render();
    }

    stopFns.yaht = function () {};
    $("yzNew").addEventListener("click", reset);
    $("yzRoll").addEventListener("click", rollDice);
    reset();
  })();

  /* ============ 62. ROULETTE ============ */
  (function () {
    var canvas = $("roWheel"), ctx = canvas.getContext("2d");
    var roMsg = $("roMsg");
    var roBanner = $("roBanner");

    var ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    var REDS = { 1: 1, 3: 1, 5: 1, 7: 1, 9: 1, 12: 1, 14: 1, 16: 1, 18: 1, 19: 1, 21: 1, 23: 1, 25: 1, 27: 1, 30: 1, 32: 1, 34: 1, 36: 1 };

    var coins, chipVal, bets, spinning, raf, spinT0, result, lastStaked;

    function cfg() { return DP.roul[diff()]; }
    function isRed(n) { return !!REDS[n]; }

    function updateCoins() {
      $("roCoins").textContent = coins;
      var best = lsGet("gb_roul_best_" + diff(), 0);
      if (coins > best) { best = coins; lsSet("gb_roul_best_" + diff(), best); }
      $("roBest").textContent = best;
      lsSet("gb_roul_coins", coins);
    }

    function placeBet(label) {
      if (spinning) return;
      if (coins < chipVal) { roMsg.textContent = "Not enough coins for that chip."; beep(200, 0.05); return; }
      coins -= chipVal;
      bets[label] = (bets[label] || 0) + chipVal;
      beep(500, 0.04);
      updateCoins();
      paintBets();
    }

    function paintBets() {
      var btns = $("roBoard").querySelectorAll("[data-bet]");
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        var amt = bets[b.getAttribute("data-bet")] || 0;
        var badge = b.querySelector(".ro-badge");
        if (amt > 0) {
          b.classList.add("has-bet");
          if (!badge) { badge = document.createElement("span"); badge.className = "ro-badge"; b.appendChild(badge); }
          badge.textContent = amt;
        } else {
          b.classList.remove("has-bet");
          if (badge) b.removeChild(badge);
        }
      }
    }

    function clearBets() {
      if (spinning) return;
      for (var k in bets) coins += bets[k];
      bets = {};
      beep(300, 0.05);
      updateCoins();
      paintBets();
      roMsg.textContent = "Bets cleared. Pick a chip, tap a bet, then Spin.";
    }

    function resolve(n) {
      var payout = 0;
      for (var label in bets) {
        var amt = bets[label];
        var mult = 0;
        if (label.charAt(0) === "n") {
          if (Number(label.substring(1)) === n) mult = 36;
        } else if (n > 0) {
          if (label === "red" && isRed(n)) mult = 2;
          if (label === "black" && !isRed(n)) mult = 2;
          if (label === "even" && n % 2 === 0) mult = 2;
          if (label === "odd" && n % 2 === 1) mult = 2;
          if (label === "lo" && n <= 18) mult = 2;
          if (label === "hi" && n >= 19) mult = 2;
          if (label === "d1" && n <= 12) mult = 3;
          if (label === "d2" && n >= 13 && n <= 24) mult = 3;
          if (label === "d3" && n >= 25) mult = 3;
          if (label === "c1" && n % 3 === 1) mult = 3;
          if (label === "c2" && n % 3 === 2) mult = 3;
          if (label === "c3" && n % 3 === 0) mult = 3;
        }
        if (mult > 0) payout += amt * mult;
      }
      bets = {};
      var net = payout - lastStaked;
      updateCoins();
      paintBets();
      var colorName = n === 0 ? "Green" : (isRed(n) ? "Red" : "Black");
      if (payout > 0) {
        roMsg.textContent = colorName + " " + n + " — won " + net + " coins!";
        beep(760, 0.2);
      } else {
        roMsg.textContent = colorName + " " + n + " — no luck this spin.";
        beep(220, 0.15);
      }
    }

    function drawWheel(t, res) {
      var cx = 110, cy = 110;
      ctx.fillStyle = "#0b0f13";
      ctx.fillRect(0, 0, 220, 220);
      var finalA = -(ORDER.indexOf(res) + 0.5) / 37 * 2 * Math.PI;
      var ease = 1 - Math.pow(1 - t, 3);
      var ang = finalA + (1 - ease) * 12 * Math.PI;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      for (var i = 0; i < 37; i++) {
        var a0 = i / 37 * 2 * Math.PI;
        var a1 = (i + 1) / 37 * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 100, a0, a1);
        ctx.closePath();
        var n = ORDER[i];
        ctx.fillStyle = n === 0 ? "#14532d" : (isRed(n) ? "#7f1d1d" : "#111827");
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a2129";
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(cx, 6);
      ctx.lineTo(cx - 8, 24);
      ctx.lineTo(cx + 8, 24);
      ctx.closePath();
      ctx.fill();
    }

    function spinFrame() {
      if (!spinning) { raf = null; return; }
      var t = (Date.now() - spinT0) / 2400;
      if (t >= 1) {
        spinning = false;
        raf = null;
        drawWheel(1, result);
        resolve(result);
        return;
      }
      drawWheel(t, result);
      raf = requestAnimationFrame(spinFrame);
    }

    function spin() {
      if (spinning) return;
      var keys = 0;
      for (var k in bets) keys++;
      if (keys === 0) { roMsg.textContent = "Place a bet first."; beep(200, 0.05); return; }
      spinning = true;
      lastStaked = 0;
      for (var k2 in bets) lastStaked += bets[k2];
      result = Math.floor(Math.random() * 37);
      spinT0 = Date.now();
      beep(300, 0.1);
      raf = requestAnimationFrame(spinFrame);
    }

    function reset() {
      chipVal = 1;
      bets = {};
      spinning = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      coins = lsGet("gb_roul_coins", cfg().chips);
      if (coins < 1) coins = cfg().chips;
      var best = lsGet("gb_roul_best_" + diff(), 0);
      $("roBest").textContent = best ? best : "\u2014";
      roMsg.textContent = "Pick a chip, tap a bet, then Spin.";
      hideBanner(roBanner);
      updateCoins();
      paintBets();
      drawWheel(0, 0);
    }

    var chipBtns = $("roChips").querySelectorAll(".ro-chip");
    for (var ci = 0; ci < chipBtns.length; ci++) {
      (function (ci) {
        chipBtns[ci].addEventListener("click", function () {
          for (var j = 0; j < chipBtns.length; j++) chipBtns[j].classList.remove("sel");
          chipBtns[ci].classList.add("sel");
          chipVal = Number(chipBtns[ci].getAttribute("data-v"));
          beep(440, 0.03);
        });
      })(ci);
    }
    var betBtns = $("roBoard").querySelectorAll("[data-bet]");
    for (var bi = 0; bi < betBtns.length; bi++) {
      (function (bi) {
        betBtns[bi].addEventListener("click", function () { placeBet(betBtns[bi].getAttribute("data-bet")); });
      })(bi);
    }
    stopFns.roul = function () {
      spinning = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    $("roNew").addEventListener("click", reset);
    $("roClear").addEventListener("click", clearBets);
    $("roSpin").addEventListener("click", spin);
    reset();
  })();

  /* ============ 63. WORD SEARCH ============ */
  (function () {
    var wsGrid = $("wsGrid");
    var wsMsg = $("wsMsg");
    var wsBanner = $("wsBanner");

    var THEMES = [
      ["CAT", "DOG", "LION", "TIGER", "EAGLE", "SHARK", "BEAR", "FOX", "WOLF", "HORSE", "MONKEY", "RABBIT", "SNAKE", "ELEPHANT", "DOLPHIN"],
      ["MARS", "JUPITER", "COMET", "ORBIT", "ROCKET", "STAR", "MOON", "VENUS", "SATURN", "NEPTUNE", "GALAXY", "ECLIPSE", "METEOR", "COSMOS", "NEBULA"],
      ["PIZZA", "BREAD", "APPLE", "CURRY", "RICE", "MANGO", "HONEY", "CHEESE", "PASTA", "SALAD", "LEMON", "BUTTER", "CACAO", "SOUP", "TACO"],
      ["GOAL", "KICK", "RUGBY", "TENNIS", "BOXING", "SKIING", "HOCKEY", "CRICKET", "GOLF", "SURF", "KART", "JUDO", "SWIM", "RUN", "LUGE"]
    ];
    var DIRS4 = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    var DIRS8 = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];

    var n, grid, marks, words, found, t0, timer, done, anchor, onPath;

    function cfg() { return DP.wsearch[diff()]; }
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }

    function placeWord(w, dirs) {
      for (var attempt = 0; attempt < 200; attempt++) {
        var d = dirs[Math.floor(Math.random() * dirs.length)];
        var r = Math.floor(Math.random() * n), c = Math.floor(Math.random() * n);
        var er = r + d[0] * (w.length - 1), ec = c + d[1] * (w.length - 1);
        if (er < 0 || er >= n || ec < 0 || ec >= n) continue;
        var ok = true;
        for (var k = 0; k < w.length; k++) {
          var cur = grid[r + d[0] * k][c + d[1] * k];
          if (cur !== "" && cur !== w.charAt(k)) { ok = false; break; }
        }
        if (!ok) continue;
        for (var k2 = 0; k2 < w.length; k2++) grid[r + d[0] * k2][c + d[1] * k2] = w.charAt(k2);
        return true;
      }
      return false;
    }

    function build() {
      var c = cfg();
      n = c.n;
      var dirs = c.dirs === 4 ? DIRS4 : DIRS8;
      var theme = THEMES[Math.floor(Math.random() * THEMES.length)];
      var pool = [];
      for (var i = 0; i < theme.length; i++) if (theme[i].length <= n - 1) pool.push(theme[i]);
      for (var tries = 0; tries < 40; tries++) {
        for (var s = pool.length - 1; s > 0; s--) { var j = Math.floor(Math.random() * (s + 1)); var tmp = pool[s]; pool[s] = pool[j]; pool[j] = tmp; }
        grid = [];
        for (var r = 0; r < n; r++) { var row = []; for (var cc = 0; cc < n; cc++) row.push(""); grid.push(row); }
        words = [];
        for (var w = 0; w < pool.length && words.length < c.words; w++) {
          if (placeWord(pool[w], dirs)) words.push(pool[w]);
        }
        if (words.length >= c.words) return true;
      }
      return false;
    }

    function updateFound() {
      $("wsFound").textContent = found.length + "/" + words.length;
      var wl = $("wsWords");
      wl.innerHTML = "";
      for (var i = 0; i < words.length; i++) {
        var sp = document.createElement("span");
        sp.className = "ws-word" + (found.indexOf(words[i]) >= 0 ? " found" : "");
        sp.textContent = words[i];
        wl.appendChild(sp);
      }
    }

    function winGame() {
      done = true;
      if (timer) { clearInterval(timer); timer = null; }
      var secs = Math.floor((Date.now() - t0) / 1000);
      var best = lsGet("gb_wsearch_best_" + diff(), 0);
      if (!best || secs < best) { best = secs; lsSet("gb_wsearch_best_" + diff(), best); }
      $("wsBest").textContent = fmt(best);
      wsMsg.textContent = "All words found!";
      banner(wsBanner, "All <b>" + words.length + "</b> words in " + fmt(secs) + "!");
      beep(750, 0.3);
      render();
    }

    function endSelect() {
      if (!anchor) return;
      var s = "";
      for (var i = 0; i < onPath.length; i++) s += grid[onPath[i][0]][onPath[i][1]];
      var rev = s.split("").reverse().join("");
      var hit = null;
      for (var i2 = 0; i2 < words.length; i2++) {
        if (found.indexOf(words[i2]) < 0 && (words[i2] === s || words[i2] === rev)) { hit = words[i2]; break; }
      }
      if (hit) {
        found.push(hit);
        for (var p = 0; p < onPath.length; p++) marks[onPath[p][0]][onPath[p][1]] = true;
        beep(700, 0.08);
        updateFound();
        anchor = null;
        onPath = [];
        if (found.length === words.length) { winGame(); return; }
      } else {
        if (s.length > 1) beep(200, 0.06);
        anchor = null;
        onPath = [];
      }
      render();
    }

    function cellFromEvent(e) {
      var t = e.touches ? e.touches[0] : null;
      var x = t ? t.clientX : e.clientX;
      var y = t ? t.clientY : e.clientY;
      var el = document.elementFromPoint(x, y);
      if (!el) return null;
      var c = el.closest ? el.closest(".ws-cell") : null;
      return c;
    }

    function startSelect(r, c) {
      if (done) return;
      anchor = [r, c];
      onPath = [anchor];
      beep(440, 0.03);
      render();
    }

    function extendSelect(r, c) {
      if (!anchor || done) return;
      var dr = r - anchor[0], dc = c - anchor[1];
      var aligned = (dr === 0 && dc !== 0) || (dr !== 0 && dc === 0) || (Math.abs(dr) === Math.abs(dc) && dr !== 0);
      if (!aligned) return;
      var len = Math.max(Math.abs(dr), Math.abs(dc));
      var sr = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
      var sc = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
      var path = [];
      for (var k = 0; k <= len; k++) path.push([anchor[0] + sr * k, anchor[1] + sc * k]);
      onPath = path;
      render();
    }

    function render() {
      wsGrid.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
      wsGrid.innerHTML = "";
      var onSet = {};
      for (var p = 0; p < onPath.length; p++) onSet[onPath[p][0] + "_" + onPath[p][1]] = true;
      for (var r = 0; r < n; r++) {
        for (var c = 0; c < n; c++) {
          (function (r, c) {
            var btn = document.createElement("button");
            btn.className = "ws-cell";
            if (marks[r][c]) btn.className += " hit";
            if (onSet[r + "_" + c]) btn.className += " on";
            btn.textContent = grid[r][c];
            btn.addEventListener("mousedown", function () { startSelect(r, c); });
            btn.addEventListener("mouseover", function () { extendSelect(r, c); });
            btn.addEventListener("touchstart", function (e) { e.preventDefault(); startSelect(r, c); }, { passive: false });
            btn.addEventListener("touchmove", function (e) {
              e.preventDefault();
              var cell = cellFromEvent(e);
              if (cell) extendSelect(Number(cell.getAttribute("data-r")), Number(cell.getAttribute("data-c")));
            }, { passive: false });
            btn.setAttribute("data-r", r);
            btn.setAttribute("data-c", c);
            wsGrid.appendChild(btn);
          })(r, c);
        }
      }
    }

    function reset() {
      build();
      marks = [];
      for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(false); marks.push(row); }
      var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (var r2 = 0; r2 < n; r2++)
        for (var c2 = 0; c2 < n; c2++)
          if (grid[r2][c2] === "") grid[r2][c2] = letters.charAt(Math.floor(Math.random() * 26));
      found = [];
      anchor = null;
      onPath = [];
      done = false;
      if (timer) { clearInterval(timer); timer = null; }
      t0 = Date.now();
      timer = setInterval(function () {
        if (!done) $("wsTime").textContent = fmt(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
      $("wsFound").textContent = "0/" + words.length;
      $("wsTime").textContent = "0:00";
      $("wsBest").textContent = fmt2best();
      wsMsg.textContent = "Drag from the first letter to the last to select a word.";
      hideBanner(wsBanner);
      updateFound();
      render();
    }

    function fmt2best() {
      var best = lsGet("gb_wsearch_best_" + diff(), 0);
      return best ? fmt(best) : "\u2014";
    }

    wsGrid.addEventListener("mouseup", function () { endSelect(); });
    wsGrid.addEventListener("touchend", function (e) { e.preventDefault(); endSelect(); }, { passive: false });
    stopFns.wsearch = function () { if (timer) { clearInterval(timer); timer = null; } };
    $("wsNew").addEventListener("click", reset);
    reset();
  })();
})();
