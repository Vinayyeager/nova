# AI Code Assistant - Premium Specification

## Project Overview
- **Project Name**: CodeForge AI
- **Type**: Full-stack AI Code Assistant (ChatGPT/Copilot style)
- **Core Functionality**: Chat-based code assistant with live preview, code analysis, and multi-language support
- **Target Users**: Developers seeking AI-powered code assistance

## Tech Stack
### Frontend
- React 18 + TypeScript
- Tailwind CSS 3.4
- Monaco Editor (VS Code-like)
- Lucide React (icons)
- React Router DOM

### Backend
- Node.js + Express
- CORS, body-parser
- Rule-based AI simulation

## Design System

### Color Palette
```
Background Dark: #0a0a0f (primary bg)
Background Card: #12121a (sidebar/cards)
Background Hover: #1a1a25 (hover states)
Border: #2a2a3a (borders)
Primary Accent: #6366f1 (indigo-500)
Primary Hover: #818cf8 (indigo-400)
Success: #22c55e (green-500)
Error: #ef4444 (red-500)
Warning: #f59e0b (amber-500)
Text Primary: #f8fafc (slate-50)
Text Secondary: #94a3b8 (slate-400)
Text Muted: #64748b (slate-500)
```

### Typography
- Font Family: Inter (Google Fonts)
- Code Font: JetBrains Mono
- Headings: 600-700 weight
- Body: 400-500 weight

### Visual Effects
- Glassmorphism: backdrop-blur-xl with subtle opacity
- Shadows: Large diffused shadows for depth
- Gradients: Subtle gradient accents on buttons
- Animations: Smooth 200-300ms transitions
- Border radius: Rounded-xl for cards, rounded-lg for buttons

## Layout Structure

### Main Layout
```
┌────────────────────────────────────────────────────────────┐
│  Header (Logo, Theme Toggle, User Menu)                    │
├────────────┬───────────────────────────────────────────────┤
│            │                                               │
│  Sidebar   │  Main Content Area                            │
│  (240px)   │  ┌─────────────────┬─────────────────┐        │
│            │  │  Chat Panel     │  Preview Panel  │        │
│  - History │  │  (50%)          │  (50%)          │        │
│  - New     │  │                 │                 │        │
│  - Search  │  │                 │                 │        │
│            │  │                 │                 │        │
│            │  └─────────────────┴─────────────────┘        │
│            │  Input Area (Monaco Editor + Actions)          │
└────────────┴───────────────────────────────────────────────┘
```

## Features Specification

### 1. Authentication System
- Login/Signup modal
- LocalStorage-based auth
- User session persistence
- Guest mode support

### 2. Chat System
- Real-time message display
- User/AI message styling
- Code block rendering with syntax highlighting
- Markdown support
- Typing animation for AI responses
- Message timestamps
- Copy code button
- Download code button

### 3. AI Actions (per message)
- **Explain Code**: Detailed code explanation
- **Fix Code**: Error detection and fixes
- **Optimize Code**: Performance improvements
- **Convert Language**: JS ↔ Python ↔ C ↔ Java

### 4. Code Editor
- Monaco Editor integration
- Syntax highlighting
- Auto language detection
- Error highlighting (red squiggly)
- Suggestions inline
- Multiple language support
- Line numbers
- Minimap

### 5. Live Preview Panel
- Split screen layout (resizable)
- Code output display
- Execution results
- Error visualization
- Console output

### 6. Chat History
- LocalStorage persistence
- Search functionality
- Delete chat
- New chat button
- Timestamp display

### 7. Theme System
- Dark mode (default)
- Light mode toggle
- System preference detection
- Smooth transition

## Backend API

### Endpoints

#### POST /api/chat
```json
Request: { "message": "string", "language": "string" }
Response: { "response": "string", "code": "string", "language": "string" }
```

#### POST /api/explain
```json
Request: { "code": "string", "language": "string" }
Response: { "explanation": "string", "complexity": "string", "lines": "number" }
```

#### POST /api/fix
```json
Request: { "code": "string", "language": "string" }
Response: { "fixedCode": "string", "errors": [], "warnings": [] }
```

#### POST /api/optimize
```json
Request: { "code": "string", "language": "string" }
Response: { "optimizedCode": "string", "improvements": [] }
```

#### POST /api/convert
```json
Request: { "code": "string", "from": "string", "to": "string" }
Response: { "convertedCode": "string", "notes": "string" }
```

### AI Simulation Logic
- Syntax error detection
- Missing semicolons/brackets
- Undefined variables
- Infinite loop detection
- Bad naming conventions
- Code pattern analysis

## Component List

### Layout Components
- `Layout.tsx` - Main layout wrapper
- `Sidebar.tsx` - Left navigation
- `Header.tsx` - Top header

### Chat Components
- `ChatScreen.tsx` - Main chat interface
- `Message.tsx` - Individual message
- `ChatInput.tsx` - Message input
- `ChatHistory.tsx` - History sidebar

### Editor Components
- `CodeEditor.tsx` - Monaco wrapper
- `PreviewPanel.tsx` - Code preview

### UI Components
- `Button.tsx` - Styled button
- `Modal.tsx` - Auth modal
- `ThemeToggle.tsx` - Theme switcher
- `LoadingSpinner.tsx` - Loading state
- `Toast.tsx` - Notifications

### Auth Components
- `LoginForm.tsx` - Login form
- `SignupForm.tsx` - Signup form
- `UserMenu.tsx` - User dropdown

## File Structure

```
ai-code-assistant/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── controllers/
│   │   └── aiController.js
│   └── utils/
│       └── codeAnalyzer.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Implementation Priority

1. ✅ Backend server setup
2. ✅ API endpoints
3. ✅ Frontend project setup
4. ✅ Layout components
5. ✅ Chat system
6. ✅ Monaco Editor
7. ✅ AI actions
8. ✅ Theme system
9. ✅ Auth system
10. ✅ Polish & animations
