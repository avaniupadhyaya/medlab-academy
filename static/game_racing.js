// ── NITRO RACE — HOSA Quiz Racing Game ─────────────────────────────────────
// Answer questions correctly to accelerate your car. Wrong = slow down.
// Race against 3 AI opponents across a 20-question track.

(function(){
var RACE = {
  active: false,
  questions: [],
  qIdx: 0,
  playerPos: 0,     // 0-100 (percent of track)
  aiPos: [0,0,0],   // 3 AI cars
  aiSpeed: [0,0,0],
  playerSpeed: 0,
  frameId: null,
  score: 0,
  streak: 0,
  finished: false,
  finishOrder: [],
  event: null,
};

var AI_NAMES = ['Alex','Sam','Jordan'];
var AI_COLORS = ['#e74c3c','#f39c12','#9b59b6'];
var PLAYER_COLOR = '#00bcd4';

function getRaceQuestions(evId){
  var pool = [];
  var ev = window.EVENTS && window.EVENTS[evId];
  if(!ev) return pool;
  // Gather from quiz pool (easy + medium)
  var qb = (ev.getQuiz('easy')||[]).concat(ev.getQuiz('medium')||[]);
  // Also try flashcards as simple Q format
  if(!qb.length){
    var fc = (ev.getFlash('easy')||[]).concat(ev.getFlash('medium')||[]);
    qb = fc.filter(function(f){ return f.term && f.def; }).map(function(f){
      return {q:'What does "'+f.term+'" mean?', opts:[f.def,
        'A medical instrument used in surgery',
        'A prefix meaning above normal',
        'The study of body systems'], correct:0, explain:f.breakdown||f.def};
    });
  }
  // Shuffle and take 20
  for(var i=qb.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=qb[i];qb[i]=qb[j];qb[j]=t;}
  return qb.slice(0,20);
}

function initRace(evId){
  RACE.questions = getRaceQuestions(evId);
  if(!RACE.questions.length){
    document.getElementById('raceStatus').textContent = 'No questions available for this event. Select an event first!';
    return;
  }
  RACE.active = true;
  RACE.qIdx = 0;
  RACE.playerPos = 0;
  RACE.aiPos = [0,0,0];
  RACE.aiSpeed = [0.28 + Math.random()*0.12, 0.22 + Math.random()*0.15, 0.18 + Math.random()*0.18];
  RACE.playerSpeed = 0;
  RACE.score = 0;
  RACE.streak = 0;
  RACE.finished = false;
  RACE.finishOrder = [];
  RACE.event = evId;

  document.getElementById('raceQuestion').style.display = 'block';
  document.getElementById('raceResult').style.display = 'none';
  document.getElementById('raceStartBtn').style.display = 'none';
  document.getElementById('raceStatus').textContent = '';
  document.getElementById('raceStreakBar').style.width = '0%';

  renderRaceQ();
  if(RACE.frameId) cancelAnimationFrame(RACE.frameId);
  raceLoop();
}

function raceLoop(){
  if(!RACE.active) return;
  
  // Move AI cars
  for(var i=0;i<3;i++){
    if(RACE.aiPos[i] < 100){
      RACE.aiPos[i] = Math.min(100, RACE.aiPos[i] + RACE.aiSpeed[i] * 0.5);
      if(RACE.aiPos[i] >= 100 && RACE.finishOrder.indexOf('ai'+i) === -1){
        RACE.finishOrder.push('ai'+i);
      }
    }
  }
  // Decay player speed
  RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 0.15);
  RACE.playerPos = Math.min(100, RACE.playerPos + RACE.playerSpeed * 0.5);
  
  if(RACE.playerPos >= 100 && RACE.finishOrder.indexOf('player') === -1){
    RACE.finishOrder.push('player');
  }

  drawTrack();

  // Check if all finished
  if(RACE.finishOrder.length === 4 || (RACE.playerPos >= 100 && RACE.qIdx >= RACE.questions.length)){
    endRace();
    return;
  }

  RACE.frameId = requestAnimationFrame(raceLoop);
}

function drawTrack(){
  var canvas = document.getElementById('raceCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  
  ctx.clearRect(0,0,W,H);
  
  // Sky gradient
  var sky = ctx.createLinearGradient(0,0,0,H*0.5);
  sky.addColorStop(0,'#0a1628');
  sky.addColorStop(1,'#1a3a5c');
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H*0.55);
  
  // Road
  var road = ctx.createLinearGradient(0,H*0.5,0,H);
  road.addColorStop(0,'#2a2a2a');
  road.addColorStop(1,'#1a1a1a');
  ctx.fillStyle = road;
  ctx.fillRect(0,H*0.5,W,H*0.5);

  // Road lines
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 2;
  ctx.setLineDash([20,15]);
  ctx.beginPath();
  ctx.moveTo(0, H*0.72);
  ctx.lineTo(W, H*0.72);
  ctx.stroke();
  ctx.setLineDash([]);

  // Finish line
  var finX = W - 30;
  ctx.fillStyle = '#fff';
  for(var fi=0; fi<8; fi++){
    ctx.fillStyle = fi%2===0 ? '#fff' : '#000';
    ctx.fillRect(finX, H*0.52 + fi*(H*0.06), 20, H*0.06);
  }

  // Draw cars
  var lanes = [H*0.56, H*0.64, H*0.72, H*0.80];
  var carData = [
    {pos: RACE.playerPos, color: PLAYER_COLOR, label: 'YOU', lane: lanes[0]},
    {pos: RACE.aiPos[0], color: AI_COLORS[0], label: AI_NAMES[0], lane: lanes[1]},
    {pos: RACE.aiPos[1], color: AI_COLORS[1], label: AI_NAMES[1], lane: lanes[2]},
    {pos: RACE.aiPos[2], color: AI_COLORS[2], label: AI_NAMES[2], lane: lanes[3]},
  ];

  carData.forEach(function(car){
    var x = 30 + (car.pos / 100) * (finX - 60);
    var y = car.lane;
    
    // Car body
    ctx.fillStyle = car.color;
    ctx.beginPath();
    ctx.roundRect(x-18, y-7, 36, 14, 4);
    ctx.fill();
    
    // Windshield
    ctx.fillStyle = 'rgba(200,230,255,0.6)';
    ctx.beginPath();
    ctx.roundRect(x-4, y-6, 14, 8, 2);
    ctx.fill();
    
    // Wheels
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(x-10, y+6, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+10, y+6, 4, 0, Math.PI*2); ctx.fill();
    
    // Headlights (glow effect)
    ctx.fillStyle = '#ffe066';
    ctx.beginPath(); ctx.arc(x+18, y, 3, 0, Math.PI*2); ctx.fill();
    
    // Speed lines for player if fast
    if(car.label==='YOU' && RACE.playerSpeed > 2){
      ctx.strokeStyle = 'rgba(0,188,212,0.4)';
      ctx.lineWidth = 1;
      for(var sl=0;sl<3;sl++){
        ctx.beginPath();
        ctx.moveTo(x-20, y-4+sl*4);
        ctx.lineTo(x-20-RACE.playerSpeed*8, y-4+sl*4);
        ctx.stroke();
      }
    }
    
    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(car.label, x, y-10);
  });

  // Progress bar
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, H-14, W, 14);
  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(0, H-14, (RACE.playerPos/100)*W, 14);
  ctx.fillStyle = '#fff';
  ctx.font = '9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Progress: '+Math.round(RACE.playerPos)+'%  Q:'+(RACE.qIdx+1)+'/'+RACE.questions.length, 6, H-3);
}

function renderRaceQ(){
  if(RACE.qIdx >= RACE.questions.length){
    document.getElementById('raceQArea').innerHTML = '<div style="color:var(--muted);text-align:center;padding:10px;font-size:13px;">All questions answered! Finishing race...</div>';
    return;
  }
  var q = RACE.questions[RACE.qIdx];
  var opts = q.opts || q.options || [];
  var html = '<div style="font-size:13px;font-weight:700;margin-bottom:10px;line-height:1.4;">'+q.q+'</div>';
  html += '<div id="raceOpts">';
  opts.forEach(function(o,i){
    html += '<div class="race-opt" data-i="'+i+'" style="padding:8px 12px;margin-bottom:6px;background:var(--surf2);border:1px solid var(--bord);border-radius:8px;cursor:pointer;font-size:12px;transition:all .1s;">'+String.fromCharCode(65+i)+'. '+o+'</div>';
  });
  html += '</div>';
  html += '<button id="raceSubmit" style="display:none;width:100%;padding:10px;background:var(--teal);color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;margin-top:6px;font-family:var(--font);">Submit ⚡</button>';
  html += '<div id="raceFeedback" style="display:none;padding:8px;border-radius:7px;margin-top:7px;font-size:12px;"></div>';
  document.getElementById('raceQArea').innerHTML = html;

  var selected = null;
  document.querySelectorAll('.race-opt').forEach(function(el){
    el.addEventListener('click', function(){
      if(document.getElementById('raceFeedback').style.display !== 'none') return;
      document.querySelectorAll('.race-opt').forEach(function(o){ o.style.borderColor='var(--bord)'; o.style.background='var(--surf2)'; o.style.fontWeight=''; });
      el.style.borderColor = 'var(--teal)';
      el.style.background = 'var(--teal-l,rgba(0,188,212,0.12))';
      el.style.fontWeight = '700';
      selected = parseInt(el.dataset.i);
      document.getElementById('raceSubmit').style.display = 'block';
    });
  });

  document.getElementById('raceSubmit').addEventListener('click', function(){
    if(selected === null) return;
    var correct = q.correct;
    var fb = document.getElementById('raceFeedback');
    var opts_els = document.querySelectorAll('.race-opt');
    document.getElementById('raceSubmit').style.display = 'none';
    opts_els.forEach(function(o){ o.style.pointerEvents = 'none'; });

    if(selected === correct){
      RACE.streak++;
      var boost = 3 + Math.min(RACE.streak, 5); // streak bonus
      RACE.playerSpeed = Math.min(12, RACE.playerSpeed + boost);
      RACE.score += 100 + (RACE.streak > 1 ? RACE.streak * 20 : 0);
      opts_els[selected].style.background = 'var(--green-l)';
      opts_els[selected].style.borderColor = 'var(--green)';
      fb.style.cssText = 'display:block;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);padding:8px;border-radius:7px;margin-top:7px;font-size:12px;';
      fb.textContent = '✅ Correct! +'+boost+' speed'+(RACE.streak>1?' ('+RACE.streak+'x streak!)':'');
      updateStreakBar();
      setTimeout(function(){ nextRaceQ(); }, 1200);
    } else {
      RACE.streak = 0;
      RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 1);
      opts_els[selected].style.background = 'var(--red-l,rgba(231,76,60,0.15))';
      opts_els[selected].style.borderColor = 'var(--red,#e74c3c)';
      opts_els[correct].style.background = 'var(--green-l)';
      opts_els[correct].style.borderColor = 'var(--green)';
      fb.style.cssText = 'display:block;background:var(--red-l,rgba(231,76,60,0.1));color:var(--red-d,#c0392b);border:1px solid var(--red,#e74c3c);padding:8px;border-radius:7px;margin-top:7px;font-size:12px;';
      fb.textContent = '❌ ' + (q.explain||'Wrong answer — no speed boost');
      updateStreakBar();
      setTimeout(function(){ nextRaceQ(); }, 2000);
    }
  });
}

function updateStreakBar(){
  var pct = Math.min(100, (RACE.streak / 5) * 100);
  var bar = document.getElementById('raceStreakBar');
  if(bar) bar.style.width = pct + '%';
}

function nextRaceQ(){
  RACE.qIdx++;
  if(RACE.qIdx >= RACE.questions.length){
    document.getElementById('raceQArea').innerHTML = '<div style="color:var(--muted);text-align:center;padding:10px;font-size:13px;">All questions answered! 🏁</div>';
    return;
  }
  renderRaceQ();
}

function endRace(){
  RACE.active = false;
  if(RACE.frameId) cancelAnimationFrame(RACE.frameId);
  
  // Determine final positions
  if(RACE.finishOrder.indexOf('player') === -1) RACE.finishOrder.push('player');
  for(var i=0;i<3;i++){ if(RACE.finishOrder.indexOf('ai'+i)===-1) RACE.finishOrder.push('ai'+i); }
  
  var playerPlace = RACE.finishOrder.indexOf('player') + 1;
  var placeStr = ['🥇 1st','🥈 2nd','🥉 3rd','4th'][playerPlace-1] || playerPlace+'th';
  var medal = playerPlace===1 ? '🏆' : playerPlace===2 ? '🥈' : playerPlace===3 ? '🥉' : '🏁';
  
  if(window.addXP) window.addXP(RACE.score > 0 ? Math.min(200, Math.floor(RACE.score/10)) : 10);
  
  document.getElementById('raceQuestion').style.display = 'none';
  document.getElementById('raceResult').style.display = 'block';
  document.getElementById('raceResult').innerHTML = 
    '<div style="text-align:center;padding:16px;">'
    +'<div style="font-size:48px;margin-bottom:8px;">'+medal+'</div>'
    +'<div style="font-size:20px;font-weight:800;margin-bottom:4px;">'+placeStr+' Place!</div>'
    +'<div style="font-size:13px;color:var(--muted);margin-bottom:4px;">Score: '+RACE.score+' pts</div>'
    +'<div style="font-size:13px;color:var(--muted);margin-bottom:16px;">Answered '+RACE.qIdx+'/'+RACE.questions.length+' questions</div>'
    +'<div style="font-size:11px;color:var(--muted);margin-bottom:16px;font-family:var(--mono);">FINISH ORDER: '
    +RACE.finishOrder.map(function(f){ return f==='player'?'YOU':AI_NAMES[parseInt(f.slice(2))]; }).join(' → ')+'</div>'
    +'<button onclick="window.startRace()" style="padding:12px 28px;background:var(--teal);color:white;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--font);margin-right:8px;">Race Again 🚀</button>'
    +'<button onclick="showScreen(\'home\')" style="padding:12px 20px;background:var(--surf2);color:var(--txt);border:1px solid var(--bord);border-radius:10px;font-size:13px;cursor:pointer;font-family:var(--font);">Back to Home</button>'
    +'</div>';
}

window.startRace = function(){
  var evId = window.S && window.S.currentEvent ? window.S.currentEvent : 'terminology';
  initRace(evId);
};

window.initRaceScreen = function(){
  var evId = window.S && window.S.currentEvent ? window.S.currentEvent : 'terminology';
  var evName = window.EVENTS && window.EVENTS[evId] ? window.EVENTS[evId].name : 'Current Event';
  document.getElementById('raceEventName').textContent = evName;
  document.getElementById('raceStartBtn').style.display = 'block';
  document.getElementById('raceQuestion').style.display = 'none';
  document.getElementById('raceResult').style.display = 'none';
  document.getElementById('raceStatus').textContent = '';
  drawTrack();
};

})();
