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
