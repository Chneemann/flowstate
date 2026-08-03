# Flowstate

A modern, high-performance Kanban & Workflow web application designed to help you lock in and enter the productivity flow.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Route Groups)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Auth.js v5 (NextAuth)](https://authjs.dev/) with Credentials Provider
- **Database & State:** PostgreSQL / Prisma (in progress)

## 📂 Architecture & Structure

The project uses Next.js Route Groups to separate public and protected application areas cleanly:

- `app/(auth)/` — Public authentication routes (Login, Register)
- `app/(app)/` — Protected workspace & dashboard routes (Sidebar, Header, Kanban Board)
- `app/api/` — Backend API endpoints & Auth handlers

## 🎯 Current Status

_In Progress_ — Core layout structure, responsive navigation, and authentication (Auth.js v5) are fully set up. Next up: Kanban board columns and task management features.
