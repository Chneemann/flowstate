# Flowstate

A modern, high-performance Kanban & Workflow web application designed to help you lock in and enter the productivity flow.

[![Deployment Status](https://git.andre-kempf.com/Chneemann/flowstate/badges/workflows/deploy.yml/badge.svg?branch=main)](https://git.andre-kempf.com/Chneemann/flowstate/actions)
[![Website Status](https://img.shields.io/badge/website-online-brightgreen?style=flat-square&logo=google-chrome&logoColor=white)](https://flowstate.andre-kempf.com)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=flat-square)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Route Groups)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Auth.js v5 (NextAuth)](https://authjs.dev/) with Credentials Provider & bcrypt hashing
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) managed via [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit (Studio included)
- **DevOps & Infrastructure:** Docker & Docker Compose, Caddy Reverse Proxy, Forgejo Actions (CI/CD Automated Deployment)

## 📂 Architecture & Structure

The project uses Next.js Route Groups to separate public and protected application areas cleanly:

- `app/(auth)/` — Public authentication routes (Login, Register)
- `app/(app)/` — Protected workspace & dashboard routes (Sidebar, Header, Kanban Board)
- `app/api/` — Backend API endpoints & Auth handlers (`/api/auth/register`, `[...nextauth]`)
- `db/` — Database schema definitions, migrations, and Drizzle configuration (`drizzle.config.ts`)
- `services/` — Business logic layers and external API integration services
- `utils/` — Shared helper functions, formatters, and global utility logic
- `types/` — Global TypeScript interfaces and type definitions
- `public/` — Static assets (images, icons, fonts)
- `.forgejo/workflows/` — Automated SSH deployment pipeline (`deploy.yml`)

## 🚀 CI/CD & Deployment

Deployments are fully automated using **Forgejo Actions** and SSH:

1. **Automated Trigger:** Pushes to the `main` branch trigger the SSH deployment workflow.
2. **Database Schema Sync:** Migrations are applied in milliseconds using `drizzle-kit push` executed directly inside the active `flowstate-studio` container.
3. **Zero-Downtime Container Rebuild:** Rebuilds production Docker images (`flowstate`) without disrupting live database volumes.

## 🎯 Current Status

_In Progress_ — Core layout structure, responsive navigation, PostgreSQL database integration via Drizzle ORM, full authentication (Auth.js v5), and an automated production CI/CD deployment pipeline are fully operational.
