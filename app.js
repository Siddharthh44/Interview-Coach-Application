/* Interviewly: local-first coaching demo with rubric-based feedback. */
(() => {
  'use strict';

  const STORAGE_KEY = 'interviewly.v1';
  const sampleData = {
    profile: { name: 'Samira Shah', branch: 'Computer Science', company: 'Google', role: 'Software Engineer' },
    sessions: [
      { title: 'Arrays & problem solving', category: 'Data structures', score: 8.4, date: 'Today', tint: 'purple' },
      { title: 'SQL joins & aggregation', category: 'Database systems', score: 7.6, date: 'Yesterday', tint: 'orange' },
      { title: 'Tell me about yourself', category: 'Behavioral', score: 8.1, date: 'Sep 27', tint: 'green' }
    ],
    totals: { completed: 12, streak: 5, goal: 3, scores: [7.1, 7.5, 7.2, 7.8, 7.6, 8.1, 7.8] }
  };

  const questionBank = {
    software: [
      { category: 'DATA STRUCTURES', difficulty: 'MEDIUM', title: 'Find a pair that adds up', prompt: 'Talk through your approach, then give the time and space complexity.', question: 'Given an array of integers and a target value, how would you find two numbers that add up to the target?', keywords: ['hash', 'map', 'dictionary', 'complement', 'complexity', 'o(n)', 'time', 'space'], concept: 'A hash map can store each number as you scan. For each value, check whether target minus that value is already in the map; this gives O(n) time and O(n) extra space.', focus: ['Hash map lookup', 'Complement calculation', 'Time and space complexity'], tip: 'State the brute-force option first, then explain why a hash map reduces the lookup time.' },
      { category: 'ALGORITHMS', difficulty: 'MEDIUM', title: 'Merge overlapping intervals', prompt: 'Describe how you would handle edge cases and the running time.', question: 'You are given a list of time intervals. How would you merge all intervals that overlap?', keywords: ['sort', 'start', 'end', 'overlap', 'compare', 'complexity', 'o(n log n)'], concept: 'Sort the intervals by start time. Keep a current interval and merge the next one if its start is no later than the current end; otherwise, add the current interval to the result. Sorting makes the total time O(n log n).', focus: ['Sort by start time', 'Compare boundaries', 'Explain complexity'], tip: 'Mention what happens when intervals touch at a boundary, and clarify whether that counts as overlap.' },
      { category: 'SYSTEM DESIGN', difficulty: 'MEDIUM', title: 'Design a URL shortener', prompt: 'Start with the core flow, then cover storage and scale.', question: 'How would you design a URL-shortening service that handles millions of links?', keywords: ['id', 'database', 'redirect', 'cache', 'hash', 'scale', 'key', 'collision'], concept: 'Generate a unique short key, store the key-to-URL mapping, and redirect on lookup. Discuss a durable store, a cache for popular links, collision handling, and how reads and writes scale.', focus: ['Key generation and collisions', 'Persistent mapping', 'Redirect and caching'], tip: 'Clarify scale and reliability requirements before choosing storage or key-generation details.' }
    ],
    frontend: [
      { category: 'JAVASCRIPT', difficulty: 'MEDIUM', title: 'Explain event delegation', prompt: 'Use a concrete example and discuss when this pattern helps.', question: 'What is event delegation, and how can it make a page with many interactive list items more efficient?', keywords: ['bubble', 'bubbling', 'parent', 'event', 'target', 'listener', 'dynamic'], concept: 'Attach one listener to a shared parent and use the bubbling event’s target to identify the clicked child. This reduces per-item listeners and handles children added later.', focus: ['Event bubbling', 'Parent listener', 'Target filtering'], tip: 'Show how you would ensure the event target is actually one of the intended child elements.' },
      { category: 'WEB FUNDAMENTALS', difficulty: 'MEDIUM', title: 'Make a page accessible', prompt: 'Explain how semantics, keyboard use, and assistive technology fit together.', question: 'How would you make a custom dialog usable for keyboard and screen-reader users?', keywords: ['focus', 'keyboard', 'aria', 'escape', 'label', 'semantic', 'trap'], concept: 'Give the dialog an accessible name, move focus into it when opened, keep keyboard focus inside while modal, support Escape, and return focus to the opener when it closes.', focus: ['Accessible name and semantics', 'Focus management', 'Keyboard close and return'], tip: 'Describe the complete focus lifecycle, including where focus goes after the dialog closes.' }
    ],
    backend: [
      { category: 'API DESIGN', difficulty: 'MEDIUM', title: 'Design a rate limiter', prompt: 'Compare a couple of strategies and explain their trade-offs.', question: 'How would you protect a public API from one client sending too many requests?', keywords: ['token', 'bucket', 'window', 'redis', 'limit', 'distributed', '429'], concept: 'Choose a policy such as token bucket or sliding window, key counters by client, store shared state when running multiple servers, and return HTTP 429 with retry guidance when a client exceeds the limit.', focus: ['Rate-limit policy', 'Shared counter storage', 'Clear rejection response'], tip: 'Explain how the design remains consistent when requests reach different application servers.' }
    ],
    data: [
      { category: 'SQL', difficulty: 'MEDIUM', title: 'Find the second-highest salary', prompt: 'Explain how your query handles duplicate salary values.', question: 'How would you write a SQL query to find the second-highest distinct salary in an employee table?', keywords: ['distinct', 'order by', 'limit', 'dense_rank', 'rank', 'salary', 'null'], concept: 'One option is to select distinct salaries in descending order and take the second row; a window function such as DENSE_RANK is useful when returning more context. Mention what to do if no second salary exists.', focus: ['Distinct values', 'Ordering or ranking', 'No-result edge case'], tip: 'Call out how duplicates affect the result and what the query returns when there is only one distinct salary.' },
      { category: 'ANALYTICS', difficulty: 'MEDIUM', title: 'Investigate a conversion drop', prompt: 'Structure your investigation before proposing a fix.', question: 'A product’s signup conversion rate fell 15% this week. How would you investigate the cause?', keywords: ['segment', 'funnel', 'tracking', 'experiment', 'baseline', 'source', 'device'], concept: 'First validate the metric and instrumentation, then segment the funnel by source, device, geography, or cohort. Compare with the baseline, identify where the drop begins, and use qualitative evidence or an experiment to test causes.', focus: ['Validate data quality', 'Break down segments and funnel', 'Test likely causes'], tip: 'Separate a real user behavior change from a tracking or data-pipeline issue before interpreting the numbers.' }
    ],
    behavioral: [
      { category: 'BEHAVIORAL', difficulty: 'MEDIUM', title: 'Tell me about a challenge', prompt: 'Use Situation, Task, Action, Result (STAR) to keep the story clear.', question: 'Tell me about a challenging project or problem you worked through. What did you do, and what happened?', keywords: ['situation', 'task', 'action', 'result', 'I', 'learned', 'impact', 'measured'], concept: 'A strong answer briefly sets the situation and responsibility, gives specific actions you personally took, and finishes with an outcome or lesson. Keep the story focused and concrete.', focus: ['Clear context and responsibility', 'Specific personal actions', 'Outcome or learning'], tip: 'Spend most of your answer on your actions and results. Add a concrete outcome or what you learned.' }
    ],
    mechanical: [
      { category: 'ENGINEERING FUNDAMENTALS', difficulty: 'MEDIUM', title: 'Choose a beam section', prompt: 'Explain the loading assumptions and how you would validate the design.', question: 'How would you choose an appropriate cross-section for a beam supporting a known load?', keywords: ['load', 'stress', 'bending', 'deflection', 'material', 'safety', 'boundary'], concept: 'Define support and loading conditions, calculate bending stresses and deflection, compare against material allowables and a safety factor, then validate the design against manufacturing and service constraints.', focus: ['Loading and boundary conditions', 'Strength and deflection checks', 'Material and safety factor'], tip: 'State assumptions and check both strength and stiffness; a beam can be safe from failure yet deflect too much.' }
    ],
    product: [
      { category: 'PRODUCT SENSE', difficulty: 'MEDIUM', title: 'Improve a core experience', prompt: 'Clarify the audience and goal before proposing solutions.', question: 'How would you improve the onboarding experience for a new user of a productivity app?', keywords: ['user', 'goal', 'metric', 'segment', 'friction', 'experiment', 'measure'], concept: 'Identify the target user and their first success moment, map onboarding friction, choose a measurable activation metric, prioritize a small intervention, and test its effect while monitoring guardrail metrics.', focus: ['User and first-value moment', 'Funnel friction and metric', 'Prioritized experiment'], tip: 'Anchor your idea in one user segment and define how you would know the change helped.' }
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const state = loadState();
  let questions = [];
  let questionIndex = 0;
  let answers = [];
  let recognition = null;
  let activeSession = false;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.profile && saved.sessions && saved.totals) return saved;
    } catch (error) { console.info('Using sample practice data.', error); }
    return structuredClone(sampleData);
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('Could not save this session in this browser.', error); }
  }

  function initials(name) { return (name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('') || 'S').toUpperCase(); }
  function friendlyName(name) { return name.trim().split(/\s+/)[0] || 'there'; }
  function average() { return state.totals.scores.length ? state.totals.scores.reduce((sum, score) => sum + score, 0) / state.totals.scores.length : 0; }
  function safeText(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

  function renderProfile() {
    const profile = state.profile;
    $('#welcome-name').textContent = friendlyName(profile.name);
    $('#sidebar-name').textContent = profile.name;
    $('#sidebar-avatar').textContent = initials(profile.name);
    $('#top-avatar').textContent = initials(profile.name);
    $('#company-target').textContent = profile.company || 'your target company';
    $('#stat-sessions').textContent = state.totals.completed;
    $('#stat-score').textContent = average().toFixed(1);
    $('#stat-streak').textContent = state.totals.streak;
    $('#goal-complete').textContent = state.totals.goal;
    $('#goal-progress-fill').style.width = `${Math.min(100, state.totals.goal / 5 * 100)}%`;
    const date = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
    $('#today-label').textContent = date;
    renderSessions();
  }

  function renderSessions() {
    $('#session-list').innerHTML = state.sessions.slice(0, 4).map((session) => `<div class="session-row"><span class="session-icon ${safeText(session.tint || 'purple')}">${session.tint === 'orange' ? '⌘' : session.tint === 'green' ? '✳' : '⌘'}</span><div><div class="session-title">${safeText(session.title)}</div><div class="session-meta">${safeText(session.category)} · ${safeText(session.date)}</div></div><span class="session-score">${Number(session.score).toFixed(1)}<small> / 10</small></span><span class="session-status">Completed</span></div>`).join('');
  }

  function chooseQuestionSet(role) {
    const normalized = role.toLowerCase();
    let key = 'software';
    if (normalized.includes('frontend')) key = 'frontend';
    else if (normalized.includes('backend')) key = 'backend';
    else if (normalized.includes('data')) key = 'data';
    else if (normalized.includes('mechanical')) key = 'mechanical';
    else if (normalized.includes('product')) key = 'product';
    else if (normalized.includes('business')) key = 'behavioral';
    const selected = [...questionBank[key], ...questionBank.behavioral];
    const unique = [...new Map(selected.map((question) => [question.title, question])).values()];
    return unique.slice(0, 3);
  }

  function showView(view) {
    ['#session-setup', '#question-view', '#feedback-view', '#session-complete'].forEach((selector) => { $(selector).hidden = selector !== view; });
  }

  function openSession() {
    stopRecognition();
    activeSession = false;
    $('#student-name').value = state.profile.name;
    $('#student-branch').value = state.profile.branch;
    $('#student-company').value = state.profile.company;
    $('#student-role').value = state.profile.role;
    showView('#session-setup');
    $('#session-progress-label').textContent = 'YOUR MOCK INTERVIEW';
    $('#question-progress').style.width = '0%';
    if (!$('#session-dialog').open) $('#session-dialog').showModal();
    $('#student-name').focus();
  }

  function startInterview(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.profile = { name: form.get('name').trim(), branch: form.get('branch'), company: form.get('company').trim(), role: form.get('role') };
    saveState();
    renderProfile();
    questions = chooseQuestionSet(state.profile.role);
    questionIndex = 0;
    answers = [];
    activeSession = true;
    renderQuestion();
  }

  function renderQuestion() {
    stopRecognition();
    const question = questions[questionIndex];
    $('#session-progress-label').textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
    $('#question-progress').style.width = `${questionIndex / questions.length * 100}%`;
    $('#question-category').textContent = question.category;
    $('#question-difficulty').textContent = question.difficulty;
    $('#question-text').textContent = question.question;
    $('#question-prompt').textContent = question.prompt;
    $('#answer-input').value = '';
    $('#word-count').textContent = '0 / 2500';
    $('#voice-status').textContent = '';
    $('#voice-button').disabled = !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    $('#voice-button').title = $('#voice-button').disabled ? 'Speech recognition is not supported in this browser.' : 'Dictate your answer';
    showView('#question-view');
    $('#answer-input').focus();
  }

  // Scores are a lightweight coaching heuristic, not an AI judgment. The criteria are visible to students.
  function evaluate(answer, question) {
    const normalized = answer.toLowerCase();
    const words = answer.trim().split(/\s+/).filter(Boolean);
    const hits = question.keywords.filter((word) => normalized.includes(word.toLowerCase()));
    const coverage = hits.length / question.keywords.length;
    let score = 2.4 + Math.min(2.3, words.length / 35) + coverage * 4.2;
    if (words.length < 12) score = Math.min(score, 4.2);
    if (words.length > 45) score += .4;
    score = Math.max(1, Math.min(9.8, Math.round(score * 10) / 10));
    const strengths = [];
    if (words.length >= 30) strengths.push('You gave enough detail to follow your thinking.');
    if (hits.length >= 2) strengths.push(`You touched on ${hits.slice(0, 3).join(', ')}.`);
    if (/because|therefore|so that|which means/i.test(answer)) strengths.push('You connected your choices to a reason or outcome.');
    if (!strengths.length) strengths.push('You took a first pass at the problem—keep building on it.');
    const improvements = [];
    if (words.length < 30) improvements.push('Add more detail: explain your approach step by step.');
    const missing = question.focus.filter((concept) => !normalized.includes(concept.toLowerCase().split(' ')[0]) && !question.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
    if (coverage < .25) improvements.push(`Make the key ideas explicit: ${question.focus.slice(0, 2).join(' and ')}.`);
    else if (coverage < .55) improvements.push(`Also cover ${question.focus.find((concept) => !normalized.includes(concept.toLowerCase().split(' ')[0])) || 'edge cases and trade-offs'}.`);
    if (!/complexity|big.?o|time|space|trade.?off|edge case|validate|measure/i.test(answer) && /DATA STRUCTURES|ALGORITHMS/.test(question.category)) improvements.push('Call out the time complexity and one edge case.');
    if (!improvements.length) improvements.push('Try naming an edge case or trade-off to make your answer even sharper.');
    return { score, strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3), hits };
  }

  function submitAnswer() {
    const answer = $('#answer-input').value.trim();
    if (answer.split(/\s+/).filter(Boolean).length < 5) {
      $('#answer-input').focus();
      $('#voice-status').textContent = 'Add a few more words so you can get useful feedback.';
      return;
    }
    stopRecognition();
    const question = questions[questionIndex];
    const result = evaluate(answer, question);
    answers[questionIndex] = { answer, result };
    $('#feedback-score').textContent = result.score.toFixed(1);
    $('#feedback-title').textContent = result.score >= 8 ? 'Really thoughtful answer.' : result.score >= 6 ? 'A solid start.' : 'Good first rep.';
    $('#feedback-summary').textContent = `You covered ${result.hits.length} of ${question.keywords.length} coaching cues. Here are a couple of ideas for your next pass.`;
    $('#strength-list').innerHTML = result.strengths.map((item) => `<li>${safeText(item)}</li>`).join('');
    $('#improvement-list').innerHTML = result.improvements.map((item) => `<li>${safeText(item)}</li>`).join('');
    $('#model-answer-text').textContent = question.concept;
    $('#model-answer-text').hidden = true;
    $('#toggle-model-answer').textContent = 'Show example ↓';
    $('#next-question').innerHTML = questionIndex === questions.length - 1 ? 'See my summary <span>→</span>' : 'Next question <span>→</span>';
    showView('#feedback-view');
  }

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
      return;
    }
    finishInterview();
  }

  function finishInterview() {
    const completedCount = answers.filter(Boolean).length;
    const mean = answers.filter(Boolean).reduce((sum, item) => sum + item.result.score, 0) / completedCount;
    const lastQuestion = questions[questionIndex];
    state.totals.completed += 1;
    state.totals.goal = Math.min(5, state.totals.goal + 1);
    state.totals.streak += 1;
    state.totals.scores.push(Number(mean.toFixed(1)));
    if (state.totals.scores.length > 30) state.totals.scores.shift();
    state.sessions.unshift({ title: `${state.profile.role} practice`, category: state.profile.company, score: Number(mean.toFixed(1)), date: 'Today', tint: 'purple' });
    state.sessions = state.sessions.slice(0, 8);
    saveState();
    renderProfile();
    $('#session-progress-label').textContent = 'NICE WORK SHOWING UP';
    $('#question-progress').style.width = '100%';
    $('#complete-summary').textContent = `You practiced ${completedCount} question${completedCount === 1 ? '' : 's'} for ${state.profile.role} at ${state.profile.company}. Your practice is saved in this browser.`;
    $('#complete-score-value').innerHTML = `${mean.toFixed(1)}<small> / 10</small>`;
    $('#complete-tip').textContent = lastQuestion.tip;
    showView('#session-complete');
  }

  function stopRecognition() {
    if (recognition) { recognition.onresult = null; recognition.onerror = null; try { recognition.stop(); } catch (_) { /* Already stopped. */ } recognition = null; }
    $('#voice-button').classList.remove('recording');
  }

  function toggleVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { $('#voice-status').textContent = 'Voice input is not available in this browser.'; return; }
    if (recognition) { stopRecognition(); $('#voice-status').textContent = 'Voice input paused.'; return; }
    recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    const startingText = $('#answer-input').value.trim();
    $('#voice-button').classList.add('recording');
    $('#voice-status').textContent = 'Listening… speak your answer. Press the button again to stop.';
    recognition.onresult = (event) => {
      const spoken = Array.from(event.results).map((result) => result[0].transcript).join(' ');
      $('#answer-input').value = `${startingText}${startingText ? ' ' : ''}${spoken}`.slice(0, 2500);
      $('#word-count').textContent = `${$('#answer-input').value.length} / 2500`;
    };
    recognition.onerror = (event) => { $('#voice-status').textContent = event.error === 'not-allowed' ? 'Microphone access was blocked. You can type your answer instead.' : 'Voice input stopped. Your answer so far is saved above.'; stopRecognition(); };
    recognition.onend = () => { if (recognition) { recognition = null; $('#voice-button').classList.remove('recording'); $('#voice-status').textContent = 'Voice input stopped.'; } };
    try { recognition.start(); } catch (_) { stopRecognition(); $('#voice-status').textContent = 'Could not start voice input. You can type your answer instead.'; }
  }

  $('#start-session').addEventListener('click', openSession);
  $('#continue-session').addEventListener('click', openSession);
  $('#profile-switch').addEventListener('click', openSession);
  $('#student-form').addEventListener('submit', startInterview);
  $('#close-dialog').addEventListener('click', () => { stopRecognition(); $('#session-dialog').close(); });
  $('#session-dialog').addEventListener('click', (event) => { if (event.target === $('#session-dialog')) { stopRecognition(); $('#session-dialog').close(); } });
  $('#submit-answer').addEventListener('click', submitAnswer);
  $('#next-question').addEventListener('click', nextQuestion);
  $('#retry-answer').addEventListener('click', () => { showView('#question-view'); $('#answer-input').focus(); });
  $('#toggle-model-answer').addEventListener('click', () => {
    const answer = $('#model-answer-text');
    answer.hidden = !answer.hidden;
    $('#toggle-model-answer').textContent = answer.hidden ? 'Show example ↓' : 'Hide example ↑';
  });
  $('#voice-button').addEventListener('click', toggleVoice);
  $('#answer-input').addEventListener('input', () => { $('#word-count').textContent = `${$('#answer-input').value.length} / 2500`; });
  $('#finish-session').addEventListener('click', () => { activeSession = false; $('#session-dialog').close(); document.querySelector('#home').scrollIntoView({ behavior: 'smooth' }); });
  $('#session-dialog').addEventListener('cancel', stopRecognition);
  window.addEventListener('beforeunload', () => { if (activeSession) stopRecognition(); });
  document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((link) => link.classList.remove('active'));
    item.classList.add('active');
  }));

  renderProfile();
})();
