// ── NITRO RACE — stable UI + event-specific questions + difficulty selector ──
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
    event: null,
    difficulty: 'medium',
    canvasReady: false
  };

  var AI_NAMES = ['Alex', 'Sam', 'Jordan'];
  var AI_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6'];
  var PLAYER_COLOR = '#14b8a6';
  var SUPPORTED_DIFFICULTIES = ['easy', 'medium', 'hard'];

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

  function normalizeQuestion(raw, sourceTag, difficultyTag) {
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
      source: sourceTag || 'quiz',
      difficulty: difficultyTag || raw.difficulty || 'medium'
    };
  }

  function cardTerm(card) {
    return normText(card && (card.term || card.front || card.word || card.title));
  }

  function cardDef(card) {
    return normText(card && (card.def || card.definition || card.back || card.meaning || card.answer));
  }

  function flashcardToQuestion(card, allCards, difficultyTag) {
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
      source: 'flashcard',
      difficulty: difficultyTag || card.difficulty || 'medium'
    };
  }

  function getEvent(evId) {
    if (typeof EVENTS !== 'undefined' && EVENTS && EVENTS[evId]) return EVENTS[evId];
    return null;
  }

  function getCurrentDifficulty() {
    if (window.S && window.S.difficulty && SUPPORTED_DIFFICULTIES.indexOf(window.S.difficulty) !== -1) {
      return window.S.difficulty;
    }
    return RACE.difficulty || 'medium';
  }

  function setCurrentDifficulty(value) {
    var next = SUPPORTED_DIFFICULTIES.indexOf(value) !== -1 ? value : 'medium';
    RACE.difficulty = next;
    if (window.S) {
      window.S.difficulty = next;
    }
  }

  function gatherQuizForDifficulty(ev, difficulty) {
    var bucket = [];
    try {
      bucket = ev.getQuiz ? (ev.getQuiz(difficulty) || []) : [];
    } catch (e) {
      bucket = [];
    }

    return bucket
      .map(function (item) { return normalizeQuestion(item, 'quiz', difficulty); })
      .filter(Boolean);
  }

  function gatherFlashForDifficulty(ev, difficulty) {
    var cards = [];
    try {
      cards = ev.getFlash ? (ev.getFlash(difficulty) || []) : [];
    } catch (e) {
      cards = [];
    }
    return cards || [];
  }

  function buildDifficultyPool(ev, difficulty) {
    var quizPool = gatherQuizForDifficulty(ev, difficulty);

    var flashcards = gatherFlashForDifficulty(ev, difficulty);
    flashcards = uniqBy(flashcards, function (c) {
      return normKey(cardTerm(c) + '::' + cardDef(c));
    });

    var flashQuestions = flashcards
      .map(function (card) {
        return flashcardToQuestion(card, flashcards, difficulty);
      })
      .filter(Boolean);

    return uniqBy(
      quizPool.concat(flashQuestions),
      function (q) { return normKey(q.prompt); }
    );
  }

  function getRaceQuestions(evId, difficulty) {
    var ev = getEvent(evId);
    if (!ev) return [];

    // Strictly only selected event
    var primaryPool = buildDifficultyPool(ev, difficulty);

    // If the chosen difficulty is sparse, top up from same event only
    var merged = primaryPool.slice();

    if (merged.length < 12) {
      SUPPORTED_DIFFICULTIES.forEach(function (d) {
        if (d === difficulty) return;
        var extra = buildDifficultyPool(ev, d);
        merged = uniqBy(
          merged.concat(extra),
          function (q) { return normKey(q.prompt); }
        );
      });
    }

    // Better to repeat same-event questions than mix events
    if (merged.length > 0 && merged.length < 20) {
      var expanded = [];
      while (expanded.length < 20) {
        expanded = expanded.concat(shuffle(merged));
      }
      merged = expanded;
    }

    return shuffle(merged).slice(0, 20);
  }

  function getButtonClass() {
    var startBtn = document.getElementById('raceStartBtn');
    if (startBtn && startBtn.className) return startBtn.className;
    return 'btn primary';
  }

  function fitRaceCanvas() {
    var canvas = document.getElementById('raceCanvas');
    if (!canvas) return;

    var parent = canvas.parentElement;
    var cssWidth = Math.max(360, Math.min(parent ? parent.clientWidth : window.innerWidth, window.innerWidth - 24));
    var cssHeight = Math.max(180, Math.min(220, Math.round(cssWidth * 0.26)));
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RACE.canvasReady = true;
  }

  function ensureDifficultyControls() {
    var container = document.getElementById('raceDifficultyWrap');
    var statusEl = document.getElementById('raceStatus');
    if (!statusEl) return;

    if (!container) {
      container = document.createElement('div');
      container.id = 'raceDifficultyWrap';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '10px';
      container.style.flexWrap = 'wrap';
      container.style.marginTop = '10px';
      container.style.marginBottom = '8px';

      var label = document.createElement('div');
      label.textContent = 'Difficulty';
      label.style.fontFamily = 'inherit';
      label.style.fontSize = '14px';
      label.style.fontWeight = '600';
      label.style.color = 'var(--text)';
      container.appendChild(label);

      var select = document.createElement('select');
      select.id = 'raceDifficultySelect';
      select.style.padding = '10px 12px';
      select.style.borderRadius = '12px';
      select.style.border = '1px solid var(--bord)';
      select.style.background = 'var(--surf2)';
      select.style.color = 'var(--text)';
      select.style.fontFamily = 'inherit';
      select.style.fontSize = '14px';
      select.style.fontWeight = '600';
      select.style.minWidth = '130px';

      SUPPORTED_DIFFICULTIES.forEach(function (d) {
        var option = document.createElement('option');
        option.value = d;
        option.textContent = d.charAt(0).toUpperCase() + d.slice(1);
        select.appendChild(option);
      });

      select.addEventListener('change', function () {
        setCurrentDifficulty(select.value);
        if (RACE.active) {
          initRace(window.S && window.S.currentEvent ? window.S.currentEvent : 'terminology');
        } else {
          window.renderRaceGame();
        }
      });

      container.appendChild(select);
      statusEl.parentNode.insertBefore(container, statusEl.nextSibling);
    }

    var selectEl = document.getElementById('raceDifficultySelect');
    if (selectEl) {
      selectEl.value = getCurrentDifficulty();
    }
  }

  function optionButtonHtml(label, i, text) {
    return (
      '<button class="race-opt" data-i="' + i + '" ' +
      'style="' +
      'display:block;width:100%;text-align:left;padding:14px 16px;margin:10px 0;' +
      'border:2px solid var(--bord);border-radius:16px;background:var(--surf2);' +
      'color:var(--text);font-family:inherit;font-size:15px;font-weight:600;' +
      'line-height:1.35;cursor:pointer;box-shadow:0 1px 0 rgba(255,255,255,0.04) inset;' +
      '">' +
      label + '. ' + text +
      '</button>'
    );
  }

  function initRace(evId) {
    var difficulty = getCurrentDifficulty();
    RACE.questions = getRaceQuestions(evId, difficulty);

    if (!RACE.questions.length) {
      var statusEl = document.getElementById('raceStatus');
      if (statusEl) {
        statusEl.textContent = 'No usable ' + difficulty + ' practice questions found for this event yet.';
      }
      return;
    }

    RACE.active = true;
    RACE.qIdx = 0;
    RACE.playerPos = 0;
    RACE.aiPos = [0, 0, 0];
    RACE.aiSpeed = [0.20, 0.18, 0.16];
    RACE.playerSpeed = 0;
    RACE.score = 0;
    RACE.streak = 0;
    RACE.finished = false;
    RACE.finishOrder = [];
    RACE.event = evId;
    RACE.difficulty = difficulty;

    fitRaceCanvas();

    var raceQuestion = document.getElementById('raceQuestion');
    var raceResult = document.getElementById('raceResult');
    var raceStartBtn = document.getElementById('raceStartBtn');
    var raceStatus = document.getElementById('raceStatus');
    var streakBar = document.getElementById('raceStreakBar');

    if (raceQuestion) raceQuestion.style.display = 'block';
    if (raceResult) raceResult.style.display = 'none';
    if (raceStartBtn) raceStartBtn.style.display = 'none';
    if (raceStatus) raceStatus.textContent = 'Now racing in ' + difficulty + ' mode.';
    if (streakBar) streakBar.style.width = '0%';

    renderRaceQ();
    drawTrack();

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

    RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 0.13);
    RACE.playerPos = Math.min(100, RACE.playerPos + RACE.playerSpeed * 0.48);

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
    if (!canvas || !RACE.canvasReady) return;

    var ctx = canvas.getContext('2d');
    var W = parseFloat(canvas.style.width) || 560;
    var H = parseFloat(canvas.style.height) || 200;

    ctx.clearRect(0, 0, W, H);

    var sky = ctx.createLinearGradient(0, 0, 0, H * 0.54);
    sky.addColorStop(0, '#081221');
    sky.addColorStop(1, '#17385c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.56);

    var road = ctx.createLinearGradient(0, H * 0.54, 0, H);
    road.addColorStop(0, '#2a2a2a');
    road.addColorStop(1, '#181818');
    ctx.fillStyle = road;
    ctx.fillRect(0, H * 0.56, W, H * 0.44);

    var finishW = 18;
    var finishX = W - finishW - 14;
    for (var fi = 0; fi < 10; fi++) {
      ctx.fillStyle = fi % 2 === 0 ? '#fff' : '#111';
      ctx.fillRect(finishX, H * 0.57 + fi * (H * 0.04), finishW, H * 0.04);
    }

    var laneTop = H * 0.62;
    var laneGap = H * 0.095;
    var lanes = [laneTop, laneTop + laneGap, laneTop + laneGap * 2, laneTop + laneGap * 3];

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    for (var li = 0; li < lanes.length; li++) {
      ctx.beginPath();
      ctx.moveTo(70, lanes[li] + 12);
      ctx.lineTo(finishX - 10, lanes[li] + 12);
      ctx.stroke();
    }

    var leftLabelX = 38;
    var startX = 96;
    var carW = 28;
    var carH = 12;
    var travelW = finishX - startX - carW - 14;

    var carData = [
      { pos: RACE.playerPos, color: PLAYER_COLOR, label: 'YOU', lane: lanes[0] },
      { pos: RACE.aiPos[0], color: AI_COLORS[0], label: AI_NAMES[0], lane: lanes[1] },
      { pos: RACE.aiPos[1], color: AI_COLORS[1], label: AI_NAMES[1], lane: lanes[2] },
      { pos: RACE.aiPos[2], color: AI_COLORS[2], label: AI_NAMES[2], lane: lanes[3] }
    ];

    carData.forEach(function (car) {
      var x = startX + (car.pos / 100) * travelW;
      var y = car.lane;

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(car.label, leftLabelX, y + 3);

      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect(x - carW / 2, y - carH / 2, carW, carH, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(220,240,255,0.7)';
      ctx.beginPath();
      ctx.roundRect(x - 3, y - 5, 9, 5, 2);
      ctx.fill();

      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - 8, y + 6, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 8, y + 6, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.setLineDash([22, 14]);
    ctx.beginPath();
    ctx.moveTo(startX - 10, H * 0.75);
    ctx.lineTo(finishX - 12, H * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(0, H - 18, W, 18);

    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(0, H - 18, (RACE.playerPos / 100) * W, 18);

    ctx.fillStyle = '#fff';
    ctx.font = '600 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      'Progress: ' + Math.round(RACE.playerPos) + '%   Q:' + (RACE.qIdx + 1) + '/' + RACE.questions.length + '   ' + RACE.difficulty.toUpperCase(),
      10,
      H - 5
    );
  }

  function renderRaceQ() {
    var qArea = document.getElementById('raceQArea');
    if (!qArea) return;

    if (RACE.qIdx >= RACE.questions.length) {
      qArea.innerHTML = '<div style="padding:14px 2px;font-family:inherit;font-size:16px;font-weight:700;color:var(--text);">All questions answered! Finishing race...</div>';
      return;
    }

    var q = RACE.questions[RACE.qIdx];
    var opts = q.opts || [];

    var html = '';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:12px 0 10px 0;">';
    html += '<div style="font-family:inherit;font-size:13px;font-weight:700;color:var(--muted, #94a3b8);letter-spacing:.04em;text-transform:uppercase;">Nitro Race • ' + RACE.difficulty + '</div>';
    html += '</div>';

    html += '<div style="font-family:inherit;font-size:16px;font-weight:700;line-height:1.45;margin:8px 0 14px 0;color:var(--text);">';
    html += (q.prompt || 'Question unavailable');
    html += '</div>';

    html += '<div>';
    opts.forEach(function (o, i) {
      html += optionButtonHtml(String.fromCharCode(65 + i), i, o);
    });
    html += '</div>';

    html += '<div id="raceFeedback" style="display:none;font-family:inherit;"></div>';
    html += '<div style="margin-top:16px;">';
    html += '<button id="raceSubmit" class="' + getButtonClass() + '" style="display:none;min-width:180px;padding:12px 18px;font-family:inherit;font-size:15px;font-weight:700;border-radius:14px;">Submit ⚡</button>';
    html += '</div>';

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
          o.style.fontWeight = '600';
        });

        el.style.borderColor = 'var(--teal)';
        el.style.background = 'rgba(20,184,166,0.12)';
        selected = parseInt(el.dataset.i, 10);

        if (submitEl) submitEl.style.display = 'inline-flex';
      };
    });

    if (submitEl) {
      submitEl.onclick = function () {
        if (selected === null) return;

        var correct = q.correctIndex;
        submitEl.style.display = 'none';

        optEls.forEach(function (o) {
          o.style.pointerEvents = 'none';
        });

        if (selected === correct) {
          RACE.streak++;
          var boost = 2.8 + Math.min(RACE.streak, 5);
          RACE.playerSpeed = Math.min(11, RACE.playerSpeed + boost);
          RACE.score += 100 + (RACE.streak > 1 ? RACE.streak * 20 : 0);

          optEls[selected].style.background = 'var(--green-l)';
          optEls[selected].style.borderColor = 'var(--green)';

          if (feedbackEl) {
            feedbackEl.style.cssText = 'display:block;background:var(--green-l);color:var(--green-d);border:1px solid var(--green);padding:10px 12px;border-radius:12px;margin-top:12px;font-family:inherit;font-size:13px;';
            feedbackEl.textContent = '✅ Correct! +' + Math.round(boost) + ' speed' + (RACE.streak > 1 ? ' (' + RACE.streak + 'x streak!)' : '');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1000);
        } else {
          RACE.streak = 0;
          RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 0.9);

          optEls[selected].style.background = 'rgba(239,68,68,0.14)';
          optEls[selected].style.borderColor = '#ef4444';

          if (optEls[correct]) {
            optEls[correct].style.background = 'var(--green-l)';
            optEls[correct].style.borderColor = 'var(--green)';
          }

          if (feedbackEl) {
            feedbackEl.style.cssText = 'display:block;background:rgba(239,68,68,0.08);color:#b91c1c;border:1px solid #ef4444;padding:10px 12px;border-radius:12px;margin-top:12px;font-family:inherit;font-size:13px;';
            feedbackEl.textContent = '❌ ' + (q.explain || 'Wrong answer — no speed boost');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1500);
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

    if (RACE.qIdx >= RACE.questions.length) {
      var qArea = document.getElementById('raceQArea');
      if (qArea) {
        qArea.innerHTML = '<div style="padding:14px 2px;font-family:inherit;font-size:16px;font-weight:700;color:var(--text);">All questions answered! 🏁</div>';
      }
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
        '<div style="text-align:center;padding:18px;font-family:inherit;color:var(--text);">'
        + '<div style="font-size:48px;">' + medal + '</div>'
        + '<div style="font-size:26px;font-weight:800;margin-top:8px;">' + placeStr + ' Place!</div>'
        + '<div style="margin-top:10px;font-size:17px;">Score: ' + RACE.score + ' pts</div>'
        + '<div style="margin-top:6px;font-size:15px;">Answered ' + RACE.qIdx + '/' + RACE.questions.length + ' questions</div>'
        + '<div style="margin-top:12px;font-size:13px;">FINISH ORDER: '
        + RACE.finishOrder.map(function (f) {
          return f === 'player' ? 'YOU' : AI_NAMES[parseInt(f.slice(2), 10)];
        }).join(' → ')
        + '</div>'
        + '<div style="margin-top:18px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">'
        + '<button class="' + getButtonClass() + '" style="padding:12px 18px;font-family:inherit;font-size:15px;font-weight:700;border-radius:14px;" onclick="startRace()">Race Again 🚀</button>'
        + '<button class="btn" style="padding:12px 18px;font-family:inherit;font-size:15px;font-weight:700;border-radius:14px;" onclick="showScreen(\'home\')">Back to Home</button>'
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
    var difficulty = getCurrentDifficulty();

    fitRaceCanvas();
    ensureDifficultyControls();

    var lbl = document.getElementById('raceEventName');
    var startBtn = document.getElementById('raceStartBtn');
    var rq = document.getElementById('raceQuestion');
    var rr = document.getElementById('raceResult');
    var rs = document.getElementById('raceStatus');

    if (lbl) lbl.textContent = evName;
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (rq) rq.style.display = 'none';
    if (rr) rr.style.display = 'none';

    var previewCount = getRaceQuestions(evId, difficulty).length;
    if (rs) {
      rs.textContent = previewCount
        ? ('Loaded ' + previewCount + ' ' + difficulty + ' practice questions for ' + evName + '.')
        : ('No usable ' + difficulty + ' practice questions found for ' + evName + ' yet.');
    }

    drawTrack();
  };

  window.initRaceScreen = window.renderRaceGame;

  window.addEventListener('resize', function () {
    fitRaceCanvas();
    drawTrack();
  });
})();