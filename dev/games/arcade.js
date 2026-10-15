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
