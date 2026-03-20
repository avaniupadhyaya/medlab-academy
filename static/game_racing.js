// ── HOSA NITRO RACE v2 ─────────────────────────────────────────────────────
// Features: canvas race track with animated cars, 3 AI difficulty levels,
//           event-locked questions, localStorage progress tracking

var NR = {
  state: null,
  anim: null,
  difficulty: 'medium',
  selectedEvent: null,
};

var NR_DIFF = {
  easy:   { label:'🟢 Easy',   aiBase:[0.18,0.15,0.12,0.10], aiVar:0.06, qCount:10, boost:1.4, sub:'Relaxed AI \u2014 great for beginners' },
  medium: { label:'🟡 Medium', aiBase:[0.38,0.32,0.27,0.22], aiVar:0.10, qCount:15, boost:1.0, sub:'Balanced \u2014 the standard race' },
  hard:   { label:'🔴 Hard',   aiBase:[0.62,0.55,0.50,0.44], aiVar:0.14, qCount:20, boost:0.75, sub:'Fast AI \u2014 a real challenge!' },
};

var NR_CARS = [
  {name:'YOU',   color:'#00bcd4'},
  {name:'Alex',  color:'#e74c3c'},
  {name:'Sam',   color:'#f39c12'},
  {name:'Jordan',color:'#9b59b6'},
  {name:'Riley', color:'#2ecc71'},
];

function nrGetStats() {
  try { var d=localStorage.getItem('hosa_race_stats'); return d?JSON.parse(d):{races:0,wins:0,bestScore:0,bestStreak:0,totalScore:0,history:[]}; }
  catch(e){ return {races:0,wins:0,bestScore:0,bestStreak:0,totalScore:0,history:[]}; }
}
function nrSaveResult(score,place,streak,evId,diff) {
  try {
    var s=nrGetStats();
    s.races++;
    if(place===1)s.wins++;
    if(score>s.bestScore)s.bestScore=score;
    if(streak>s.bestStreak)s.bestStreak=streak;
    s.totalScore=(s.totalScore||0)+score;
    s.history=s.history||[];
    s.history.unshift({date:Date.now(),score:score,place:place,evId:evId,diff:diff});
    if(s.history.length>20)s.history=s.history.slice(0,20);
    localStorage.setItem('hosa_race_stats',JSON.stringify(s));
    return s;
  } catch(e){ return nrGetStats(); }
}

function renderRaceGame() {
  if(NR.anim){cancelAnimationFrame(NR.anim);NR.anim=null;}
  NR.state=null;
  NR.selectedEvent=(window.S&&window.S.currentEvent)||'terminology';
  nrShowLobby();
}
window.renderRaceGame=renderRaceGame;

function nrShowLobby() {
  var screen=document.getElementById('screen-race');
  if(!screen)return;
  var stats=nrGetStats();
  var winRate=stats.races>0?Math.round((stats.wins/stats.races)*100):0;

  var evOpts='';
  if(window.EVENTS){
    Object.values(window.EVENTS).forEach(function(ev){
      var sel=ev.id===NR.selectedEvent;
      evOpts+='<div class="nrev" data-id="'+ev.id+'" onclick="nrPickEv(\''+ev.id+'\')" style="display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;cursor:pointer;margin-bottom:5px;border:2px solid '+(sel?'var(--teal)':'var(--bord)')+';background:'+(sel?'rgba(0,188,212,0.1)':'var(--surf2)')+';font-size:13px;font-weight:'+(sel?700:500)+';color:'+(sel?'var(--teal)':'var(--txt)')+';">'
        +'<span style="font-size:16px;">'+(ev.icon||'📚')+'</span><span>'+ev.name+'</span>'
        +(sel?'<span style="margin-left:auto;background:var(--teal);color:white;font-size:10px;padding:1px 6px;border-radius:4px;">\u2713 SELECTED</span>':'')
        +'</div>';
    });
  }

  var diffBtns=Object.keys(NR_DIFF).map(function(dk){
    var d=NR_DIFF[dk],sel=NR.difficulty===dk;
    return '<button id="nrdiff_'+dk+'" onclick="nrSetDiff(\''+dk+'\')" style="flex:1;padding:10px 4px;border-radius:10px;border:2px solid '+(sel?'var(--teal)':'var(--bord)')+';background:'+(sel?'rgba(0,188,212,0.12)':'var(--surf2)')+';cursor:pointer;font-family:var(--font);">'
      +'<div style="font-size:13px;font-weight:800;color:'+(sel?'var(--teal)':'var(--txt)')+';">'+d.label+'</div>'
      +'<div style="font-size:9px;color:var(--muted);margin-top:2px;">'+d.sub+'</div>'
      +'</button>';
  }).join('');

  var carRow=NR_CARS.map(function(c){
    return '<div style="text-align:center;"><div style="width:36px;height:14px;background:'+c.color+';border-radius:4px;margin:0 auto 3px;box-shadow:0 2px 6px '+c.color+'55;"></div><div style="font-size:9px;color:var(--muted);">'+c.name+'</div></div>';
  }).join('');

  var statsRow=stats.races>0
    ?'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:340px;margin:0 auto 14px;">'+nrSB('🏁 Races',stats.races)+nrSB('🏆 Wins',stats.wins)+nrSB('⚡ Best',stats.bestScore)+'</div>'
    :'<p style="font-size:11px;color:var(--muted);text-align:center;margin:0 0 14px;">No races yet \u2014 hit Start!</p>';

  screen.innerHTML=
    '<div style="padding:14px;max-width:480px;margin:0 auto;overflow-y:auto;height:100%;box-sizing:border-box;">'
    +'<div style="text-align:center;padding:10px 0 14px;">'
      +'<div style="font-size:40px;margin-bottom:4px;">🏎️</div>'
      +'<div style="font-size:21px;font-weight:900;letter-spacing:3px;color:var(--teal);">NITRO RACE</div>'
      +'<div style="font-size:10px;color:var(--muted);letter-spacing:1px;margin-top:2px;">ANSWER FAST \u00b7 RACE FASTER</div>'
    +'</div>'
    +statsRow
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:11px;margin-bottom:12px;">'
      +'<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;">📚 Choose Your Event</div>'
      +'<div style="max-height:200px;overflow-y:auto;" id="nrEvList">'+evOpts+'</div>'
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:11px;margin-bottom:12px;">'
      +'<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;">⚙️ AI Difficulty</div>'
      +'<div style="display:flex;gap:6px;">'+diffBtns+'</div>'
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:11px;margin-bottom:14px;">'
      +'<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;">🚗 Racers</div>'
      +'<div style="display:flex;justify-content:space-around;">'+carRow+'</div>'
    +'</div>'
    +'<div style="text-align:center;padding-bottom:16px;">'
      +'<button onclick="nrStart()" style="padding:15px 44px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:14px;font-size:17px;font-weight:900;cursor:pointer;font-family:var(--font);letter-spacing:2px;box-shadow:0 6px 22px rgba(0,188,212,0.4);">🚀 START RACE!</button>'
    +'</div>'
    +'</div>';
}

function nrPickEv(evId) {
  NR.selectedEvent=evId;
  document.querySelectorAll('.nrev').forEach(function(el){
    var sel=el.dataset.id===evId;
    el.style.borderColor=sel?'var(--teal)':'var(--bord)';
    el.style.background=sel?'rgba(0,188,212,0.1)':'var(--surf2)';
    el.style.fontWeight=sel?'700':'500';
    el.style.color=sel?'var(--teal)':'var(--txt)';
    var badge=el.querySelector('span[style*="SELECTED"]');
    if(sel&&!badge){var b=document.createElement('span');b.style.cssText='margin-left:auto;background:var(--teal);color:white;font-size:10px;padding:1px 6px;border-radius:4px;';b.textContent='\u2713 SELECTED';el.appendChild(b);}
    else if(!sel&&badge){badge.remove();}
  });
}
window.nrPickEv=nrPickEv;

function nrSetDiff(dk) {
  NR.difficulty=dk;
  Object.keys(NR_DIFF).forEach(function(k){
    var btn=document.getElementById('nrdiff_'+k);
    if(!btn)return;
    var sel=k===dk;
    btn.style.borderColor=sel?'var(--teal)':'var(--bord)';
    btn.style.background=sel?'rgba(0,188,212,0.12)':'var(--surf2)';
    btn.querySelector('div').style.color=sel?'var(--teal)':'var(--txt)';
  });
}
window.nrSetDiff=nrSetDiff;

function nrBuildQ() {
  var evId=NR.selectedEvent||(window.S&&window.S.currentEvent)||'terminology';
  var ev=window.EVENTS&&window.EVENTS[evId];
  var cfg=NR_DIFF[NR.difficulty]||NR_DIFF.medium;
  var pool=[];
  if(ev){
    ['easy','medium','hard'].forEach(function(d){
      var q=ev.getQuiz?(ev.getQuiz(d)||[]):[];
      pool=pool.concat(q);
    });
    if(!pool.length&&window.QUESTION_BANK&&window.QUESTION_BANK.diagnosisDetective){
      ['easy','medium','hard'].forEach(function(d){
        (window.QUESTION_BANK.diagnosisDetective[d]||[]).forEach(function(item){
          pool.push({q:item.scenario||item.q,opts:item.options||item.opts,correct:item.correct,explain:item.explain});
        });
      });
    }
    if(!pool.length&&ev.getFlash){
      var wrongs=['A condition causing inflammation','The study of body systems','A prefix meaning above normal','The removal of an organ','Below normal levels','Rapid heart rate','Pertaining to blood','Relating to the nervous system'];
      ['easy','medium','hard'].forEach(function(d){
        (ev.getFlash(d)||[]).slice(0,30).forEach(function(c){
          if(!c||!c.term||!c.def)return;
          var opts=[c.def];
          var tries=0;
          while(opts.length<4&&tries<20){var w=wrongs[Math.floor(Math.random()*wrongs.length)];if(opts.indexOf(w)<0)opts.push(w);tries++;}
          pool.push({q:'What does "'+c.term+'" mean?',opts:opts,correct:0,explain:c.breakdown||c.def});
        });
      });
    }
  }
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
  return pool.slice(0,cfg.qCount);
}

function nrStart() {
  var qs=nrBuildQ();
  var cfg=NR_DIFF[NR.difficulty]||NR_DIFF.medium;
  var evId=NR.selectedEvent||(window.S&&window.S.currentEvent)||'terminology';
  if(!qs.length){alert('No questions found! Please select an event.');return;}
  if(NR.anim){cancelAnimationFrame(NR.anim);NR.anim=null;}
  var ev=window.EVENTS&&window.EVENTS[evId];
  var evName=ev?ev.name:evId;
  NR.state={
    qs:qs,qi:0,score:0,streak:0,bestStreak:0,
    answered:false,selOpt:null,
    pos:[0,0,0,0,0],spd:[0,0,0,0,0],
    aiBase:cfg.aiBase.slice(),aiVar:cfg.aiVar,boost:cfg.boost,
    finOrder:[],finished:false,
    startTime:Date.now(),evId:evId,diff:NR.difficulty,frame:0,
  };
  var screen=document.getElementById('screen-race');
  screen.innerHTML=
    '<div style="display:flex;flex-direction:column;height:100%;padding:10px 12px;box-sizing:border-box;overflow:hidden;">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-shrink:0;">'
      +'<div style="font-size:11px;color:var(--muted);">📚 '+evName+' &nbsp;\u00b7&nbsp; '+cfg.label+'</div>'
      +'<div id="nrScore" style="font-size:12px;font-weight:800;color:var(--teal);font-family:monospace;">Score: 0</div>'
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:6px;margin-bottom:8px;flex-shrink:0;">'
      +'<canvas id="nrCanvas" style="width:100%;height:170px;display:block;border-radius:8px;"></canvas>'
    +'</div>'
    +'<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-shrink:0;">'
      +'<div style="font-size:9px;color:var(--muted);white-space:nowrap;">⚡ POSITION</div>'
      +'<div style="flex:1;background:var(--surf2);border-radius:6px;overflow:hidden;height:6px;">'
        +'<div id="nrPos" style="height:100%;width:0%;background:linear-gradient(90deg,#00bcd4,#0097a7);border-radius:6px;transition:width .15s;"></div>'
      +'</div>'
      +'<div id="nrStreak" style="font-size:11px;color:#f39c12;font-weight:700;white-space:nowrap;">🔥 x0</div>'
    +'</div>'
    +'<div id="nrQ" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;"></div>'
    +'</div>';
  var canvas=document.getElementById('nrCanvas');
  if(canvas){canvas.width=canvas.offsetWidth||400;canvas.height=canvas.offsetHeight||170;}
  nrShowQ();
  nrLoop();
}
window.nrStart=nrStart;

function nrLoop() {
  if(!NR.state||NR.state.finished)return;
  var s=NR.state;
  s.frame++;
  for(var i=1;i<=4;i++){
    if(s.pos[i]<100){
      var spd=s.aiBase[i-1]+(Math.random()-0.4)*s.aiVar;
      s.spd[i]=Math.max(0,spd);
      s.pos[i]=Math.min(100,s.pos[i]+spd);
      if(s.pos[i]>=100&&s.finOrder.indexOf(i)<0)s.finOrder.push(i);
    }
  }
  s.spd[0]=Math.max(0,s.spd[0]*0.93);
  s.pos[0]=Math.min(100,s.pos[0]+s.spd[0]*0.5);
  if(s.pos[0]>=100&&s.finOrder.indexOf(0)<0)s.finOrder.push(0);
  var pb=document.getElementById('nrPos');
  if(pb)pb.style.width=Math.round(s.pos[0])+'%';
  nrDraw();
  if(s.finOrder.length>=5||(s.qi>=s.qs.length&&s.answered)){nrEnd();return;}
  NR.anim=requestAnimationFrame(nrLoop);
}

function nrDraw() {
  var canvas=document.getElementById('nrCanvas');
  if(!canvas||!NR.state)return;
  var ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,s=NR.state;
  var sky=ctx.createLinearGradient(0,0,0,H*0.38);
  sky.addColorStop(0,'#020912');sky.addColorStop(1,'#091830');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,0.75)';
  [11,23,41,67,97,131,157,181,211,239,269,293,311,337,359].forEach(function(n){
    var sx=((n*41+s.frame*(n%3===0?0.4:n%3===1?-0.2:0.1))%W+W)%W;
    ctx.fillRect(sx,(n*17)%(H*0.33),n%5===0?2:1,n%5===0?2:1);
  });
  ctx.fillStyle='#12121e';ctx.fillRect(0,H*0.36,W,H*0.64);
  var hg=ctx.createLinearGradient(0,H*0.32,0,H*0.44);
  hg.addColorStop(0,'rgba(0,188,212,0.15)');hg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=hg;ctx.fillRect(0,H*0.32,W,H*0.14);
  ctx.strokeStyle='rgba(0,188,212,0.45)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,H*0.37);ctx.lineTo(W,H*0.37);ctx.stroke();
  var doff=(s.frame*1.6)%50;
  ctx.setLineDash([20,18]);ctx.lineDashOffset=-doff;
  [H*0.51,H*0.63,H*0.75,H*0.87].forEach(function(ly){
    ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(W,ly);ctx.stroke();
  });
  ctx.setLineDash([]);
  var fx=W-20;
  for(var fi=0;fi<8;fi++){
    ctx.fillStyle=fi%2===0?'rgba(255,255,255,0.9)':'rgba(0,0,0,0.85)';
    ctx.fillRect(fx,H*0.38+fi*(H*0.077),15,H*0.077);
  }
  var fg=ctx.createLinearGradient(fx-8,0,fx+18,0);
  fg.addColorStop(0,'rgba(255,255,100,0)');fg.addColorStop(0.5,'rgba(255,255,100,0.07)');fg.addColorStop(1,'rgba(255,255,100,0)');
  ctx.fillStyle=fg;ctx.fillRect(fx-8,H*0.37,28,H*0.63);
  var lanes=[H*0.42,H*0.53,H*0.63,H*0.73,H*0.85];
  var trackW=fx-26;
  NR_CARS.forEach(function(car,ci){
    var pct=Math.min(100,s.pos[ci]||0);
    var cx=16+(pct/100)*trackW;
    var cy=lanes[ci];
    var spd=s.spd[ci]||0;
    if(spd>0.15){
      var tlen=Math.min(55,spd*(ci===0?9:6));
      var tg=ctx.createLinearGradient(cx-tlen,cy,cx,cy);
      tg.addColorStop(0,'rgba('+nrRGB(car.color)+',0)');
      tg.addColorStop(1,'rgba('+nrRGB(car.color)+',0.3)');
      ctx.fillStyle=tg;ctx.fillRect(cx-tlen,cy-5,tlen,10);
    }
    ctx.shadowColor=car.color;ctx.shadowBlur=ci===0?10:4;
    ctx.fillStyle=car.color;nrRR(ctx,cx-18,cy-7,36,14,4);ctx.fill();
    ctx.fillStyle=nrSh(car.color,-28);nrRR(ctx,cx-4,cy-12,14,9,3);ctx.fill();
    ctx.fillStyle='rgba(180,235,255,0.55)';nrRR(ctx,cx+2,cy-11,7,7,2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.shadowColor='#ffe082';ctx.shadowBlur=7;ctx.fillStyle='#fffde7';
    ctx.beginPath();ctx.arc(cx+19,cy-3,2.5,0,6.28);ctx.fill();
    ctx.beginPath();ctx.arc(cx+19,cy+4,2.5,0,6.28);ctx.fill();
    ctx.shadowBlur=0;
    ctx.shadowColor='#e74c3c';ctx.shadowBlur=4;ctx.fillStyle='#ff5252';
    ctx.fillRect(cx-20,cy-4,3,4);ctx.fillRect(cx-20,cy+2,3,4);ctx.shadowBlur=0;
    [[cx-10,cy+8],[cx+10,cy+8]].forEach(function(w){
      ctx.fillStyle='#0d0d0d';ctx.beginPath();ctx.arc(w[0],w[1],4.5,0,6.28);ctx.fill();
      ctx.fillStyle='#3a3a3a';ctx.beginPath();ctx.arc(w[0],w[1],2.2,0,6.28);ctx.fill();
      var ang=(s.frame*spd*0.3)%(Math.PI*2);
      ctx.strokeStyle='#666';ctx.lineWidth=1;
      for(var sp=0;sp<3;sp++){var a=ang+sp*(Math.PI*2/3);ctx.beginPath();ctx.moveTo(w[0],w[1]);ctx.lineTo(w[0]+Math.cos(a)*2.2,w[1]+Math.sin(a)*2.2);ctx.stroke();}
    });
    ctx.font=(ci===0?'bold ':'')+'8px monospace';
    ctx.fillStyle=ci===0?'#00e5ff':'rgba(255,255,255,0.5)';
    ctx.textAlign='center';ctx.shadowBlur=0;
    ctx.fillText(car.name,cx,cy-16);
  });
  ctx.fillStyle='rgba(0,0,0,0.75)';ctx.fillRect(0,H-11,W,11);
  var ranked=NR_CARS.map(function(c,i){return{i:i,pos:s.pos[i]||0,color:c.color};}).sort(function(a,b){return b.pos-a.pos;});
  var myRank=ranked.findIndex(function(r){return r.i===0;})+1;
  var meds=['🥇','🥈','🥉','4th','5th'];
  ranked.forEach(function(r,rank){
    var dotX=10+rank*(W/5.5);
    ctx.fillStyle=r.color;ctx.shadowColor=r.color;ctx.shadowBlur=r.i===0?5:2;
    ctx.beginPath();ctx.arc(dotX,H-5.5,r.i===0?3.5:2.5,0,6.28);ctx.fill();ctx.shadowBlur=0;
  });
  ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='7px monospace';ctx.textAlign='right';
  ctx.fillText(meds[myRank-1]+'  Q:'+(s.qi+1)+'/'+s.qs.length,W-4,H-2);
}

function nrShowQ() {
  var z=document.getElementById('nrQ');
  if(!z||!NR.state)return;
  var s=NR.state;
  if(s.qi>=s.qs.length){
    z.innerHTML='<div style="padding:20px;text-align:center;color:var(--muted);font-size:14px;">🏁 All questions answered! Race finishing...</div>';
    s.answered=true;return;
  }
  var q=s.qs[s.qi],opts=q.opts||q.options||[];
  s.answered=false;s.selOpt=null;
  var dots='<div style="display:flex;gap:2px;margin-bottom:9px;">';
  for(var d=0;d<s.qs.length;d++){
    var col=d<s.qi?'var(--teal)':d===s.qi?'#f39c12':'var(--surf2)';
    dots+='<div style="flex:1;height:4px;border-radius:2px;background:'+col+';"></div>';
  }
  dots+='</div>';
  var opHtml=opts.map(function(o,i){
    return '<div class="nropt" data-i="'+i+'" style="padding:10px 13px;margin-bottom:7px;background:var(--surf2);border:2px solid var(--bord);border-radius:10px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:9px;">'
      +'<span style="min-width:24px;height:24px;border-radius:50%;background:var(--surf);border:1px solid var(--bord);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">'+['A','B','C','D'][i]+'</span>'
      +'<span>'+o+'</span></div>';
  }).join('');
  z.innerHTML=dots
    +'<div style="display:flex;justify-content:space-between;margin-bottom:7px;">'
      +'<span style="font-size:10px;color:var(--muted);font-family:monospace;">Q '+(s.qi+1)+' / '+s.qs.length+'</span>'
      +'<span style="font-size:10px;color:var(--teal);font-family:monospace;">Score: '+s.score+'</span>'
    +'</div>'
    +'<div style="font-size:14px;font-weight:700;line-height:1.45;margin-bottom:11px;padding:11px 13px;background:var(--surf);border-radius:10px;border-left:3px solid var(--teal);">'+q.q+'</div>'
    +'<div id="nrOpts">'+opHtml+'</div>'
    +'<button id="nrSub" style="display:none;width:100%;padding:12px;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;margin-top:3px;font-family:var(--font);">\u26a1 SUBMIT!</button>'
    +'<div id="nrFb" style="display:none;padding:10px 12px;border-radius:9px;margin-top:7px;font-size:13px;"></div>';
  z.querySelectorAll('.nropt').forEach(function(el){
    el.addEventListener('click',function(){
      var fb=document.getElementById('nrFb');
      if(fb&&fb.style.display==='block')return;
      z.querySelectorAll('.nropt').forEach(function(o){o.style.borderColor='var(--bord)';o.style.background='var(--surf2)';});
      el.style.borderColor='#f39c12';el.style.background='rgba(243,156,18,0.12)';
      NR.state.selOpt=parseInt(el.dataset.i);
      document.getElementById('nrSub').style.display='block';
    });
  });
  document.getElementById('nrSub').addEventListener('click',function(){
    if(NR.state&&NR.state.selOpt!==null)nrSubmit(q);
  });
}

function nrSubmit(q) {
  if(!NR.state)return;
  var s=NR.state,sel=s.selOpt,correct=q.correct;
  var opts=document.querySelectorAll('.nropt');
  document.getElementById('nrSub').style.display='none';
  opts.forEach(function(o){o.style.pointerEvents='none';});
  var fb=document.getElementById('nrFb');
  if(sel===correct){
    s.streak++;if(s.streak>s.bestStreak)s.bestStreak=s.streak;
    var boost=(4+Math.min(s.streak*1.2,8))*s.boost;
    s.spd[0]=Math.min(20,(s.spd[0]||0)+boost);
    s.score+=100+(s.streak>1?s.streak*25:0);
    opts[sel].style.borderColor='#27ae60';opts[sel].style.background='var(--green-l)';
    var sm=s.streak>1?' 🔥 '+s.streak+'x STREAK!':'';
    fb.style.cssText='display:block;padding:10px 12px;border-radius:9px;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);font-size:13px;';
    fb.innerHTML='\u2705 <strong>Correct! +'+Math.round(boost)+' speed'+sm+'</strong>'+(q.explain?'<br><span style="font-size:11px;opacity:0.8;">'+q.explain+'</span>':'');
  } else {
    s.streak=0;s.spd[0]=Math.max(0,(s.spd[0]||0)-1.5);
    opts[sel].style.borderColor='#e74c3c';opts[sel].style.background='rgba(231,76,60,0.12)';
    if(opts[correct]){opts[correct].style.borderColor='#27ae60';opts[correct].style.background='var(--green-l)';}
    fb.style.cssText='display:block;padding:10px 12px;border-radius:9px;background:rgba(231,76,60,0.1);color:#c0392b;border:1px solid #e74c3c;font-size:13px;';
    fb.innerHTML='\u274c <strong>Wrong!</strong>'+(q.explain?'<br><span style="font-size:11px;opacity:0.8;">'+q.explain+'</span>':'');
  }
  var sl=document.getElementById('nrStreak');if(sl)sl.textContent='🔥 x'+s.streak;
  var sc=document.getElementById('nrScore');if(sc)sc.textContent='Score: '+s.score;
  s.answered=true;s.qi++;
  setTimeout(function(){if(NR.state&&!NR.state.finished){NR.state.answered=false;nrShowQ();}},1800);
}

function nrEnd() {
  if(!NR.state||NR.state.finished)return;
  NR.state.finished=true;
  if(NR.anim){cancelAnimationFrame(NR.anim);NR.anim=null;}
  var s=NR.state;
  [0,1,2,3,4].forEach(function(i){if(s.finOrder.indexOf(i)<0)s.finOrder.push(i);});
  var place=s.finOrder.indexOf(0)+1;
  var medals=['🥇','🥈','🥉','4️⃣','5️⃣'];
  var placeW=['1st','2nd','3rd','4th','5th'];
  var elapsed=Math.round((Date.now()-s.startTime)/1000);
  var stats=nrSaveResult(s.score,place,s.bestStreak,s.evId,s.diff);
  if(window.addXP)window.addXP(Math.min(200,Math.floor(s.score/10)+(5-place)*15));
  var orderH=s.finOrder.map(function(ci,i){
    var car=NR_CARS[ci],isYou=ci===0;
    return '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:8px;margin-bottom:4px;background:'+(isYou?'rgba(0,188,212,0.12)':'transparent')+';border:'+(isYou?'1px solid var(--teal)':'1px solid transparent')+';">'
      +'<span style="font-size:15px;">'+medals[i]+'</span>'
      +'<div style="width:22px;height:10px;background:'+car.color+';border-radius:2px;flex-shrink:0;"></div>'
      +'<span style="font-size:13px;font-weight:'+(isYou?800:500)+';color:'+(isYou?'var(--teal)':'var(--txt)')+';">'+car.name+'</span>'
      +'<div style="flex:1;"></div>'
      +'<span style="font-size:10px;color:var(--muted);">'+Math.round(s.pos[ci])+'%</span></div>';
  }).join('');
  var winRate=stats.races>0?Math.round((stats.wins/stats.races)*100):0;
  var screen=document.getElementById('screen-race');
  screen.innerHTML=
    '<div style="padding:18px 14px;text-align:center;max-width:480px;margin:0 auto;overflow-y:auto;height:100%;box-sizing:border-box;">'
    +'<div style="font-size:54px;margin-bottom:7px;">'+medals[place-1]+'</div>'
    +'<div style="font-size:22px;font-weight:900;margin-bottom:4px;">'+placeW[place-1]+' Place!</div>'
    +'<div style="font-size:13px;color:var(--muted);margin-bottom:16px;">'+(place===1?'🏆 Champion! You crushed it!':place<=3?'🎉 Great race!':'💪 Keep practicing!')+' \u00b7 '+NR_DIFF[s.diff].label+'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:7px;max-width:320px;margin:0 auto 14px;">'
      +nrSB('🎯 Score',s.score)+nrSB('🔥 Best Streak','x'+s.bestStreak)
      +nrSB('\u2705 Questions',s.qi+'/'+s.qs.length)+nrSB('\u23f1\ufe0f Time',elapsed+'s')
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:11px;max-width:320px;margin:0 auto 12px;text-align:left;">'
      +'<div style="font-size:10px;color:var(--muted);font-weight:700;margin-bottom:7px;text-transform:uppercase;letter-spacing:1px;">Finish Order</div>'
      +orderH
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:11px;max-width:320px;margin:0 auto 16px;">'
      +'<div style="font-size:10px;color:var(--muted);font-weight:700;margin-bottom:7px;text-transform:uppercase;letter-spacing:1px;">📊 Career Stats (Saved on Device)</div>'
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'
        +nrSB('🏁 Races',stats.races)+nrSB('🏆 Wins',stats.wins)
        +nrSB('📈 Win %',winRate+'%')+nrSB('⚡ Best',stats.bestScore)
      +'</div>'
    +'</div>'
    +'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding-bottom:16px;">'
      +'<button onclick="nrStart()" style="padding:13px 26px;background:linear-gradient(135deg,#00bcd4,#0097a7);color:white;border:none;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font);">🚀 Race Again!</button>'
      +'<button onclick="renderRaceGame()" style="padding:13px 18px;background:var(--surf2);color:var(--txt);border:1px solid var(--bord);border-radius:10px;font-size:13px;cursor:pointer;font-family:var(--font);">\u2190 Lobby</button>'
    +'</div></div>';
}

function nrRR(ctx,x,y,w,h,r){if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}else{ctx.beginPath();ctx.rect(x,y,w,h);}}
function nrRGB(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(',');}
function nrSh(h,n){return '#'+[1,3,5].map(function(i){return Math.max(0,Math.min(255,parseInt(h.slice(i,i+2),16)+n)).toString(16).padStart(2,'0');}).join('');}
function nrSB(label,value){return '<div style="background:var(--surf2);border:1px solid var(--bord);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:var(--muted);margin-bottom:2px;">'+label+'</div><div style="font-size:15px;font-weight:800;">'+value+'</div></div>';}
