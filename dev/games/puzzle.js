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
    var path = hamiltonian(n) || snakePath(n);
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