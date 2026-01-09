# 🚀 Deployment Guide

This guide will help you deploy the **Task Management App** to the web using **Vercel** (for the Client) and **Render** (for the Server).

---

## 🏗️ 1. Deploy Server (Backend) on Render

1.  Push your code to **GitHub** (you have already done this!).
2.  Go to [Render.com](https://render.com/) and create a free account.
3.  Click **"New"** -> **"Web Service"**.
4.  Connect your GitHub repository (`Task-management-app`).
5.  **Settings**:
    *   **Root Directory**: `server` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
6.  Click **"Create Web Service"**.
7.  Wait for deployment. Once done, copy the **Render URL** (e.g., `https://task-app-api.onrender.com`).

---

## 🌐 2. Deploy Client (Frontend) on Vercel

1.  Go to [Vercel.com](https://vercel.com/) and login (with GitHub is best).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `Task-management-app` repository.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Environment Variables**:
        *   **Key**: `VITE_SERVER_URL`
        *   **Value**: Paste your Render URL here (e.g., `https://task-app-api.onrender.com`)
5.  Click **"Deploy"**.

---

## ✅ 3. Final Check

Open your **Vercel App URL**.
*   Try creating a task.
*   Ask the Chatbot.
*   If everything works (and persists after refresh), you are live! 🚀
