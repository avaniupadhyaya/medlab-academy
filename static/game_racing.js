// ── NITRO RACE — responsive + event-specific + progress outside canvas ──────
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

  function isMobileRace() {
    return window.innerWidth <= 768;
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
    if (window.S) window.S.difficulty = next;
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

    var primaryPool = buildDifficultyPool(ev, difficulty);
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
    var maxWidth = parent ? parent.clientWidth : window.innerWidth;
    var cssWidth = Math.max(320, Math.min(maxWidth, window.innerWidth - 16));
    var cssHeight = isMobileRace()
      ? Math.max(135, Math.min(155, Math.round(cssWidth * 0.20)))
      : Math.max(180, Math.min(220, Math.round(cssWidth * 0.24)));

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
    if (selectEl) selectEl.value = getCurrentDifficulty();
  }

  function ensureRaceMetaRow() {
    var titleEl = document.getElementById('raceEventName');
    if (!titleEl || !titleEl.parentNode) return null;

    var meta = document.getElementById('raceProgressMeta');
    if (!meta) {
      meta = document.createElement('div');
      meta.id = 'raceProgressMeta';
      meta.style.marginTop = '4px';
      meta.style.fontFamily = 'inherit';
      meta.style.fontSize = '13px';
      meta.style.fontWeight = '600';
      meta.style.color = 'var(--muted, #94a3b8)';
      meta.style.letterSpacing = '.02em';
      titleEl.parentNode.appendChild(meta);
    }
    return meta;
  }

  function updateRaceMeta() {
    var meta = ensureRaceMetaRow();
    if (!meta) return;

    var total = RACE.questions && RACE.questions.length ? RACE.questions.length : 20;
    var questionNumber = Math.min(RACE.qIdx + 1, total);
    meta.textContent =
      'Progress ' + Math.round(RACE.playerPos) + '% • Q ' + questionNumber + '/' + total + ' • ' + (RACE.difficulty || getCurrentDifficulty()).toUpperCase();
  }

  function optionButtonHtml(label, i, text) {
    var mobile = isMobileRace();
    return (
      '<button class="race-opt" data-i="' + i + '" ' +
      'style="' +
      'display:block;width:100%;text-align:left;' +
      'padding:' + (mobile ? '12px 14px' : '12px 16px') + ';' +
      'margin:' + (mobile ? '8px 0' : '10px 0') + ';' +
      'border:1.5px solid var(--bord);border-radius:16px;background:var(--surf2);' +
      'color:var(--text);font-family:inherit;font-size:15px;font-weight:600;' +
      'line-height:1.35;cursor:pointer;transition:background .15s ease,border-color .15s ease;' +
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
      if (statusEl) statusEl.textContent = 'No usable ' + difficulty + ' practice questions found for this event yet.';
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
    updateRaceMeta();

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
    updateRaceMeta();

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
    var mobile = isMobileRace();

    ctx.clearRect(0, 0, W, H);

    var sky = ctx.createLinearGradient(0, 0, 0, H * 0.54);
    sky.addColorStop(0, '#081221');
    sky.addColorStop(1, '#17385c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.56);

    var roadTop = H * 0.56;
    var roadBottom = H;
    var road = ctx.createLinearGradient(0, roadTop, 0, roadBottom);
    road.addColorStop(0, '#2a2a2a');
    road.addColorStop(1, '#181818');
    ctx.fillStyle = road;
    ctx.fillRect(0, roadTop, W, roadBottom - roadTop);

    var finishW = mobile ? 14 : 18;
    var finishX = W - finishW - (mobile ? 8 : 14);
    for (var fi = 0; fi < 10; fi++) {
      ctx.fillStyle = fi % 2 === 0 ? '#fff' : '#111';
      ctx.fillRect(finishX, roadTop + 4 + fi * ((roadBottom - roadTop - 8) / 10), finishW, (roadBottom - roadTop - 8) / 10);
    }

    var laneTop = roadTop + 20;
    var laneGap = mobile ? 24 : 28;
    var lanes = [laneTop, laneTop + laneGap, laneTop + laneGap * 2, laneTop + laneGap * 3];

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    lanes.forEach(function (y) {
      ctx.beginPath();
      ctx.moveTo(mobile ? 64 : 76, y + 8);
      ctx.lineTo(finishX - 8, y + 8);
      ctx.stroke();
    });

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = mobile ? 1.8 : 2;
    ctx.setLineDash(mobile ? [16, 10] : [22, 14]);
    ctx.beginPath();
    ctx.moveTo((mobile ? 86 : 98) - 8, lanes[1] + 8);
    ctx.lineTo(finishX - 10, lanes[1] + 8);
    ctx.stroke();
    ctx.setLineDash([]);

    var startX = mobile ? 86 : 98;
    var carW = mobile ? 24 : 28;
    var carH = mobile ? 10 : 12;
    var travelW = finishX - startX - carW - 12;

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
      ctx.font = (mobile ? '600 9px' : '600 11px') + ' system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(car.label, 8, y + 3);

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
      ctx.arc(x - 8, y + 5, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 8, y + 5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
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
    var mobile = isMobileRace();
    var submitClass = getButtonClass();

    var html = '';
    html += '<div style="font-family:inherit;font-size:13px;font-weight:700;line-height:1.3;margin:12px 0 6px 0;color:var(--muted, #94a3b8);letter-spacing:.03em;text-transform:uppercase;">';
    html += 'Nitro Race • ' + ((RACE.difficulty || 'medium').toUpperCase());
    html += '</div>';

    html += '<div style="font-family:inherit;font-size:16px;font-weight:700;line-height:1.45;margin:' + (mobile ? '10px 0 12px 0' : '8px 0 14px 0') + ';color:var(--text);">';
    html += (q.prompt || 'Question unavailable');
    html += '</div>';

    html += '<div>';
    opts.forEach(function (o, i) {
      html += optionButtonHtml(String.fromCharCode(65 + i), i, o);
    });
    html += '</div>';

    html += '<div id="raceFeedback" style="display:none;font-family:inherit;"></div>';
    html += '<div style="margin-top:14px;">';
    html += '<button id="raceSubmit" class="' + submitClass + '" style="display:none;min-width:220px;background:#22c55e;color:white;border:none;border-radius:14px;padding:14px 20px;font-family:inherit;font-size:16px;font-weight:700;box-shadow:none;">Submit ⚡</button>';
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
          o.style.color = 'var(--text)';
          o.style.fontWeight = '600';
        });

        el.style.borderColor = 'var(--teal)';
        el.style.background = 'rgba(20,184,166,0.10)';
        el.style.color = 'var(--text)';
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
          var boost = 4;
          RACE.playerSpeed = Math.min(11, RACE.playerSpeed + boost);
          RACE.score += 100 + (RACE.streak > 1 ? RACE.streak * 20 : 0);

          optEls[selected].style.background = 'rgba(34,197,94,0.12)';
          optEls[selected].style.borderColor = '#22c55e';
          optEls[selected].style.color = 'var(--text)';

          if (feedbackEl) {
            feedbackEl.style.cssText =
              'display:block;background:rgba(34,197,94,0.10);color:var(--text);' +
              'border:1px solid #22c55e;padding:10px 12px;border-radius:12px;margin-top:12px;' +
              'font-family:inherit;font-size:13px;';
            feedbackEl.textContent = '✅ Correct! +' + boost + ' speed' + (RACE.streak > 1 ? ' (' + RACE.streak + 'x streak!)' : '');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1000);
        } else {
          RACE.streak = 0;
          RACE.playerSpeed = Math.max(0, RACE.playerSpeed - 1);

          optEls[selected].style.background = 'rgba(239,68,68,0.10)';
          optEls[selected].style.borderColor = '#ef4444';
          optEls[selected].style.color = 'var(--text)';

          if (optEls[correct]) {
            optEls[correct].style.background = 'rgba(34,197,94,0.10)';
            optEls[correct].style.borderColor = '#22c55e';
            optEls[correct].style.color = 'var(--text)';
          }

          if (feedbackEl) {
            feedbackEl.style.cssText =
              'display:block;background:rgba(239,68,68,0.08);color:var(--text);' +
              'border:1px solid #ef4444;padding:10px 12px;border-radius:12px;margin-top:12px;' +
              'font-family:inherit;font-size:13px;';
            feedbackEl.textContent = '❌ ' + (q.explain || 'Wrong answer — no speed boost');
          }

          updateStreakBar();
          setTimeout(function () {
            nextRaceQ();
          }, 1400);
        }
      };
    }

    if (isMobileRace()) {
      setTimeout(function () {
        var qWrap = document.getElementById('raceQArea');
        if (qWrap) {
          qWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  function updateStreakBar() {
    var pct = Math.min(100, (RACE.streak / 5) * 100);
    var bar = document.getElementById('raceStreakBar');
    if (bar) bar.style.width = pct + '%';
  }

  function nextRaceQ() {
    RACE.qIdx++;
    updateRaceMeta();

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
  var evId = (typeof S !== 'undefined' && S.currentEvent) ? S.currentEvent : 'terminology';
  initRace(evId);
};

  window.renderRaceGame = function () {
  var evId = (typeof S !== 'undefined' && S.currentEvent) ? S.currentEvent : 'terminology';
  var ev = getEvent(evId);
  var evName = ev ? ev.name : 'Current Event';
    var difficulty = getCurrentDifficulty();

    fitRaceCanvas();
    ensureDifficultyControls();
    ensureRaceMetaRow();

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

    updateRaceMeta();
    drawTrack();
  };

  window.initRaceScreen = window.renderRaceGame;

  window.addEventListener('resize', function () {
    fitRaceCanvas();
    updateRaceMeta();
    drawTrack();
  });
})();