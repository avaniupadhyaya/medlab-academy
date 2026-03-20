// ── NITRO RACE — responsive + resilient question loading ────────────────────
(function () {
  var RACE = {
    active: false,
    questions: [],
    qIdx: 0,
    playerPos: 0,
    aiPos: [0, 0, 0],
    aiSpeed: [0, 0, 0],
    playerSpeed: 0,
    frameId: null,
    score: 0,
    streak: 0,
    finished: false,
    finishOrder: [],
    event: null
  };

  var AI_NAMES = ['Alex', 'Sam', 'Jordan'];
  var AI_COLORS = ['#e74c3c', '#f39c12', '#9b59b6'];
  var PLAYER_COLOR = '#00bcd4';

  function normText(v) {
    return String(v == null ? '' : v).trim();
  }

  function normKey(v) {
    return normText(v).toLowerCase();
  }

  function shuffle(arr) {
    var a = (arr || []).slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function uniqBy(arr, keyFn) {
    var out = [];
    var seen = {};
    (arr || []).forEach(function (item) {
      var k = keyFn(item);
      if (!k || seen[k]) return;
      seen[k] = true;
      out.push(item);
    });
    return out;
  }

  function questionStem(raw) {
    return normText(
      raw && (
        raw.prompt ||
        raw.q ||
        raw.question ||
        raw.scenario ||
        raw.text ||
        raw.stem
      )
    );
  }

  function optionList(raw) {
    if (!raw) return [];
    if (Array.isArray(raw.opts)) return raw.opts.map(String);
    if (Array.isArray(raw.options)) return raw.options.map(String);
    if (Array.isArray(raw.choices)) return raw.choices.map(String);
    if (Array.isArray(raw.answers)) return raw.answers.map(String);
    return [];
  }

  function explainText(raw) {
    return normText(
      raw && (
        raw.explain ||
        raw.explanation ||
        raw.why ||
        raw.breakdown ||
        ''
      )
    );
  }

  function normalizeQuestion(raw, sourceTag) {
    if (!raw) return null;

    var prompt = questionStem(raw);
    var opts = optionList(raw);
    var explanation = explainText(raw);

    if (!prompt || !opts.length) return null;

    var correctIndex = -1;

    if (typeof raw.correct === 'number') {
      correctIndex = raw.correct;
    } else if (typeof raw.answer === 'number') {
      correctIndex = raw.answer;
    } else if (typeof raw.correctIndex === 'number') {
      correctIndex = raw.correctIndex;
    } else {
      var answerText = normText(
        raw.correctAnswer ||
        raw.answer ||
        raw.correct ||
        raw.solution
      );

      if (answerText) {
        for (var i = 0; i < opts.length; i++) {
          if (normKey(opts[i]) === normKey(answerText)) {
            correctIndex = i;
            break;
          }
        }
      }
    }

    if (correctIndex < 0 || correctIndex >= opts.length) return null;

    return {
      id: raw.id || (sourceTag + '_' + Math.random().toString(36).slice(2, 10)),
      prompt: prompt,
      opts: opts,
      correctIndex: correctIndex,
      explain: explanation,
      source: sourceTag || 'quiz'
    };
  }

  function cardTerm(card) {
    return normText(card && (card.term || card.front || card.word || card.title));
  }

  function cardDef(card) {
    return normText(card && (card.def || card.definition || card.back || card.meaning || card.answer));
  }

  function flashcardToQuestion(card, allCards) {
    var term = cardTerm(card);
    var def = cardDef(card);
    if (!term || !def) return null;

    var distractors = [];
    var seen = {};
    (allCards || []).forEach(function (c) {
      var d = cardDef(c);
      if (!d) return;
      if (normKey(d) === normKey(def)) return;
      if (seen[normKey(d)]) return;
      seen[normKey(d)] = true;
      distractors.push(d);
    });

    distractors = shuffle(distractors).slice(0, 3);

    while (distractors.length < 3) {
      var filler = [
        'A different medical concept',
        'A different condition or process',
        'A term from another topic'
      ][distractors.length];
      distractors.push(filler);
    }

    var opts = distractors.slice();
    var correctIndex = Math.floor(Math.random() * 4);
    opts.splice(correctIndex, 0, def);

    return {
      id: card.id || ('flash_' + Math.random().toString(36).slice(2, 10)),
      prompt: 'What does "' + term + '" mean?',
      opts: opts,
      correctIndex: correctIndex,
      explain: explainText(card) || def,
      source: 'flashcard'
    };
  }

  function getEvent(evId) {
    if (typeof EVENTS !== 'undefined' && EVENTS && EVENTS[evId]) return EVENTS[evId];
    return null;
  }

  function getDiagnosisDetectiveFallback() {
    var out = [];

    if (
      typeof window !== 'undefined' &&
      window.QUESTION_BANK &&
      window.QUESTION_BANK.diagnosisDetective
    ) {
      ['easy', 'medium', 'hard'].forEach(function (d) {
        var bucket = window.QUESTION_BANK.diagnosisDetective[d] || [];
        bucket.forEach(function (item) {
          var normalized = normalizeQuestion({
            q: item.scenario || item.q || item.question,
            opts: item.options || item.opts || item.choices,
            correct: item.correct,
            explain: item.explain || item.explanation
          }, 'diagnosisDetective');

          if (normalized) out.push(normalized);
        });
      });
    }

    return out;
  }

  function getRaceQuestions(evId) {
    var ev = getEvent(evId);
    if (!ev) return [];

    var quizPool = [];

    ['easy', 'medium', 'hard'].forEach(function (d) {
      var bucket = [];
      try {
        bucket = ev.getQuiz ? (ev.getQuiz(d) || []) : [];
      } catch (e) {
        bucket = [];
      }

      bucket.forEach(function (item) {
        var normalized = normalizeQuestion(item, 'quiz');
        if (normalized) quizPool.push(normalized);
      });
    });

    if (!quizPool.length) {
      quizPool = quizPool.concat(getDiagnosisDetectiveFallback());
    }

    var flashcards = [];
    ['easy', 'medium', 'hard'].forEach(function (d) {
      var cards = [];
      try {
        cards = ev.getFlash ? (ev.getFlash(d) || []) : [];
      } catch (e) {
        cards = [];
      }
      flashcards = flashcards.concat(cards);
    });

    flashcards = uniqBy(flashcards, function (c) {
      return normKey(cardTerm(c) + '::' + cardDef(c));
    });

    var flashQuestions = [];
    flashcards.forEach(function (card) {
      var q = flashcardToQuestion(card, flashcards);
      if (q) flashQuestions.push(q);
    });

    var merged = uniqBy(
      quizPool.concat(flashQuestions),
      function (q) {
        return normKey(q.prompt);
      }
    );

    return shuffle(merged).slice(0, 20);
  }

  function fitRaceCanvas() {
    var canvas = document.getElementById('raceCanvas');
    if (!canvas) return;

    var parent = canvas.parentElement;
    var cssWidth = Math.max(320, Math.min(parent ? parent.clientWidth : window.innerWidth, window.innerWidth - 16));
    var cssHeight = Math.max(130, Math.min(190, Math.round(cssWidth * 0.28)));
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initRace(evId) {
    RACE.questions = getRaceQuestions(evId);

    if (!RACE.questions.length) {
      var statusEl = document.getElementById('raceStatus');
      if (statusEl) {
        statusEl.textContent = 'No usable practice questions found for this event yet.';
      }
      return;
    }

    RACE.active = true;
    RACE.qIdx = 0;
    RACE.playerPos = 0;
    RACE.aiPos = [0, 0, 0];
    RACE.aiSpeed = [
      0.28 + Math.random() * 0.12,
      0.22 + Math.random() * 0.15,
      0.18 + Math.random() * 0.18
    ];
    RACE.playerSpeed = 0;
    RACE.score = 0;
    RACE.streak = 0;
    RACE.finished = false;
    RACE.finishOrder = [];
    RACE.event = evId;

    fitRaceCanvas();

    var raceQuestion = document.getElementById('raceQuestion');
    var raceResult = document.getElementById('raceResult');
    var raceStartBtn = document.getElementById('raceStartBtn');
    var raceStatus = document.getElementById('raceStatus');
    var streakBar = document.getElementById('raceStreakBar');

    if (raceQuestion) raceQuestion.style.display = 'block';
    if (raceResult) raceResult.style.display = 'none';
    if (raceStartBtn) raceStartBtn.style.display = 'none';
    if (raceStatus) raceStatus.textContent = '';
    if (streakBar) streakBar.style.width = '0%';

    renderRaceQ();

    if (RACE.frameId) cancelAnimationFrame(RACE.frameId);
    raceLoop();
  }

  function raceLoop() {
    if (!RACE.active) return;

    for (var i = 0; i < 3; i++) {
      if (RACE.aiPos[i] < 100) {
        RACE.aiPos[i] = Math.min(100, RACE.aiPos[i] + RACE.aiSpeed[i] * 0.5);
        if (RACE.aiPos[i] >= 100 && RACE.finishOrder.indexOf('ai' + i) === -1) {
          RACE.finishOrder.push('ai' + i);
        }
      }
    }

    RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 0.15);
    RACE.playerPos = Math.min(100, RACE.playerPos + RACE.playerSpeed * 0.5);

    if (RACE.playerPos >= 100 && RACE.finishOrder.indexOf('player') === -1) {
      RACE.finishOrder.push('player');
    }

    drawTrack();

    if (RACE.finishOrder.length === 4 || (RACE.playerPos >= 100 && RACE.qIdx >= RACE.questions.length)) {
      endRace();
      return;
    }

    RACE.frameId = requestAnimationFrame(raceLoop);
  }

  function drawTrack() {
    var canvas = document.getElementById('raceCanvas');
    if (!canvas) return;

    fitRaceCanvas();

    var ctx = canvas.getContext('2d');
    var W = parseFloat(canvas.style.width) || 360;
    var H = parseFloat(canvas.style.height) || 140;

    ctx.clearRect(0, 0, W, H);

    var sky = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    sky.addColorStop(0, '#0a1628');
    sky.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.55);

    var road = ctx.createLinearGradient(0, H * 0.5, 0, H);
    road.addColorStop(0, '#2a2a2a');
    road.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = road;
    ctx.fillRect(0, H * 0.5, W, H * 0.5);

    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = Math.max(2, W * 0.004);
    ctx.setLineDash([Math.max(12, W * 0.04), Math.max(8, W * 0.03)]);
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.lineTo(W, H * 0.72);
    ctx.stroke();
    ctx.setLineDash([]);

    var finW = Math.max(14, W * 0.03);
    var finX = W - finW - 8;
    for (var fi = 0; fi < 8; fi++) {
      ctx.fillStyle = fi % 2 === 0 ? '#fff' : '#000';
      ctx.fillRect(finX, H * 0.52 + fi * (H * 0.06), finW, H * 0.06);
    }

    var lanes = [H * 0.58, H * 0.66, H * 0.74, H * 0.82];
    var carW = Math.max(26, Math.min(36, W * 0.08));
    var carH = Math.max(10, Math.min(14, H * 0.1));
    var startX = Math.max(20, W * 0.04);
    var travelW = finX - startX - carW - 8;

    var carData = [
      { pos: RACE.playerPos, color: PLAYER_COLOR, label: 'YOU', lane: lanes[0] },
      { pos: RACE.aiPos[0], color: AI_COLORS[0], label: AI_NAMES[0], lane: lanes[1] },
      { pos: RACE.aiPos[1], color: AI_COLORS[1], label: AI_NAMES[1], lane: lanes[2] },
      { pos: RACE.aiPos[2], color: AI_COLORS[2], label: AI_NAMES[2], lane: lanes[3] }
    ];

    carData.forEach(function (car) {
      var x = startX + (car.pos / 100) * travelW;
      var y = car.lane;

      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect(x - carW / 2, y - carH / 2, carW, carH, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(200,230,255,0.6)';
      ctx.beginPath();
      ctx.roundRect(x - carW * 0.1, y - carH * 0.45, carW * 0.4, carH * 0.55, 2);
      ctx.fill();

      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(x - carW * 0.28, y + carH * 0.45, Math.max(2, carH * 0.28), 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + carW * 0.28, y + carH * 0.45, Math.max(2, carH * 0.28), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffe066';
      ctx.beginPath();
      ctx.arc(x + carW * 0.52, y, Math.max(2, carH * 0.18), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold ' + Math.max(8, Math.round(W * 0.022)) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(car.label, x, y - carH * 0.9);
    });

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, H - 14, W, 14);

    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(0, H - 14, (RACE.playerPos / 100) * W, 14);

    ctx.fillStyle = '#fff';
    ctx.font = Math.max(8, Math.round(W * 0.022)) + 'px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      'Progress: ' + Math.round(RACE.playerPos) + '%  Q:' + (RACE.qIdx + 1) + '/' + RACE.questions.length,
      6,
      H - 3
    );
  }

  function renderRaceQ() {
    var qArea = document.getElementById('raceQArea');
    if (!qArea) return;

    if (RACE.qIdx >= RACE.questions.length) {
      qArea.innerHTML = '<div style="padding:10px;font-weight:700;">All questions answered! Finishing race...</div>';
      return;
    }

    var q = RACE.questions[RACE.qIdx];
    var opts = q.opts || [];

    var html = '';
    html += '<div style="font-size:clamp(20px, 5vw, 26px);font-weight:800;margin:8px 0 14px 0;line-height:1.25;">'
      + (q.prompt || q.q || q.question || 'Question unavailable')
      + '</div>';
    html += '<div>';
    opts.forEach(function (o, i) {
      html += ''
        + '<button class="race-opt" data-i="' + i + '" '
        + 'style="display:block;width:100%;text-align:left;padding:16px 18px;margin:10px 0;'
        + 'border:2px solid var(--bord);border-radius:16px;background:var(--surf2);color:var(--text);'
        + 'font-size:clamp(16px, 4vw, 18px);font-weight:600;cursor:pointer;">'
        + String.fromCharCode(65 + i) + '. ' + o
        + '</button>';
    });
    html += '</div>';
    html += '<div id="raceFeedback" style="display:none;"></div>';
    html += '<button id="raceSubmit" style="display:none;margin-top:12px;" class="btn primary">Submit ⚡</button>';

    qArea.innerHTML = html;

    var selected = null;
    var feedbackEl = document.getElementById('raceFeedback');
    var submitEl = document.getElementById('raceSubmit');
    var optEls = document.querySelectorAll('.race-opt');

    optEls.forEach(function (el) {
      el.onclick = function () {
        if (feedbackEl && feedbackEl.style.display !== 'none') return;

        optEls.forEach(function (o) {
          o.style.borderColor = 'var(--bord)';
          o.style.background = 'var(--surf2)';
          o.style.fontWeight = '';
        });

        el.style.borderColor = 'var(--teal)';
        el.style.background = 'rgba(0,188,212,0.12)';
        el.style.fontWeight = '700';
        selected = parseInt(el.dataset.i, 10);

        if (submitEl) submitEl.style.display = 'block';
      };
    });

    if (submitEl) {
      submitEl.onclick = function () {
        if (selected === null) return;

        var correct = q.correctIndex;
        if (submitEl) submitEl.style.display = 'none';

        optEls.forEach(function (o) {
          o.style.pointerEvents = 'none';
        });

        if (selected === correct) {
          RACE.streak++;
          var boost = 3 + Math.min(RACE.streak, 5);
          RACE.playerSpeed = Math.min(12, RACE.playerSpeed + boost);
          RACE.score += 100 + (RACE.streak > 1 ? RACE.streak * 20 : 0);

          optEls[selected].style.background = 'var(--green-l)';
          optEls[selected].style.borderColor = 'var(--green)';

          if (feedbackEl) {
            feedbackEl.style.cssText = 'display:block;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);padding:8px;border-radius:7px;margin-top:7px;font-size:12px;';
            feedbackEl.textContent = '✅ Correct! +' + boost + ' speed' + (RACE.streak > 1 ? ' (' + RACE.streak + 'x streak!)' : '');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1200);
        } else {
          RACE.streak = 0;
          RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 1);

          optEls[selected].style.background = 'rgba(231,76,60,0.15)';
          optEls[selected].style.borderColor = '#e74c3c';

          if (optEls[correct]) {
            optEls[correct].style.background = 'var(--green-l)';
            optEls[correct].style.borderColor = 'var(--green)';
          }

          if (feedbackEl) {
            feedbackEl.style.cssText = 'display:block;background:rgba(231,76,60,0.1);color:#c0392b;border:1px solid #e74c3c;padding:8px;border-radius:7px;margin-top:7px;font-size:12px;';
            feedbackEl.textContent = '❌ ' + (q.explain || 'Wrong answer — no speed boost');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1800);
        }
      };
    }
  }

  function updateStreakBar() {
    var pct = Math.min(100, (RACE.streak / 5) * 100);
    var bar = document.getElementById('raceStreakBar');
    if (bar) bar.style.width = pct + '%';
  }

  function nextRaceQ() {
    RACE.qIdx++;
    var qArea = document.getElementById('raceQArea');

    if (RACE.qIdx >= RACE.questions.length) {
      if (qArea) qArea.innerHTML = '<div style="padding:10px;font-weight:700;">All questions answered! 🏁</div>';
      return;
    }

    renderRaceQ();
  }

  function endRace() {
    RACE.active = false;
    if (RACE.frameId) cancelAnimationFrame(RACE.frameId);

    if (RACE.finishOrder.indexOf('player') === -1) RACE.finishOrder.push('player');
    for (var i = 0; i < 3; i++) {
      if (RACE.finishOrder.indexOf('ai' + i) === -1) {
        RACE.finishOrder.push('ai' + i);
      }
    }

    var playerPlace = RACE.finishOrder.indexOf('player') + 1;
    var placeStr = ['🥇 1st', '🥈 2nd', '🥉 3rd', '4th'][playerPlace - 1] || (playerPlace + 'th');
    var medal = playerPlace === 1 ? '🏆' : playerPlace === 2 ? '🥈' : playerPlace === 3 ? '🥉' : '🏁';

    if (window.addXP) {
      window.addXP(RACE.score > 0 ? Math.min(200, Math.floor(RACE.score / 10)) : 10);
    }

    var raceQuestion = document.getElementById('raceQuestion');
    var raceResult = document.getElementById('raceResult');

    if (raceQuestion) raceQuestion.style.display = 'none';
    if (raceResult) {
      raceResult.style.display = 'block';
      raceResult.innerHTML =
        '<div style="text-align:center;padding:18px;">'
        + '<div style="font-size:54px;">' + medal + '</div>'
        + '<div style="font-size:28px;font-weight:800;margin-top:8px;">' + placeStr + ' Place!</div>'
        + '<div style="margin-top:10px;font-size:18px;">Score: ' + RACE.score + ' pts</div>'
        + '<div style="margin-top:6px;">Answered ' + RACE.qIdx + '/' + RACE.questions.length + ' questions</div>'
        + '<div style="margin-top:12px;font-size:14px;">FINISH ORDER: '
        + RACE.finishOrder.map(function (f) {
          return f === 'player' ? 'YOU' : AI_NAMES[parseInt(f.slice(2), 10)];
        }).join(' → ')
        + '</div>'
        + '<div style="margin-top:18px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">'
        + '<button class="btn primary" onclick="startRace()">Race Again 🚀</button>'
        + '<button class="btn" onclick="showScreen(\'home\')">Back to Home</button>'
        + '</div>'
        + '</div>';
    }
  }

  window.startRace = function () {
    var evId = window.S && window.S.currentEvent ? window.S.currentEvent : 'terminology';
    initRace(evId);
  };

  window.renderRaceGame = function () {
    var evId = window.S && window.S.currentEvent ? window.S.currentEvent : 'terminology';
    var ev = getEvent(evId);
    var evName = ev ? ev.name : 'Current Event';

    fitRaceCanvas();

    var lbl = document.getElementById('raceEventName');
    var startBtn = document.getElementById('raceStartBtn');
    var rq = document.getElementById('raceQuestion');
    var rr = document.getElementById('raceResult');
    var rs = document.getElementById('raceStatus');

    if (lbl) lbl.textContent = evName;
    if (startBtn) startBtn.style.display = 'block';
    if (rq) rq.style.display = 'none';
    if (rr) rr.style.display = 'none';

    var previewCount = getRaceQuestions(evId).length;
    if (rs) {
      rs.textContent = previewCount
        ? ('Loaded ' + previewCount + ' practice questions for this event.')
        : 'No usable practice questions found for this event yet.';
    }

    drawTrack();
  };

  window.initRaceScreen = window.renderRaceGame;
  window.addEventListener('resize', function () {
    if (document.getElementById('raceCanvas')) drawTrack();
  });
})();