// ── HOSA Academy Content QA Script ────────────────────────────────────────
// Run with: node static/qa_check.js
// Checks every event for: counts, duplicates, missing fields, broken structure

const fs = require('fs');
const window = global;

// ── Load all question bank files ──────────────────────────────────────────
const BASE = require('path').join(__dirname);
const FILES = [
  'questions_terminology.js',
  'questions_nutrition.js',
  'questions_math.js',
  'questions_careers.js',
  'questions_emergency_healthy.js',
  'questions_hosa_bowl.js',
  'questions_new_events.js',
  'questions_medical_reading.js',
  'words_terminology.js',
  'content_expansion.js',
];

let loadErrors = [];
FILES.forEach(f => {
  const path = require('path').join(BASE, f);
  if (!fs.existsSync(path)) {
    loadErrors.push(`❌ FILE NOT FOUND: ${path}`);
    return;
  }
  try {
    eval(fs.readFileSync(path, 'utf8'));
  } catch(e) {
    loadErrors.push(`❌ SYNTAX ERROR in ${f}: ${e.message.slice(0,80)}`);
  }
});

// ── Event registry ────────────────────────────────────────────────────────
const EVENTS = {
  terminology:    { name:'Medical Terminology',       getFlash:(d)=>(window.QUESTION_BANK?.flashcards||{})[d]||[],     getQuiz:(d)=>(window.QUESTION_BANK?.diagnosisDetective||{})[d]||[] },
  nutrition:      { name:'Nutrition',                  getFlash:(d)=>(window.QB_NUTRITION?.flashcards||{})[d]||[],      getQuiz:(d)=>(window.QB_NUTRITION?.quiz||{})[d]||[] },
  math:           { name:'Math for Health Careers',   getFlash:(d)=>(window.QB_MATH?.flashcards||{})[d]||[],           getQuiz:(d)=>(window.QB_MATH?.quiz||{})[d]||[] },
  careers:        { name:'Health Careers',             getFlash:(d)=>(window.QB_CAREERS?.flashcards||{})[d]||[],        getQuiz:(d)=>(window.QB_CAREERS?.quiz||{})[d]||[] },
  emergency:      { name:'Life Threatening',           getFlash:(d)=>(window.QB_EMERGENCY?.flashcards||{})[d]||[],      getQuiz:(d)=>(window.QB_EMERGENCY?.quiz||{})[d]||[] },
  healthy_living: { name:'Healthy Living',             getFlash:(d)=>(window.QB_HEALTHY_LIVING?.flashcards||{})[d]||[], getQuiz:(d)=>(window.QB_HEALTHY_LIVING?.quiz||{})[d]||[] },
  hosa_bowl:      { name:'HOSA Bowl',                  getFlash:(d)=>(window.QB_HOSA_BOWL?.flashcards||{})[d]||[],      getQuiz:(d)=>(window.QB_HOSA_BOWL?.quiz||{})[d]||[] },
  veterinary:     { name:'Veterinary Science',         getFlash:(d)=>(window.QB_VETERINARY?.flashcards||{})[d]||[],     getQuiz:(d)=>(window.QB_VETERINARY?.quiz||{})[d]||[] },
  public_health:  { name:'Public Health',              getFlash:(d)=>(window.QB_PUBLIC_HEALTH?.flashcards||{})[d]||[],  getQuiz:(d)=>(window.QB_PUBLIC_HEALTH?.quiz||{})[d]||[] },
  stop_bleed:     { name:'Stop the Bleed',             getFlash:(d)=>(window.QB_STOP_BLEED?.flashcards||{})[d]||[],     getQuiz:(d)=>(window.QB_STOP_BLEED?.quiz||{})[d]||[] },
  medical_reading:{ name:'Medical Reading',            getFlash:(d)=>(window.QB_MEDICAL_READING?.flashcards||{})[d]||[],getQuiz:(d)=>(window.QB_MEDICAL_READING?.quiz||{})[d]||[] },
  hosa_history:   { name:'HOSA History',               getFlash:(d)=>(window.QB_HOSA_HISTORY?.flashcards||{})[d]||[],   getQuiz:(d)=>(window.QB_HOSA_HISTORY?.quiz||{})[d]||[] },
};

const FLASH_TARGET = 350;
const QUIZ_TARGET  = 150;
const DIFFICULTIES = ['easy','medium','hard'];

// ── Validators ────────────────────────────────────────────────────────────
function checkFlashcard(card, idx, difficulty, eventId) {
  const issues = [];
  if (!card || typeof card !== 'object') { issues.push(`[${difficulty}][${idx}] Not an object`); return issues; }
  if (!card.term || typeof card.term !== 'string' || card.term.trim() === '')
    issues.push(`[${difficulty}][${idx}] Missing or empty 'term'`);
  if (!card.def  || typeof card.def  !== 'string' || card.def.trim()  === '')
    issues.push(`[${difficulty}][${idx}] Missing or empty 'def' for term: "${card.term}"`);
  return issues;
}

function checkQuizItem(item, idx, difficulty, eventId) {
  const issues = [];
  if (!item || typeof item !== 'object') { issues.push(`[${difficulty}][${idx}] Not an object`); return issues; }
  // Normalize: terminology uses 'scenario', others use 'q'
  const qtext = item.q || item.scenario || item.question || '';
  if (!qtext || typeof qtext !== 'string' || qtext.trim() === '')
    issues.push(`[${difficulty}][${idx}] Missing or empty question text`);
  const opts = item.opts || item.options;
  if (!opts || !Array.isArray(opts))
    issues.push(`[${difficulty}][${idx}] Missing 'opts' array: "${(item.q||'').slice(0,40)}"`);
  else {
    if (opts.length !== 4)
      issues.push(`[${difficulty}][${idx}] Has ${opts.length} options (need 4): "${(item.q||'').slice(0,40)}"`);
    opts.forEach((o,oi) => {
      if (!o || typeof o !== 'string' || o.trim() === '')
        issues.push(`[${difficulty}][${idx}] Option ${oi} is blank: "${(item.q||'').slice(0,40)}"`);
    });
  }
  if (item.correct === undefined || item.correct === null)
    issues.push(`[${difficulty}][${idx}] Missing 'correct' field: "${(item.q||'').slice(0,40)}"`);
  else if (opts && (item.correct < 0 || item.correct >= opts.length))
    issues.push(`[${difficulty}][${idx}] 'correct' index ${item.correct} out of range: "${(item.q||'').slice(0,40)}"`);
  return issues;
}

function findDuplicates(items, keyFn, label) {
  const seen = {};
  const dupes = [];
  items.forEach((item, idx) => {
    if (!item) return;
    const key = keyFn(item).toLowerCase().trim().slice(0, 80);
    if (!key) return;
    if (seen[key] !== undefined) {
      dupes.push(`Duplicate ${label} at index ${idx} (matches index ${seen[key]}): "${key.slice(0,60)}"`);
    } else {
      seen[key] = idx;
    }
  });
  return dupes;
}

// ── Run QA ────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log('  HOSA Academy Content QA Report');
console.log('═'.repeat(60));

if (loadErrors.length) {
  console.log('\n⚠️  FILE LOAD ISSUES:');
  loadErrors.forEach(e => console.log(' ', e));
}

let totalIssues = 0;
const summary = [];

Object.entries(EVENTS).forEach(([eventId, ev]) => {
  const issues = [];
  const counts = { flash:{easy:0,medium:0,hard:0,total:0}, quiz:{easy:0,medium:0,hard:0,total:0} };
  const allFlash = [], allQuiz = [];

  // Collect all items
  DIFFICULTIES.forEach(d => {
    const fc = ev.getFlash(d);
    const qz = ev.getQuiz(d);
    counts.flash[d] = fc.length;
    counts.flash.total += fc.length;
    counts.quiz[d]  = qz.length;
    counts.quiz.total  += qz.length;
    allFlash.push(...fc);
    allQuiz.push(...qz);

    // Validate each flashcard
    fc.forEach((card, idx) => {
      checkFlashcard(card, idx, d, eventId).forEach(i => issues.push('FLASH ' + i));
    });

    // Validate each quiz item
    qz.forEach((item, idx) => {
      checkQuizItem(item, idx, d, eventId).forEach(i => issues.push('QUIZ  ' + i));
    });
  });

  // Duplicate detection
  const flashDupes = findDuplicates(allFlash, c => (c.term||''), 'flashcard term');
  const quizDupes  = findDuplicates(allQuiz,  q => (q&&(q.q||q.scenario||q.question)||''),    'quiz question');
  flashDupes.forEach(d => issues.push('DUPE  ' + d));
  quizDupes.forEach(d  => issues.push('DUPE  ' + d));

  // Threshold checks
  const flashOk = counts.flash.total >= FLASH_TARGET;
  const quizOk  = counts.quiz.total  >= QUIZ_TARGET;
  const flashGap = Math.max(0, FLASH_TARGET - counts.flash.total);
  const quizGap  = Math.max(0, QUIZ_TARGET  - counts.quiz.total);

  totalIssues += issues.length;

  const statusF = flashOk ? '✅' : '❌';
  const statusQ = quizOk  ? '✅' : '❌';

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📚 ${ev.name.toUpperCase()}`);
  console.log(`   Flashcards: ${statusF} ${counts.flash.total}/${FLASH_TARGET}  (E:${counts.flash.easy} M:${counts.flash.medium} H:${counts.flash.hard})${flashGap>0?' → need +'+flashGap:''}`);
  console.log(`   Quiz Qs:    ${statusQ} ${counts.quiz.total}/${QUIZ_TARGET}  (E:${counts.quiz.easy} M:${counts.quiz.medium} H:${counts.quiz.hard})${quizGap>0?' → need +'+quizGap:''}`);

  if (issues.length === 0) {
    console.log(`   Validation: ✅ No issues found`);
  } else {
    console.log(`   Validation: ❌ ${issues.length} issue(s):`);
    issues.slice(0, 5).forEach(i => console.log(`     → ${i}`));
    if (issues.length > 5) console.log(`     ... and ${issues.length-5} more`);
  }

  summary.push({
    name: ev.name, flashOk, quizOk,
    flashTotal: counts.flash.total, quizTotal: counts.quiz.total,
    flashGap, quizGap, issues: issues.length
  });
});

// ── Summary ───────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log('  SUMMARY');
console.log('═'.repeat(60));
const readyCount   = summary.filter(e => e.flashOk && e.quizOk && e.issues===0).length;
const flashReady   = summary.filter(e => e.flashOk).length;
const quizReady    = summary.filter(e => e.quizOk).length;
const totalFlashGap= summary.reduce((s,e)=>s+e.flashGap,0);
const totalQuizGap = summary.reduce((s,e)=>s+e.quizGap,0);

console.log(`\n  Events fully ready (350+ flash, 150+ quiz, 0 issues): ${readyCount}/${summary.length}`);
console.log(`  Events with 350+ flashcards: ${flashReady}/${summary.length}`);
console.log(`  Events with 150+ quiz Qs:    ${quizReady}/${summary.length}`);
console.log(`  Total flashcards still needed: ${totalFlashGap}`);
console.log(`  Total quiz questions still needed: ${totalQuizGap}`);
console.log(`  Total validation issues found: ${totalIssues}`);

console.log('\n  Events needing work:');
summary.filter(e => !e.flashOk || !e.quizOk || e.issues>0).forEach(e => {
  const parts = [];
  if (!e.flashOk) parts.push(`flash +${e.flashGap}`);
  if (!e.quizOk)  parts.push(`quiz +${e.quizGap}`);
  if (e.issues>0) parts.push(`${e.issues} validation issues`);
  console.log(`    ❌ ${e.name}: ${parts.join(', ')}`);
});

if (readyCount === summary.length) {
  console.log('\n  🎉 ALL EVENTS FULLY READY!');
}
console.log('\n' + '═'.repeat(60) + '\n');
