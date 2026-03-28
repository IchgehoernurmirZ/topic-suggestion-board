# PRD: Topic Suggestion Board

## Overview
A lightweight web app for a private online community (~50 members) to suggest and upvote discussion topics for recurring online sessions focused on anxiety, mental health, and self-healing.

---

## Problem
The community currently collects topic suggestions via WeChat group chat, which is messy, easy to lose, and hard to prioritize. There's no way to gauge collective interest across suggestions.

---

## Goals
- Give members a simple, low-friction way to submit topic ideas
- Surface the most popular topics via upvoting
- Allow members to volunteer as session presenters
- Give the moderator control over content without requiring a complex CMS

---

## Users

| Role | Description |
|------|-------------|
| **Member** | Any community member with the link. No account needed. Can submit and upvote topics. |
| **Moderator** | Single admin (the organizer). Logs in with email/password via Firebase Auth. Can delete, archive, and select topics. |

---

## Features

### Submission
- Any visitor can submit a topic with a nickname (optional, defaults to a random anonymous name)
- Max 1000 characters per submission
- Whitespace-only submissions are rejected
- Duplicate submissions are blocked (case-insensitive match against existing posts)
- Confirmation dialog before submitting: "确认提交这个话题吗？"
- Nickname field has validation (required if presenter option is selected)
- After a successful submission, the form collapses and a "+ 提交新话题" button appears in its place

**Presenter opt-in**
- Checkbox: "我愿意做简短分享"
- When checked: nickname becomes required (hint shown: "分享人需要留名哦"), and a duration input appears ("预计时长（分钟）", default 5, integer only, range 1–20)
- Saves `willPresent: boolean` and `presentDuration: number` to Firestore

### Display
- All active topics shown as cards in a grid layout
- Sorted by upvote count (highest first), real-time updates
- Long posts (>150 chars) are truncated with a "展开阅读" expand toggle; "收起" to collapse
- Cards with `willPresent = true` show a badge: "🙋 有人愿意分享 · 约X分钟"
- Dark/light mode toggle in the header (iOS-style pill toggle)

### Topic Sections (Home Page)
| Section | Contents |
|---------|----------|
| 🎉 本期话题 | Topics marked `selected` by moderator — shown at top |
| 当前话题 | Active topics sorted by upvotes |
| 往期话题 | Archived topics sorted by archivedAt desc |

### Upvoting
- Any visitor can upvote or un-upvote a topic (toggle behavior)
- One vote per browser session (session ID stored in localStorage)
- Upvote count updates in real-time

### Moderation
- Moderator logs in via hidden `/mod` route (no nav link)
- Firebase Auth (email/password) is the real security gate; `PrivateRoute` redirects unauthenticated users to `/mod/login`
- Firestore rules enforce moderator-only writes server-side (UID checked against `users` collection)
- Mod dashboard shows live post feed with action buttons per card

**Moderator actions**

| Action | Behavior |
|--------|----------|
| 删除 | Sets `status = "deleted"`, silently removed from all views |
| 选入本期 | Sets `status = "selected"`, card appears in 🎉 section on home page |
| 取消选中 | Reverts `status` back to `"active"` |
| 归档 | Sets `status = "archived"`, moves to 往期话题 section |

All moderator actions require a confirmation dialog before writing.

---

## Security
- Firestore rules enforce: anonymous users can create posts and update upvotes only; moderator UID (checked via `users` collection) required for status changes
- `.env` for Firebase config (never committed)
- `.gitignore` excludes `node_modules`, `dist`, `.env`

---

## Tech Stack
- **Frontend**: Vite + React
- **Database**: Firebase Firestore (real-time)
- **Auth**: Firebase Auth (email/password, moderator only)
- **Hosting**: Vercel
- **Rules**: Firestore security rules deployed via Firebase CLI

---

## Data Model

**Collection: `posts`**
```
{
  id: string,
  content: string,              // max 1000 chars
  nickname: string,             // optional, anonymous default
  createdAt: timestamp,
  upvotes: number,
  upvotedBy: string[],          // array of anonymous session IDs
  status: "active" | "selected" | "archived" | "deleted",
  willPresent: boolean,         // optional
  presentDuration: number,      // optional, 1–20 mins
  deletedAt?: timestamp,
  archivedAt?: timestamp
}
```

**Collection: `users`**
```
{
  id: string,   // must match Firebase Auth UID
  email: string
}
```

---

## Non-Goals (MVP)
- User registration or profiles
- Comment threads
- Mobile app
- Profanity filtering
- Rate limiting / spam protection (localStorage voting is accepted tradeoff)

### Post-MVP (future)
- Multiple moderator accounts
- Topic categories / tags
- Pagination for large post volumes
- Email notifications when a topic gets selected

---

## Launch Milestone
**Status**: Built and deployed
**Stack**: Vite + React + Firebase Firestore + Firebase Auth + Vercel
**Success criteria**: Members can submit and upvote topics; moderator can delete, select, and archive; link shareable via WeChat
