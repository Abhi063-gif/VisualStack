# VisualStack Studio

**VisualStack Studio** is a full-stack, visual-first IDE and Blueprint Automation Engine built with React, TypeScript, HTML5 Canvas (Konva), and React Flow (`@xyflow/react`).

---

## 🌟 Key Features

- **Frontend Visual UI Designer** (`/designer`):
  - Canvas-based drag-and-drop element placement with interactive transform handles, layout snapping, vector grid, and layer tree.
  - Tabbed Inspector Panel (`Design` | `Inspect` | `Interactions`) with layout alignment tools, typography, and styling.

- **Backend Visual Logic Designer** (`/backend`):
  - 130+ node Blueprint Automation Engine across 12 categories:
    - **Events & Triggers** (`App Started`, `Page Loaded`, `Button Clicked`, `Form Submitted`, `Timer`)
    - **Authentication & Security** (`User Login`, `User Signup`, `Social OAuth`, `Hash Password`, `Sign JWT`)
    - **Database & Persistence** (`Find Records`, `Find Record By ID`, `Insert Record`, `Update Record`, `Delete Record`)
    - **API & Web Services** (`API Request / Fetch`, `JSON Parser`)
    - **Navigation & Modals** (`Go To Screen`, `Go Back`, `Open Modal`, `Bottom Sheet`)
    - **Control Flow & Loops** (`Condition If/Else`, `Loop For Each`, `Switch Case`, `Delay`)
    - **E-Commerce & Payments** (`Stripe Checkout`, `Add to Cart`, `Process Order`)
    - **Communication & AI** (`Send Email`, `Send Push Notification`, `OpenAI / Gemini Prompt`)
  - Magnetic, fail-safe port wiring with automatic data type coercion.
  - Real-Time Execution Console with color-coded execution logs.
  - Native 100% resizable sidebars (`NodePalette` & `PropertyPanel`).

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone https://github.com/Abhi063-gif/VisualStack.git
cd VisualStack
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` or `http://localhost:3000` in your browser.

- **Frontend Designer**: `http://localhost:3000/designer`
- **Backend Logic Designer**: `http://localhost:3000/backend`

### 3. Build for Production

```bash
npm run build
```

---

## 📁 Repository Structure

```
src/
├── components/          # Reusable UI & Layout components
├── features/
│   ├── designer/        # Frontend UI Canvas & Rendering Engine
│   └── logic/           # Backend Visual Logic Node Engine
├── pages/               # Designer, Backend, Projects, Settings pages
├── routes/              # App Router configuration
└── stores/              # Zustand state management
```

---

## 📄 License

MIT License.
