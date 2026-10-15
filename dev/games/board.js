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
