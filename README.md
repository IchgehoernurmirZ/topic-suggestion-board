# Topic Suggestion Board · 话题征集板

A lightweight, real-time web app for small communities to submit and upvote discussion topics anonymously. Built for a private online group focused on mental health and self-healing — replacing scattered WeChat group chat with a structured, low-friction suggestion flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication (email/password) |
| Hosting | Vercel |
| Styling | Plain CSS with CSS custom properties (light/dark mode) |

---

## Features

- **Anonymous posting** — submit a topic with an optional nickname; defaults to a randomly generated friendly name
- **Real-time feed** — posts update live, sorted by upvote count (highest first)
- **Upvoting** — one vote per browser session via `localStorage` session ID; toggle to un-upvote
- **Long post truncation** — posts over 150 characters collapse with an expand toggle (展开阅读 / 收起)
- **Willing to present** — submitters can flag they're willing to do a short presentation, with an estimated duration (1–20 min)
- **Moderator auth** — hidden `/mod` route, email/password login via Firebase Auth; access gated by `PrivateRoute` and Firestore rules
- **Delete** — moderator silently sets `status: deleted`; post disappears from all feeds immediately
- **Archive** — moderator marks a topic as 已选入本期; it moves to a "Past Topics" section at the bottom
- **Dark / light mode** — iOS-style pill toggle, preference persisted to `localStorage`
- **Duplicate detection** — case-insensitive check against existing posts before submission
- **Input validation** — nickname character rules, 1000-char content limit, duration integer validation

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd topic-suggestion-board
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

Open `.env` and populate each value — find them in the Firebase console under **Project Settings → General → Your apps → SDK setup and configuration**:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Deploy Firestore security rules

Install the Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project; keep existing rules file
```

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

> **Note:** The rules require moderator documents to be stored in a `users` Firestore collection with the **Auth UID as the document ID** (not an auto-generated ID). Add moderators manually in the Firebase console: Firestore → `users` → Add document → set Document ID to the user's Auth UID.

### 4. Create Firestore indexes

The app requires two composite indexes. Firebase will log a direct creation link in the browser console on first load — click it, or create them manually:

| Collection | Field 1 | Field 2 | Order |
|---|---|---|---|
| `posts` | `status` Asc | `upvotes` Desc | Collection |
| `posts` | `status` Asc | `archivedAt` Desc | Collection |

### 5. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The moderator login is at `/mod/login` (no nav link — access it directly).

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com) — it auto-detects Vite.
3. Add all `VITE_FIREBASE_*` environment variables in **Vercel → Project → Settings → Environment Variables**.
4. Deploy. The `vercel.json` rewrite rule ensures React Router handles all paths correctly.

### Firebase authorized domains

After deploying, add your Vercel domain to Firebase's allowed list so Auth works in production:

**Firebase console → Authentication → Settings → Authorized domains → Add domain**

Add both:
- `your-project.vercel.app`
- Any custom domain you've configured

---

## Project Structure

```
src/
├── components/
│   ├── PostCard.jsx       # Individual post with upvote, archive, delete, presenter badge
│   ├── PostForm.jsx       # Submission form with validation
│   └── ThemeToggle.jsx    # Dark/light mode pill toggle
├── hooks/
│   ├── useAuth.js         # Firebase auth state subscriber
│   └── usePosts.js        # Real-time Firestore listener by status
├── lib/
│   ├── firebase.js        # Firebase app initialization
│   ├── nicknames.js       # Random nickname generator
│   └── session.js         # localStorage session ID for upvote dedup
└── pages/
    ├── Home.jsx            # Public feed
    ├── ModDashboard.jsx    # Moderator view
    └── ModLogin.jsx        # Login page
firestore.rules             # Server-side security rules
vercel.json                 # SPA rewrite rule
```
