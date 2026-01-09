# 🚀 TaskFlow - Intelligent Task Management System

**TaskFlow** is a modern, real-time collaborative task management application designed for seamless team productivity. Built with a "premium-first" design philosophy, it combines fluid animations, powerful features, and AI assistance into a single cohesive workspace.

![TaskFlow Screenshot](./screenshot.png) *(Note: Add a screenshot here)*

## ✨ Key Features

### 🧠 Smart Features
-   **AI Assistant**: A built-in context-aware chatbot 🤖 that can answer questions about your board status ("How many tasks?", "Show summary") and provide productivity suggestions.
-   **Instant Search & Filter**: Real-time filtering 🔍 allows you to instantly find tasks by content or tags (e.g., "Design", "High Priority").

### ⚡ interactive UX
-   **Drag & Drop Board**: Powered by `@hello-pangea/dnd` for smooth, high-performance drag interactions.
-   **Confetti Celebration**: Get rewarded with a confetti explosion 🎉 whenever you move a task to the "Done" column!
-   **Dynamic Organization**: Create and delete custom lists/columns on the fly.
-   **Smart Tagging**: Tasks are automatically assigned relevant tags (e.g., #Frontend, #Bug) for better categorization.

### 🛡️ Robust & Reliable
-   **Offline-First Architecture**: Works seamlessly even without internet or when Firebase services are unreachable, utilizing an intelligent LocalStorage fallback mechanism.
-   **Real-Time Sync**: Updates are broadcast instantly to all connected users via **Socket.io**.
-   **Dark/Light Mode**: A beautiful glassmorphism-based UI that adapts to your preference. 🌙/☀️

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Context API
-   **Backend**: Node.js, Express, Socket.io
-   **Database/Cloud**: Firebase Firestore (Persistence), LocalStorage (Fallback)
-   **Styling**: Vanilla CSS (Variables, Gradients, Glassmorphism)

## 🚀 Getting Started

### Prerequisites
-   Node.js installed (v16+)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/taskflow.git
    cd taskflow
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Run the Application**
    Open two terminals:

    *Terminal 1 (Server):*
    ```bash
    cd server
    npm run dev
    ```

    *Terminal 2 (Client):*
    ```bash
    cd client
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to see the app in action!

## 🤝 Contributing
Feel free to open issues or submit pull requests. Let's make task management fun again!

---
*Built with ❤️ by [Your Name]*
