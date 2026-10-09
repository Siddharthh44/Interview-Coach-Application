# Interviewly — AI Interview Coach

A responsive, local-first interview practice app built with **HTML, CSS and vanilla JavaScript**. It includes a student dashboard, role-specific question sets, typed and browser speech-recognition answers, rubric-based feedback, and progress saved in local storage.

## Run it

Open `index.html` in a current browser, or serve this folder from a static web server (for example, `python -m http.server 8000`). No build step, dependencies, account, or API key is needed.

## Project structure

```text
.
├── index.html   # Accessible dashboard, setup form, and interview dialog
├── styles.css   # Responsive dashboard and interview-session styling
├── app.js       # Question bank, browser persistence, speech input, and scoring
└── README.md    # Project overview and operating notes
```

## What’s included

- Student name, branch, target company, and role profile with pre-filled sample student data.
- Technical interview questions tailored to software, frontend, backend, data, product, and mechanical roles, plus a behavioral question.
- Typed answers and optional speech recognition in browsers that support the Web Speech API.
- A transparent, client-side coaching rubric with a 1–10 score, strengths, improvements, and a sample answer approach.
- A dashboard with practice sessions, average score, streak, weekly goal, and a sample progress chart.
- Responsive layouts, keyboard-friendly controls, reduced-motion support, and semantic form labels.

## Feedback and privacy

The current version is an **interactive demo**, not a connected generative-AI service. Feedback is computed locally from answer length and question-specific coaching cues, so it is immediate and works without an account. Session/profile data is stored only in the browser’s `localStorage` under `interviewly.v1`. It does not leave the device. Clear the site’s local storage to restore the sample data.

For an AI-backed production service, add an authenticated server endpoint that calls the chosen model provider using server-side credentials. Keep secrets off the client; validate and limit input, obtain consent before sending interview answers, and return structured feedback that the UI can render. Connect the endpoint in `app.js` where `evaluate()` is called. The current speech input likewise depends on the browser’s Web Speech API and microphone permission; typed answers are always available.
