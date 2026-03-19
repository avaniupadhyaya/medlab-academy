// ── HOSA NITRO RACE ──────────────────────────────────────────────────────────
var RACE_STATE = null;
var RACE_ANIM = null;

// Called by showScreen('race') in inline script
function renderRaceGame() {
  var evLabel = document.getElementById('raceEvLabel');
  var ev = window.EVENTS && window.S && window.EVENTS[window.S.currentEvent];
  if (evLabel) evLabel.textContent = ev ? ev.name : 'Select an event first';
  var sb = document.getElementById('raceScoreBadge');
  if (sb) sb.textContent = 'Score: 0';

  // Stop any running race
  if (RACE_ANIM) { cancelAnimationFrame(RACE_ANIM); RACE_ANIM = null; }
  RACE_STATE = null;

  // Size canvas
  var canvas = document.getElementById('raceTrack');
  if (canvas) { canvas.width = canvas.offsetWidth || 600; }

  showRaceLobby();
  drawIdleTrack();
}
window.renderRaceGame = renderRaceGame;

// ── LOBBY ────────────────────────────────────────────────────────────────────
function showRaceLobby() {
  var wrap = document.getElementById('raceQWrap');
  if (!wrap) return;
  var ev = window.EVENTS && window.S && window.EVENTS[window.S.currentEvent];
  var evName = ev ? ev.name : '(no event selected)';

  wrap.innerHTML =
    '<div style="text-align:center;padding:8px 0 16px;">' +
      '<div style="font-size:48px;margin-bottom:6px;">🏎️</div>' +
      '<div style="font-size:20px;font-weight:800;letter-spacing:2px;margin-bottom:4px;">NITRO RACE</div>' +
      '<div style="font-size:13px;color:var(--teal);font-weight:600;margin-bottom:16px;">Event: ' + evName + '</div>' +
      // Car lineup
      '<div style="display:flex;justify-content:center;gap:12px;margin-bottom:16px;">' +
        lobbyCarHTML('#00bcd4','YOU') +
        lobbyCarHTML('#e74c3c','Alex') +
        lobbyCarHTML('#f39c12','Sam') +
        lobbyCarHTML('#9b59b6','Jordan') +
        lobbyCarHTML('#2ecc71','Riley') +
      '</div>' +
      // Rules
      '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:12px;margin:0 auto 16px;max-width:320px;text-align:left;">' +
        '<div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">How to Race</div>' +
        '<div style="font-size:13px;line-height:1.8;">✅ Correct → <b>Speed boost + Nitro fills</b><br>' +
        '❌ Wrong → Slow down + Nitro drops<br>' +
        '🔥 Streak → <b>Multiplier bonus!</b><br>' +
        '📍 20 questions · Race 4 AI bots</div>' +
      '</div>' +
      '<button onclick="startNitroRace()" style="padding:14px 40px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:12px;font-size:17px;font-weight:800;cursor:pointer;font-family:var(--font);letter-spacing:2px;box-shadow:0 4px 20px rgba(0,188,212,0.4);">🚀 START RACE!</button>' +
    '</div>';
}

function lobbyCarHTML(color, name) {
  return '<div style="text-align:center;">' +
    '<div style="width:40px;height:18px;background:' + color + ';border-radius:5px;margin:0 auto 4px;box-shadow:0 2px 8px ' + color + '66;"></div>' +
    '<div style="font-size:9px;color:var(--muted);font-weight:600;">' + name + '</div></div>';
}

// ── START RACE ───────────────────────────────────────────────────────────────
function startNitroRace() {
  var ev = window.EVENTS && window.S && window.EVENTS[window.S.currentEvent];
  var questions = buildRaceQuestions(ev);

  if (!questions.length) {
    var wrap = document.getElementById('raceQWrap');
    if (wrap) wrap.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:14px;">⚠️ Select an event from the sidebar first, then come back to race!</div>';
    return;
  }

  RACE_STATE = {
    questions: questions,
    qIdx: 0,
    score: 0,
    streak: 0,
    nitro: 0,
    answered: false,
    selectedOpt: null,
    playerPos: 0,
    playerSpeed: 0,
    aiPos: [0, 0, 0, 0],
    aiSpeed: [0.55, 0.48, 0.43, 0.38],
    finishOrder: [],
    finished: false,
    startTime: Date.now(),
  };

  var sb = document.getElementById('raceScoreBadge');
  if (sb) sb.textContent = 'Score: 0';
  var nb = document.getElementById('nitroBar');
  if (nb) nb.style.width = '0%';
  var sl = document.getElementById('streakLabel');
  if (sl) sl.textContent = '🔥 x0';

  renderRaceQ();
  raceLoop();
}
window.startNitroRace = startNitroRace;

function buildRaceQuestions(ev) {
  if (!ev) return [];
  var pool = [];
  ['easy','medium','hard'].forEach(function(d) {
    var q = ev.getQuiz ? (ev.getQuiz(d) || []) : [];
    pool = pool.concat(q);
  });
  // shuffle
  for (var i = pool.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1));
    var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }
  return pool.slice(0, 20);
}

// ── RACE LOOP (animation) ────────────────────────────────────────────────────
function raceLoop() {
  if (!RACE_STATE || RACE_STATE.finished) return;

  // Move AI
  for (var i = 0; i < 4; i++) {
    if (RACE_STATE.aiPos[i] < 100) {
      RACE_STATE.aiPos[i] = Math.min(100, RACE_STATE.aiPos[i] + (RACE_STATE.aiSpeed[i] + (Math.random()-0.5)*0.15) * 0.4);
      if (RACE_STATE.aiPos[i] >= 100) {
        var aName = ['Alex','Sam','Jordan','Riley'][i];
        if (RACE_STATE.finishOrder.indexOf(aName) < 0) RACE_STATE.finishOrder.push(aName);
      }
    }
  }

  // Decay player speed
  RACE_STATE.playerSpeed = Math.max(0, RACE_STATE.playerSpeed * 0.96);
  RACE_STATE.playerPos = Math.min(100, RACE_STATE.playerPos + RACE_STATE.playerSpeed * 0.5);
  if (RACE_STATE.playerPos >= 100 && RACE_STATE.finishOrder.indexOf('YOU') < 0) {
    RACE_STATE.finishOrder.push('YOU');
  }

  // Draw
  drawRaceTrack();

  // Update nitro bar
  var nb = document.getElementById('nitroBar');
  if (nb) nb.style.width = Math.min(100, RACE_STATE.nitro) + '%';

  // End conditions
  var allFinished = RACE_STATE.finishOrder.length >= 5;
  var outOfQs = RACE_STATE.qIdx >= RACE_STATE.questions.length && RACE_STATE.answered;
  if (allFinished || outOfQs) {
    endNitroRace();
    return;
  }

  RACE_ANIM = requestAnimationFrame(raceLoop);
}

// ── DRAW TRACK ───────────────────────────────────────────────────────────────
function drawIdleTrack() {
  var canvas = document.getElementById('raceTrack');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 600;
  var ctx = canvas.getContext('2d');
  drawTrackBase(ctx, canvas.width, canvas.height, [
    {pos:0, color:'#00bcd4', name:'YOU'},
    {pos:0, color:'#e74c3c', name:'Alex'},
    {pos:0, color:'#f39c12', name:'Sam'},
    {pos:0, color:'#9b59b6', name:'Jordan'},
    {pos:0, color:'#2ecc71', name:'Riley'},
  ]);
}

function drawRaceTrack() {
  var canvas = document.getElementById('raceTrack');
  if (!canvas || !RACE_STATE) return;
  var ctx = canvas.getContext('2d');
  drawTrackBase(ctx, canvas.width, canvas.height, [
    {pos: RACE_STATE.playerPos, color:'#00bcd4', name:'YOU', spd: RACE_STATE.playerSpeed},
    {pos: RACE_STATE.aiPos[0], color:'#e74c3c', name:'Alex', spd: RACE_STATE.aiSpeed[0]},
    {pos: RACE_STATE.aiPos[1], color:'#f39c12', name:'Sam', spd: RACE_STATE.aiSpeed[1]},
    {pos: RACE_STATE.aiPos[2], color:'#9b59b6', name:'Jordan', spd: RACE_STATE.aiSpeed[2]},
    {pos: RACE_STATE.aiPos[3], color:'#2ecc71', name:'Riley', spd: RACE_STATE.aiSpeed[3]},
  ]);
}

function drawTrackBase(ctx, W, H, cars) {
  // Sky
  var sky = ctx.createLinearGradient(0,0,0,H*0.45);
  sky.addColorStop(0,'#04080f'); sky.addColorStop(1,'#0d1f3c');
  ctx.fillStyle = sky; ctx.fillRect(0,0,W,H*0.45);

  // Stars (fixed positions)
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  [17,43,71,109,137,163,199,229,257,293,311,347,373,401,443].forEach(function(s){
    ctx.fillRect((s*79)%W, (s*37)%(H*0.4), s%2+1, s%2+1);
  });

  // Road
  ctx.fillStyle = '#1a1a2a'; ctx.fillRect(0,H*0.42,W,H*0.58);

  // Road edge lines
  ctx.strokeStyle = 'rgba(0,188,212,0.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,H*0.42); ctx.lineTo(W,H*0.42); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0,H-2); ctx.lineTo(W,H-2); ctx.stroke();

  // Animated dash lines
  var dash = (Date.now()/40)%50;
  ctx.setLineDash([22,18]); ctx.lineDashOffset = -dash;
  [H*0.56, H*0.69, H*0.82].forEach(function(ly){
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(W,ly); ctx.stroke();
  });
  ctx.setLineDash([]);

  // Finish line (checkerboard)
  var fx = W - 26;
  for (var fi=0; fi<9; fi++) {
    ctx.fillStyle = fi%2===0 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)';
    ctx.fillRect(fx, H*0.43+fi*(H*0.063), 20, H*0.063);
  }

  // Cars
  var lanes = [H*0.48, H*0.59, H*0.68, H*0.77, H*0.86];
  cars.forEach(function(car, i) {
    var x = 18 + (Math.min(100, car.pos||0)/100) * (fx - 38);
    var y = lanes[i];
    var spd = car.spd || 0;

    // Speed trail
    if (spd > 0.5) {
      var tlen = Math.min(50, spd * 6);
      var g = ctx.createLinearGradient(x-tlen, y, x, y);
      g.addColorStop(0,'rgba('+hexRgb(car.color)+',0)');
      g.addColorStop(1,'rgba('+hexRgb(car.color)+',0.3)');
      ctx.fillStyle = g;
      ctx.fillRect(x-tlen, y-5, tlen, 10);
    }

    // Car body
    ctx.fillStyle = car.color;
    roundRect(ctx, x-18, y-7, 36, 14, 4); ctx.fill();

    // Cabin
    ctx.fillStyle = shade(car.color, -25);
    roundRect(ctx, x-5, y-11, 16, 8, 3); ctx.fill();

    // Windshield
    ctx.fillStyle = 'rgba(180,230,255,0.5)';
    roundRect(ctx, x+2, y-10, 8, 6, 2); ctx.fill();

    // Headlight glow
    ctx.shadowColor = '#ffe082'; ctx.shadowBlur = 6;
    ctx.fillStyle = '#fffde7';
    ctx.beginPath(); ctx.arc(x+18, y-2, 2.5, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(x+18, y+4, 2.5, 0, 6.28); ctx.fill();
    ctx.shadowBlur = 0;

    // Taillights
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x-20, y-4, 2, 4);
    ctx.fillRect(x-20, y+2, 2, 4);

    // Wheels
    ctx.fillStyle = '#111';
    [[x-10,y+7],[x+10,y+7]].forEach(function(w){
      ctx.beginPath(); ctx.arc(w[0],w[1],4,0,6.28); ctx.fill();
      ctx.fillStyle='#555'; ctx.beginPath(); ctx.arc(w[0],w[1],2,0,6.28); ctx.fill();
      ctx.fillStyle='#111';
    });

    // Name label
    ctx.fillStyle = car.name==='YOU' ? '#00bcd4' : 'rgba(255,255,255,0.6)';
    ctx.font = (car.name==='YOU'?'bold ':'')+'9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(car.name, x, y-13);
  });

  // Position indicator bottom bar
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, H-12, W, 12);
  if (RACE_STATE) {
    ctx.fillStyle = '#00bcd4';
    ctx.fillRect(0, H-12, (RACE_STATE.playerPos/100)*W, 12);
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('YOU: '+Math.round(RACE_STATE.playerPos)+'%  Q:'+(RACE_STATE.qIdx+1)+'/'+RACE_STATE.questions.length, 5, H-2);
  }
}

function hexRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(','); }
function shade(h, n){ return '#'+[1,3,5].map(function(i){return Math.max(0,Math.min(255,parseInt(h.slice(i,i+2),16)+n)).toString(16).padStart(2,'0');}).join(''); }
function roundRect(ctx,x,y,w,h,r){ if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}else{ctx.beginPath();ctx.rect(x,y,w,h);} }

// ── RENDER QUESTION ───────────────────────────────────────────────────────────
function renderRaceQ() {
  var wrap = document.getElementById('raceQWrap');
  if (!wrap || !RACE_STATE) return;

  if (RACE_STATE.qIdx >= RACE_STATE.questions.length) {
    wrap.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);font-size:14px;">🏁 All questions answered! Finishing race...</div>';
    RACE_STATE.answered = true;
    return;
  }

  var q = RACE_STATE.questions[RACE_STATE.qIdx];
  var opts = q.opts || q.options || [];
  var total = RACE_STATE.questions.length;
  var qNum = RACE_STATE.qIdx + 1;

  RACE_STATE.answered = false;
  RACE_STATE.selectedOpt = null;

  // Progress dots
  var dots = '';
  for (var d=0; d<total; d++) {
    var col = d < RACE_STATE.qIdx ? 'var(--teal)' : d === RACE_STATE.qIdx ? '#f39c12' : 'var(--surf2)';
    dots += '<div style="flex:1;height:4px;border-radius:2px;background:'+col+';"></div>';
  }

  var optHtml = opts.map(function(o, i){
    return '<div class="race-opt" data-i="'+i+'" style="padding:11px 14px;margin-bottom:8px;background:var(--surf2);border:2px solid var(--bord);border-radius:10px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;transition:border-color .1s,background .1s;">' +
      '<span style="min-width:24px;height:24px;border-radius:50%;background:var(--surf);border:1px solid var(--bord);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">'+['A','B','C','D'][i]+'</span>' +
      '<span>'+o+'</span></div>';
  }).join('');

  wrap.innerHTML =
    '<div style="display:flex;gap:3px;margin-bottom:10px;">' + dots + '</div>' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
      '<span style="font-size:11px;color:var(--muted);font-family:var(--mono);">Question '+qNum+' / '+total+'</span>' +
      '<span style="font-size:11px;color:var(--teal);font-family:var(--mono);">Score: '+RACE_STATE.score+'</span>' +
    '</div>' +
    '<div style="font-size:14px;font-weight:700;line-height:1.45;margin-bottom:14px;padding:12px 14px;background:var(--surf2);border-radius:10px;border-left:3px solid var(--teal);">' + q.q + '</div>' +
    '<div id="raceOpts">' + optHtml + '</div>' +
    '<button id="raceSubmitBtn" style="display:none;width:100%;padding:13px;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;margin-top:4px;font-family:var(--font);letter-spacing:1px;">⚡ SUBMIT!</button>' +
    '<div id="raceFeedback" style="display:none;padding:10px 12px;border-radius:9px;margin-top:8px;font-size:13px;"></div>';

  // Option clicks
  document.querySelectorAll('.race-opt').forEach(function(el){
    el.addEventListener('click', function(){
      if (RACE_STATE.answered) return;
      document.querySelectorAll('.race-opt').forEach(function(o){
        o.style.borderColor='var(--bord)'; o.style.background='var(--surf2)';
      });
      el.style.borderColor = '#f39c12';
      el.style.background = 'rgba(243,156,18,0.12)';
      RACE_STATE.selectedOpt = parseInt(el.dataset.i);
      document.getElementById('raceSubmitBtn').style.display = 'block';
    });
  });

  // Submit
  document.getElementById('raceSubmitBtn').addEventListener('click', function(){
    if (RACE_STATE.answered || RACE_STATE.selectedOpt === null) return;
    RACE_STATE.answered = true;
    var sel = RACE_STATE.selectedOpt;
    var correct = q.correct;
    var allOpts = document.querySelectorAll('.race-opt');
    document.getElementById('raceSubmitBtn').style.display = 'none';
    allOpts.forEach(function(o){ o.style.pointerEvents = 'none'; });
    var fb = document.getElementById('raceFeedback');

    if (sel === correct) {
      RACE_STATE.streak++;
      RACE_STATE.nitro = Math.min(100, RACE_STATE.nitro + 22);
      var boost = 2.5 + Math.min(RACE_STATE.streak * 0.6, 5);
      RACE_STATE.playerSpeed = Math.min(14, RACE_STATE.playerSpeed + boost);
      RACE_STATE.score += 100 + (RACE_STATE.streak > 1 ? RACE_STATE.streak * 30 : 0);
      allOpts[sel].style.borderColor = '#27ae60';
      allOpts[sel].style.background = 'var(--green-l)';
      var nitroFire = RACE_STATE.nitro >= 100 ? ' 🚀 NITRO!' : '';
      var streakMsg = RACE_STATE.streak > 1 ? ' 🔥 '+RACE_STATE.streak+'x STREAK!' : '';
      fb.style.cssText = 'display:block;padding:10px 12px;border-radius:9px;margin-top:8px;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);font-size:13px;';
      fb.innerHTML = '✅ <strong>Correct! +'+Math.round(boost)+' speed'+nitroFire+streakMsg+'</strong><br><span style="font-size:11px;opacity:0.8;">'+(q.explain||'')+'</span>';
      if (RACE_STATE.nitro >= 100) RACE_STATE.nitro = 0;
    } else {
      RACE_STATE.streak = 0;
      RACE_STATE.nitro = Math.max(0, RACE_STATE.nitro - 15);
      RACE_STATE.playerSpeed = Math.max(0, RACE_STATE.playerSpeed - 0.8);
      allOpts[sel].style.borderColor = '#e74c3c';
      allOpts[sel].style.background = 'rgba(231,76,60,0.12)';
      allOpts[correct].style.borderColor = '#27ae60';
      allOpts[correct].style.background = 'var(--green-l)';
      fb.style.cssText = 'display:block;padding:10px 12px;border-radius:9px;margin-top:8px;background:rgba(231,76,60,0.1);color:#c0392b;border:1px solid #e74c3c;font-size:13px;';
      fb.innerHTML = '❌ <strong>Wrong! Slowing down...</strong><br><span style="font-size:11px;opacity:0.8;">'+(q.explain||'')+'</span>';
    }

    // Update UI
    var sl = document.getElementById('streakLabel');
    if (sl) sl.textContent = '🔥 x' + RACE_STATE.streak;
    var sb = document.getElementById('raceScoreBadge');
    if (sb) sb.textContent = 'Score: ' + RACE_STATE.score;

    RACE_STATE.qIdx++;
    setTimeout(renderRaceQ, 1900);
  });
}

// ── END RACE ──────────────────────────────────────────────────────────────────
function endNitroRace() {
  if (!RACE_STATE) return;
  RACE_STATE.finished = true;
  if (RACE_ANIM) { cancelAnimationFrame(RACE_ANIM); RACE_ANIM = null; }

  ['Alex','Sam','Jordan','Riley','YOU'].forEach(function(n){
    if (RACE_STATE.finishOrder.indexOf(n) < 0) RACE_STATE.finishOrder.push(n);
  });

  var place = RACE_STATE.finishOrder.indexOf('YOU') + 1;
  var medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  var placeWords = ['1st','2nd','3rd','4th','5th'];
  var elapsed = Math.round((Date.now() - RACE_STATE.startTime) / 1000);

  if (window.addXP) window.addXP(Math.min(200, Math.floor(RACE_STATE.score/10) + (5-place)*15));

  var orderHTML = RACE_STATE.finishOrder.map(function(n, i){
    var isYou = n === 'YOU';
    return '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:4px;background:'+(isYou?'rgba(0,188,212,0.15)':'transparent')+';border:'+(isYou?'1px solid var(--teal)':'1px solid transparent')+';">' +
      '<span style="font-size:15px;">'+medals[i]+'</span>' +
      '<span style="font-size:13px;font-weight:'+(isYou?'800':'500')+';color:'+(isYou?'var(--teal)':'var(--txt)')+';">'+n+'</span>' +
      '</div>';
  }).join('');

  var wrap = document.getElementById('raceQWrap');
  if (!wrap) return;
  wrap.innerHTML =
    '<div style="text-align:center;padding:16px 8px;">' +
      '<div style="font-size:52px;margin-bottom:8px;">' + medals[place-1] + '</div>' +
      '<div style="font-size:20px;font-weight:800;margin-bottom:4px;">' + placeWords[place-1] + ' Place!</div>' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:16px;">' + (place===1?'🏆 Champion! You won the race!':place<=3?'Great race! Well done!':'Keep practicing to get faster!') + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:300px;margin:0 auto 16px;">' +
        sbox('🎯 Score', RACE_STATE.score) +
        sbox('🔥 Best Streak', 'x'+RACE_STATE.streak) +
        sbox('✅ Questions', RACE_STATE.qIdx+'/'+RACE_STATE.questions.length) +
        sbox('⏱️ Time', elapsed+'s') +
      '</div>' +
      '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:12px;max-width:300px;margin:0 auto 20px;text-align:left;">' +
        '<div style="font-size:10px;color:var(--muted);font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Finish Order</div>' +
        orderHTML +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">' +
        '<button onclick="startNitroRace()" style="padding:13px 28px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font);">🚀 Race Again!</button>' +
        '<button onclick="showScreen(\'home\')" style="padding:13px 20px;background:var(--surf2);color:var(--txt);border:1px solid var(--bord);border-radius:10px;font-size:13px;cursor:pointer;font-family:var(--font);">🏠 Home</button>' +
      '</div>' +
    '</div>';
}

function sbox(label, value) {
  return '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:10px;text-align:center;">' +
    '<div style="font-size:10px;color:var(--muted);margin-bottom:4px;">'+label+'</div>' +
    '<div style="font-size:17px;font-weight:800;">'+value+'</div></div>';
}
