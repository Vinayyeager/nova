# CodeForge AI - Intelligent Code Assistant

A premium, modern AI Code Assistant website built with React.js, Tailwind CSS, Node.js, and Express. Features a ChatGPT/Copilot-like UI with live code preview, Monaco Editor, and intelligent code analysis.

![CodeForge AI](https://img.shields.io/badge/CodeForge-AI-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?style=flat-square&logo=tailwind-css)

## Features

### Chat-Based UI
- Real-time chat interface like ChatGPT
- User and AI message styling
- Code block rendering with syntax highlighting
- Typing animation for AI responses
- Copy and download code buttons

### AI Actions
- **Explain Code** - Detailed code explanations
- **Fix Code** - Error detection and fixes
- **Optimize Code** - Performance improvements
- **Convert Language** - Transform code between JavaScript, Python, Java, and C

### Live Code Preview
- Split-screen layout with resizable panels
- Monaco Editor (VS Code-like) integration
- Syntax highlighting
- Error detection
- Console output

### Smart Features
- Auto-detect programming language
- Highlight errors in red
- Show suggestions inline
- Copy and download buttons
- Theme toggle (dark/light)

### Auth System
- Login/Signup functionality
- LocalStorage-based authentication
- User session persistence

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS 3.4
- Monaco Editor
- Lucide React (icons)

### Backend
- Node.js + Express
- Rule-based AI simulation
- REST API

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd ai-code-assistant
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:3001

### Start Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## API Endpoints

### POST /api/chat
Send a message and receive AI response.

```json
Request: { "message": "string", "language": "string" }
Response: { "response": "string", "code": "string", "language": "string" }
```

### POST /api/explain
Get detailed explanation of code.

```json
Request: { "code": "string", "language": "string" }
Response: { "explanation": "string", "complexity": "string", "lines": "number" }
```

### POST /api/fix
Fix code errors.

```json
Request: { "code": "string", "language": "string" }
Response: { "fixedCode": "string", "errors": [], "warnings": [] }
```

### POST /api/optimize
Optimize code performance.

```json
Request: { "code": "string", "language": "string" }
Response: { "optimizedCode": "string", "improvements": [] }
```

### POST /api/convert
Convert code between languages.

```json
Request: { "code": "string", "from": "string", "to": "string" }
Response: { "convertedCode": "string", "notes": "string" }
```

## Supported Languages

- JavaScript
- Python
- Java
- C

## Project Structure

```
ai-code-assistant/
├── backend/
│   ├── server.js           # Express server
│   ├── routes/
│   │   └── api.js          # API routes
│   ├── controllers/
│   │   └── aiController.js # AI logic controller
│   └── utils/
│       └── codeAnalyzer.js # Code analysis utilities
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ChatContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## UI Design

The UI features:
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Gradient buttons
- Professional typography (Inter + JetBrains Mono)
- Dark theme by default
- Fully responsive design

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with passion for developers 🚀
