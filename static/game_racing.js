// ── HOSA NITRO RACE ─────────────────────────────────────────────────────────
// Nitro Type-inspired racing game. Answer questions to boost your car speed.
// Race 4 AI opponents. Wrong answer = slowdown. Streak = nitro boost!

var RACE_STATE = null;

function renderRaceGame() {
  var container = document.getElementById('raceContainer');
  if (!container) return;

  var ev = (window.EVENTS && window.S && window.EVENTS[window.S.currentEvent]) || null;
  var evName = ev ? ev.name : 'Pick an event first';

  container.innerHTML = [
    // Header
    '<div style="padding:10px 14px;border-bottom:1px solid var(--bord);display:flex;align-items:center;gap:10px;flex-shrink:0;background:var(--surf);">',
      '<button onclick="goBack()" style="background:var(--surf2);border:1px solid var(--bord);border-radius:7px;padding:7px 12px;font-size:13px;color:var(--muted);cursor:pointer;font-family:var(--font);">← Back</button>',
      '<div style="font-size:22px;">🏎️</div>',
      '<div><div style="font-weight:800;font-size:16px;letter-spacing:1px;">NITRO RACE</div>',
      '<div style="font-size:11px;color:var(--teal);">',evName,'</div></div>',
      '<div id="raceScoreBadge" style="margin-left:auto;background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:5px 12px;font-size:13px;font-weight:700;font-family:var(--mono);">Score: 0</div>',
    '</div>',
    // Track canvas
    '<canvas id="raceTrack" style="width:100%;height:180px;flex-shrink:0;display:block;background:#111;"></canvas>',
    // Nitro bar
    '<div style="padding:4px 14px 4px;background:var(--surf);border-bottom:1px solid var(--bord);flex-shrink:0;display:flex;align-items:center;gap:8px;">',
      '<span style="font-size:10px;color:#f39c12;font-weight:700;white-space:nowrap;">⚡ NITRO</span>',
      '<div style="flex:1;background:#1a1a2e;height:10px;border-radius:5px;overflow:hidden;border:1px solid #333;">',
        '<div id="nitroBar" style="height:100%;width:0%;background:linear-gradient(90deg,#f39c12,#e74c3c);border-radius:5px;transition:width 0.3s;"></div>',
      '</div>',
      '<span id="streakLabel" style="font-size:10px;color:#f39c12;font-weight:700;white-space:nowrap;">🔥 x1</span>',
    '</div>',
    // Question area
    '<div id="raceQWrap" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 14px;display:flex;flex-direction:column;"></div>',
  ].join('');

  // Get canvas and set real dimensions
  var canvas = document.getElementById('raceTrack');
  canvas.width = canvas.offsetWidth || 700;
  canvas.height = 180;

  showRaceLobby();
}

function showRaceLobby() {
  var ev = window.EVENTS && window.S && window.EVENTS[window.S.currentEvent];
  var evName = ev ? ev.name : 'no event selected';
  var wrap = document.getElementById('raceQWrap');
  if (!wrap) return;

  wrap.innerHTML = [
    '<div style="text-align:center;padding:20px 10px;">',
      '<div style="font-size:56px;margin-bottom:8px;">🏎️</div>',
      '<div style="font-size:22px;font-weight:800;margin-bottom:6px;letter-spacing:1px;">NITRO RACE</div>',
      '<div style="font-size:14px;color:var(--muted);margin-bottom:4px;">Answer questions correctly to boost your car!</div>',
      '<div style="font-size:12px;color:var(--teal);margin-bottom:20px;font-weight:600;">Event: ', evName, '</div>',
      // Car lineup preview
      '<div style="display:flex;justify-content:center;gap:16px;margin-bottom:20px;">',
        makeLobbycar('#00bcd4','YOU'),
        makeLobbycar('#e74c3c','Alex'),
        makeLobbycar('#f39c12','Sam'),
        makeLobbycar('#9b59b6','Jordan'),
        makeLobbycar('#2ecc71','Riley'),
      '</div>',
      '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:12px;margin-bottom:20px;text-align:left;max-width:340px;margin-left:auto;margin-right:auto;">',
        '<div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">HOW TO RACE</div>',
        '<div style="font-size:13px;margin-bottom:6px;">✅ Correct answer → <strong>Speed Boost!</strong></div>',
        '<div style="font-size:13px;margin-bottom:6px;">❌ Wrong answer → <strong>Slow down</strong></div>',
        '<div style="font-size:13px;margin-bottom:6px;">🔥 Answer streak → <strong>Nitro boost!</strong></div>',
        '<div style="font-size:13px;">📍 20 questions · Race to the finish line</div>',
      '</div>',
      '<button onclick="startNitroRace()" style="padding:16px 40px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:12px;font-size:18px;font-weight:800;cursor:pointer;font-family:var(--font);letter-spacing:2px;box-shadow:0 4px 20px rgba(0,188,212,0.4);">🚀 START RACE!</button>',
    '</div>'
  ].join('');

  drawIdleTrack();
}

function makeLobbycar(color, name) {
  return '<div style="text-align:center;">' +
    '<div style="width:44px;height:22px;background:'+color+';border-radius:6px;margin:0 auto 4px;position:relative;box-shadow:0 2px 8px '+color+'88;">' +
    '<div style="position:absolute;right:4px;top:50%;transform:translateY(-50%);width:10px;height:8px;background:rgba(200,240,255,0.5);border-radius:2px;"></div>' +
    '</div>' +
    '<div style="font-size:9px;color:var(--muted);font-weight:600;">' + name + '</div>' +
    '</div>';
}

function drawIdleTrack() {
  var canvas = document.getElementById('raceTrack');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  drawRoadBackground(ctx, W, H);
  var cars = [
    {pos:2, color:'#00bcd4', name:'YOU'},
    {pos:2, color:'#e74c3c', name:'Alex'},
    {pos:2, color:'#f39c12', name:'Sam'},
    {pos:2, color:'#9b59b6', name:'Jordan'},
    {pos:2, color:'#2ecc71', name:'Riley'},
  ];
  drawCars(ctx, W, H, cars);
}

function startNitroRace() {
  var ev = window.EVENTS && window.S && window.EVENTS[window.S.currentEvent];
  var questions = [];

  if (ev) {
    var pool = [];
    ['easy','medium','hard'].forEach(function(d) {
      var q = ev.getQuiz ? ev.getQuiz(d) : [];
      if (q && q.length) pool = pool.concat(q);
    });
    // Shuffle
    for (var i = pool.length-1; i > 0; i--) {
      var j = Math.floor(Math.random()*(i+1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    questions = pool.slice(0, 20);
  }

  if (!questions.length) {
    // Fallback: use terminology flashcards as questions
    var fc = (window.QUESTION_BANK && window.QUESTION_BANK.flashcards && window.QUESTION_BANK.flashcards.easy) || [];
    questions = fc.slice(0,20).map(function(f,i) {
      return {q: 'What does "'+f.term+'" mean?', opts:[f.def,'The study of body systems','A prefix meaning above normal','A suffix meaning inflammation'], correct:0, explain:f.breakdown};
    });
  }

  if (!questions.length) {
    document.getElementById('raceQWrap').innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);">Select an event first to get questions for the race!</div>';
    return;
  }

  RACE_STATE = {
    questions: questions,
    qIdx: 0,
    playerPos: 0,
    aiPos: [0, 0, 0, 0],
    aiBaseSpeed: [0.55, 0.48, 0.42, 0.38], // varies per AI
    playerSpeed: 0,
    score: 0,
    streak: 0,
    nitro: 0,
    finished: false,
    finishOrder: [],
    startTime: Date.now(),
    animFrame: null,
    answered: false,
    selectedOpt: null,
  };

  renderRaceQuestion();
  raceAnimLoop();
}

function raceAnimLoop() {
  if (!RACE_STATE || RACE_STATE.finished) return;

  // Move AI
  for (var i = 0; i < 4; i++) {
    if (RACE_STATE.aiPos[i] < 100) {
      // AI speed varies slightly randomly
      var spd = RACE_STATE.aiBaseSpeed[i] + (Math.random()-0.5)*0.2;
      RACE_STATE.aiPos[i] = Math.min(100, RACE_STATE.aiPos[i] + spd * 0.4);
      if (RACE_STATE.aiPos[i] >= 100) {
        var aiName = ['Alex','Sam','Jordan','Riley'][i];
        if (RACE_STATE.finishOrder.indexOf(aiName) === -1) {
          RACE_STATE.finishOrder.push(aiName);
        }
      }
    }
  }

  // Decay player speed
  RACE_STATE.playerSpeed = Math.max(0, RACE_STATE.playerSpeed * 0.96);
  RACE_STATE.playerPos = Math.min(100, RACE_STATE.playerPos + RACE_STATE.playerSpeed * 0.5);

  if (RACE_STATE.playerPos >= 100 && RACE_STATE.finishOrder.indexOf('YOU') === -1) {
    RACE_STATE.finishOrder.push('YOU');
  }

  // Update nitro bar
  var nitroEl = document.getElementById('nitroBar');
  if (nitroEl) nitroEl.style.width = Math.min(100, RACE_STATE.nitro) + '%';
  var streakEl = document.getElementById('streakLabel');
  if (streakEl) streakEl.textContent = '🔥 x' + (RACE_STATE.streak || 1);

  // Draw
  var canvas = document.getElementById('raceTrack');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var allCars = [
      {pos: RACE_STATE.playerPos, color:'#00bcd4', name:'YOU', speed: RACE_STATE.playerSpeed},
      {pos: RACE_STATE.aiPos[0], color:'#e74c3c', name:'Alex', speed: RACE_STATE.aiBaseSpeed[0]},
      {pos: RACE_STATE.aiPos[1], color:'#f39c12', name:'Sam', speed: RACE_STATE.aiBaseSpeed[1]},
      {pos: RACE_STATE.aiPos[2], color:'#9b59b6', name:'Jordan', speed: RACE_STATE.aiBaseSpeed[2]},
      {pos: RACE_STATE.aiPos[3], color:'#2ecc71', name:'Riley', speed: RACE_STATE.aiBaseSpeed[3]},
    ];
    drawRoadBackground(ctx, W, H);
    drawCars(ctx, W, H, allCars);
    drawHUD(ctx, W, H);
  }

  // Check end condition
  var allDone = RACE_STATE.playerPos >= 100 && RACE_STATE.aiPos.every(function(p){return p>=100;});
  var allQsDone = RACE_STATE.qIdx >= RACE_STATE.questions.length && RACE_STATE.answered;

  if (allDone || (allQsDone && RACE_STATE.finishOrder.length >= 4)) {
    endNitroRace();
    return;
  }

  RACE_STATE.animFrame = requestAnimationFrame(raceAnimLoop);
}

function drawRoadBackground(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);

  // Night sky
  var sky = ctx.createLinearGradient(0, 0, 0, H*0.45);
  sky.addColorStop(0, '#050d1a');
  sky.addColorStop(1, '#0d1f3c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H*0.45);

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  var starSeeds = [23,67,89,134,201,278,312,445,502,589,634,712];
  starSeeds.forEach(function(s) {
    var sx = (s * 97) % W;
    var sy = (s * 53) % (H*0.4);
    ctx.fillRect(sx, sy, 1+(s%2), 1+(s%2));
  });

  // Road surface
  var road = ctx.createLinearGradient(0, H*0.4, 0, H);
  road.addColorStop(0, '#1e1e2e');
  road.addColorStop(0.3, '#2a2a3e');
  road.addColorStop(1, '#111120');
  ctx.fillStyle = road;
  ctx.fillRect(0, H*0.4, W, H*0.6);

  // Road edges (glowing)
  ctx.strokeStyle = 'rgba(0,188,212,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H*0.4); ctx.lineTo(W, H*0.4); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H*0.99); ctx.lineTo(W, H*0.99); ctx.stroke();

  // Lane dividers (animated dashes)
  var dashOffset = (Date.now() / 50) % 50;
  ctx.setLineDash([25, 20]);
  ctx.lineDashOffset = -dashOffset;
  var laneYs = [H*0.54, H*0.67, H*0.80];
  laneYs.forEach(function(ly) {
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(W,ly); ctx.stroke();
  });
  ctx.setLineDash([]);

  // Finish line
  var finX = W - 28;
  for (var fi = 0; fi < 10; fi++) {
    ctx.fillStyle = fi%2===0 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)';
    ctx.fillRect(finX, H*0.41 + fi*(H*0.058), 22, H*0.058);
  }
  // Glow on finish line
  var finGlow = ctx.createLinearGradient(finX, 0, finX+22, 0);
  finGlow.addColorStop(0, 'rgba(255,220,0,0.0)');
  finGlow.addColorStop(0.5, 'rgba(255,220,0,0.2)');
  finGlow.addColorStop(1, 'rgba(255,220,0,0.0)');
  ctx.fillStyle = finGlow;
  ctx.fillRect(finX-10, H*0.4, 42, H*0.6);
}

function drawCars(ctx, W, H, cars) {
  var finX = W - 30;
  var laneYs = [H*0.48, H*0.60, H*0.70, H*0.80, H*0.90];

  cars.forEach(function(car, i) {
    var x = 20 + (car.pos / 100) * (finX - 40);
    var y = laneYs[i] || H*0.5;
    var spd = car.speed || 0;

    // Speed glow trail
    if (spd > 1) {
      var trailLen = Math.min(60, spd * 8);
      var grad = ctx.createLinearGradient(x - trailLen, y, x, y);
      grad.addColorStop(0, 'rgba('+hexToRgb(car.color)+',0)');
      grad.addColorStop(1, 'rgba('+hexToRgb(car.color)+',0.35)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - trailLen, y - 6, trailLen, 12);
    }

    // Car shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 9, 20, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Car body
    ctx.fillStyle = car.color;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - 20, y - 8, 40, 16, 4);
    } else {
      ctx.rect(x - 20, y - 8, 40, 16);
    }
    ctx.fill();

    // Roof / cabin
    ctx.fillStyle = shadeColor(car.color, -30);
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - 8, y - 12, 18, 8, 3);
    } else {
      ctx.rect(x - 8, y - 12, 18, 8);
    }
    ctx.fill();

    // Windshield
    ctx.fillStyle = 'rgba(180,230,255,0.55)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y - 11, 10, 7, 2);
    } else {
      ctx.rect(x, y - 11, 10, 7);
    }
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#fffde7';
    ctx.shadowColor = '#ffe082';
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x + 19, y - 2, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 19, y + 4, 3, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Taillights
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x - 21, y - 4, 3, 4);
    ctx.fillRect(x - 21, y + 2, 3, 4);

    // Wheels
    ctx.fillStyle = '#1a1a1a';
    [x - 10, x + 10].forEach(function(wx) {
      ctx.beginPath(); ctx.arc(wx, y + 8, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#555';
      ctx.beginPath(); ctx.arc(wx, y + 8, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#1a1a1a';
    });

    // Car name label
    ctx.fillStyle = car.name === 'YOU' ? '#00bcd4' : 'rgba(255,255,255,0.7)';
    ctx.font = car.name === 'YOU' ? 'bold 10px monospace' : '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(car.name, x, y - 15);
  });
}

function drawHUD(ctx, W, H) {
  if (!RACE_STATE) return;
  // Progress text
  var finX = W - 30;
  var px = 20 + (RACE_STATE.playerPos / 100) * (finX - 40);
  ctx.fillStyle = 'rgba(0,188,212,0.9)';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(Math.round(RACE_STATE.playerPos) + '%', Math.max(25, px - 10), H*0.43);
}

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return r+','+g+','+b;
}
function shadeColor(hex, pct) {
  var r = Math.max(0,Math.min(255,parseInt(hex.slice(1,3),16)+pct));
  var g = Math.max(0,Math.min(255,parseInt(hex.slice(3,5),16)+pct));
  var b = Math.max(0,Math.min(255,parseInt(hex.slice(5,7),16)+pct));
  return '#'+[r,g,b].map(function(v){return v.toString(16).padStart(2,'0');}).join('');
}

function renderRaceQuestion() {
  var wrap = document.getElementById('raceQWrap');
  if (!wrap || !RACE_STATE) return;

  if (RACE_STATE.qIdx >= RACE_STATE.questions.length) {
    wrap.innerHTML = '<div style="padding:16px;text-align:center;color:var(--muted);font-size:14px;">🏁 All questions answered! Race to the finish!</div>';
    RACE_STATE.answered = true;
    return;
  }

  var q = RACE_STATE.questions[RACE_STATE.qIdx];
  var opts = q.opts || q.options || [];
  var qNum = RACE_STATE.qIdx + 1;
  var total = RACE_STATE.questions.length;

  RACE_STATE.answered = false;
  RACE_STATE.selectedOpt = null;

  var html = [
    '<div style="margin-bottom:10px;">',
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">',
        '<span style="font-size:10px;font-family:var(--mono);color:var(--muted);">Q '+qNum+' / '+total+'</span>',
        '<span style="font-size:10px;font-family:var(--mono);color:var(--teal);">Score: '+RACE_STATE.score+'</span>',
      '</div>',
      // Progress dots
      '<div style="display:flex;gap:3px;margin-bottom:10px;">',
        Array.from({length:total},function(_,i){
          return '<div style="flex:1;height:3px;border-radius:2px;background:'+(i<RACE_STATE.qIdx?'var(--teal)':i===RACE_STATE.qIdx?'#f39c12':'var(--surf2)')+'"></div>';
        }).join(''),
      '</div>',
      '<div style="font-size:15px;font-weight:700;line-height:1.4;margin-bottom:12px;padding:12px;background:var(--surf2);border-radius:10px;border-left:3px solid var(--teal);">'+q.q+'</div>',
    '</div>',
    '<div id="raceOpts">',
      opts.map(function(o,i){
        var letter = ['A','B','C','D'][i];
        return '<div class="race-opt" data-i="'+i+'" style="padding:11px 14px;margin-bottom:8px;background:var(--surf);border:2px solid var(--bord);border-radius:10px;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:10px;transition:all .15s;">' +
          '<span style="width:24px;height:24px;border-radius:50%;background:var(--surf2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">'+letter+'</span>' +
          '<span>'+o+'</span></div>';
      }).join(''),
    '</div>',
    '<button id="raceSubmitBtn" style="display:none;width:100%;padding:13px;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;margin-top:4px;font-family:var(--font);letter-spacing:1px;">⚡ SUBMIT!</button>',
    '<div id="raceFeedback" style="display:none;"></div>',
  ].join('');

  wrap.innerHTML = html;
  wrap.scrollTop = 0;

  // Wire option clicks
  document.querySelectorAll('.race-opt').forEach(function(el) {
    el.addEventListener('click', function() {
      if (RACE_STATE.answered) return;
      document.querySelectorAll('.race-opt').forEach(function(o) {
        o.style.borderColor = 'var(--bord)';
        o.style.background = 'var(--surf)';
      });
      el.style.borderColor = '#f39c12';
      el.style.background = 'rgba(243,156,18,0.12)';
      RACE_STATE.selectedOpt = parseInt(el.dataset.i);
      document.getElementById('raceSubmitBtn').style.display = 'block';
    });
  });

  // Submit
  document.getElementById('raceSubmitBtn').addEventListener('click', function() {
    if (RACE_STATE.answered || RACE_STATE.selectedOpt === null) return;
    RACE_STATE.answered = true;
    var sel = RACE_STATE.selectedOpt;
    var correct = q.correct;
    var opts_els = document.querySelectorAll('.race-opt');
    document.getElementById('raceSubmitBtn').style.display = 'none';
    opts_els.forEach(function(o){ o.style.pointerEvents = 'none'; });

    var fb = document.getElementById('raceFeedback');
    if (sel === correct) {
      RACE_STATE.streak++;
      RACE_STATE.nitro = Math.min(100, RACE_STATE.nitro + 20);
      var boost = 2.5 + Math.min(RACE_STATE.streak * 0.5, 4);
      if (RACE_STATE.nitro >= 100) boost *= 1.5; // NITRO!
      RACE_STATE.playerSpeed = Math.min(14, RACE_STATE.playerSpeed + boost);
      RACE_STATE.score += 100 + (RACE_STATE.streak > 1 ? RACE_STATE.streak * 25 : 0);

      opts_els[sel].style.borderColor = 'var(--green)';
      opts_els[sel].style.background = 'var(--green-l)';

      var boost_txt = RACE_STATE.nitro >= 100 ? '🚀 NITRO BOOST!' : '⚡ +'+boost.toFixed(1)+' speed!';
      if (RACE_STATE.streak > 1) boost_txt += ' 🔥'+RACE_STATE.streak+'x STREAK!';

      fb.style.cssText = 'display:block;padding:10px 12px;border-radius:9px;margin-top:8px;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);font-size:13px;';
      fb.innerHTML = '✅ <strong>Correct!</strong> '+boost_txt+'<br><span style="font-size:11px;color:var(--green-d);opacity:0.8;">'+(q.explain||'')+'</span>';

      if (RACE_STATE.nitro >= 100) {
        RACE_STATE.nitro = 0;
        document.getElementById('nitroBar').style.background = 'linear-gradient(90deg,#00bcd4,#fff)';
        setTimeout(function(){ if(document.getElementById('nitroBar')) document.getElementById('nitroBar').style.background='linear-gradient(90deg,#f39c12,#e74c3c)'; }, 300);
      }
    } else {
      RACE_STATE.streak = 0;
      RACE_STATE.nitro = Math.max(0, RACE_STATE.nitro - 10);
      RACE_STATE.playerSpeed = Math.max(0, RACE_STATE.playerSpeed - 0.5);

      opts_els[sel].style.borderColor = '#e74c3c';
      opts_els[sel].style.background = 'rgba(231,76,60,0.12)';
      opts_els[correct].style.borderColor = 'var(--green)';
      opts_els[correct].style.background = 'var(--green-l)';

      fb.style.cssText = 'display:block;padding:10px 12px;border-radius:9px;margin-top:8px;background:rgba(231,76,60,0.1);color:#c0392b;border:1px solid #e74c3c;font-size:13px;';
      fb.innerHTML = '❌ <strong>Wrong!</strong> Slowing down...<br><span style="font-size:11px;opacity:0.8;">'+(q.explain||'')+'</span>';
    }

    // Update score badge
    var sb = document.getElementById('raceScoreBadge');
    if (sb) sb.textContent = 'Score: ' + RACE_STATE.score;

    // Auto-advance after 1.8s
    RACE_STATE.qIdx++;
    setTimeout(function() {
      renderRaceQuestion();
    }, 1800);
  });
}

function endNitroRace() {
  if (!RACE_STATE) return;
  RACE_STATE.finished = true;
  if (RACE_STATE.animFrame) cancelAnimationFrame(RACE_STATE.animFrame);

  // Fill finish order
  if (RACE_STATE.finishOrder.indexOf('YOU') === -1) RACE_STATE.finishOrder.push('YOU');
  ['Alex','Sam','Jordan','Riley'].forEach(function(n) {
    if (RACE_STATE.finishOrder.indexOf(n) === -1) RACE_STATE.finishOrder.push(n);
  });

  var place = RACE_STATE.finishOrder.indexOf('YOU') + 1;
  var placeEmoji = ['🥇','🥈','🥉','4️⃣','5️⃣'][place-1] || place+'th';
  var placeWord = ['1st','2nd','3rd','4th','5th'][place-1] || place+'th';
  var msg = place===1 ? "🏆 CHAMPION! You won the race!" : place<=3 ? "Nice race! You finished "+placeWord+"!" : "Keep practicing to improve your speed!";

  var xpEarned = Math.min(200, Math.floor(RACE_STATE.score/10) + (4-place)*20);
  if (window.addXP) window.addXP(xpEarned);

  var elapsedSec = Math.round((Date.now() - RACE_STATE.startTime) / 1000);

  var wrap = document.getElementById('raceQWrap');
  if (!wrap) return;
  wrap.innerHTML = [
    '<div style="text-align:center;padding:20px 10px;">',
      '<div style="font-size:56px;margin-bottom:8px;">'+placeEmoji+'</div>',
      '<div style="font-size:22px;font-weight:800;margin-bottom:6px;">'+placeWord+' Place!</div>',
      '<div style="font-size:14px;color:var(--muted);margin-bottom:16px;">'+msg+'</div>',
      // Stats grid
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;max-width:320px;margin-left:auto;margin-right:auto;">',
        statBox('🎯 Score', RACE_STATE.score),
        statBox('⚡ Best Streak', '🔥 x'+Math.max(1,RACE_STATE.streak)),
        statBox('✅ Answered', RACE_STATE.qIdx+'/'+RACE_STATE.questions.length),
        statBox('⏱️ Time', elapsedSec+'s'),
      '</div>',
      // Finish order
      '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:10px;padding:12px;margin-bottom:20px;max-width:320px;margin-left:auto;margin-right:auto;">',
        '<div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:8px;text-transform:uppercase;">Finish Order</div>',
        RACE_STATE.finishOrder.map(function(n,i){
          var isYou = n==='YOU';
          return '<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:7px;margin-bottom:4px;background:'+(isYou?'rgba(0,188,212,0.15)':'transparent')+';border:'+(isYou?'1px solid var(--teal)':'1px solid transparent')+';">'+
            '<span style="font-size:14px;">'+['🥇','🥈','🥉','4️⃣','5️⃣'][i]+'</span>'+
            '<span style="font-size:13px;font-weight:'+(isYou?'800':'500')+';color:'+(isYou?'var(--teal)':'var(--txt)')+';">'+n+'</span>'+
            '</div>';
        }).join(''),
      '</div>',
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">',
        '<button onclick="startNitroRace()" style="padding:13px 28px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font);">🚀 Race Again!</button>',
        '<button onclick="showScreen(\'home\')" style="padding:13px 20px;background:var(--surf2);color:var(--txt);border:1px solid var(--bord);border-radius:10px;font-size:13px;cursor:pointer;font-family:var(--font);">🏠 Home</button>',
      '</div>',
    '</div>'
  ].join('');
}

function statBox(label, value) {
  return '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:10px;text-align:center;">'+
    '<div style="font-size:11px;color:var(--muted);margin-bottom:4px;">'+label+'</div>'+
    '<div style="font-size:18px;font-weight:800;">'+value+'</div></div>';
}

// Expose globally
window.renderRaceGame = renderRaceGame;
window.startNitroRace = startNitroRace;
