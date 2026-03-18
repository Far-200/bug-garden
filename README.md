# 🌱 Bug Garden

A playful developer tool that analyzes code and surfaces potential issues as **"bugs growing in a garden."**
Instead of dry static-analysis output, Bug Garden visualizes problems as living creatures inside an interactive garden canvas.

The goal is to make debugging more **intuitive, visual, and fun** while still providing useful insights about code quality.

---

# 🐞 What is Bug Garden?

Bug Garden is a small full-stack project designed to explore:

- code analysis
- visual debugging interfaces
- full-stack development
- interactive developer tools

When code is uploaded or pasted into the system, the backend analyzes it and returns detected issues.
Each issue becomes a **"bug creature"** that appears inside a visual garden on the frontend.

Different bugs represent different types of issues:

| Bug Type      | Meaning                   |
| ------------- | ------------------------- |
| 🐞 Red Bug    | Critical error            |
| 🐜 Yellow Ant | Warning                   |
| 🐛 Green Worm | Minor issue               |
| 🦋 Butterfly  | Clean / good code section |

The more issues your code has… the more bugs grow in the garden.

Clean code results in a **beautiful, peaceful garden**.

---

# 🎯 Project Goals

This project exists mainly for **learning and experimentation**.

It explores:

- building a small developer tool
- creating visual debugging experiences
- designing modular backend APIs
- connecting a React frontend with a Node.js backend
- experimenting with code analysis logic

It also serves as a **portfolio project** demonstrating:

- frontend interaction
- backend API design
- developer tooling ideas

---

# ⚙️ Tech Stack

## Frontend

- React
- Vite
- HTML / CSS
- Canvas rendering
- Axios for API communication

Frontend responsibilities:

- code upload interface
- bug visualization canvas
- interactive garden display
- displaying detected issues

---

## Backend

- Node.js
- Express.js

Backend responsibilities:

- code analysis
- issue detection
- returning structured results to frontend
- scoring bug severity

---

# 🏗 Project Structure

```
bug-garden
│
├── backend
│   └── src
│       ├── analyzer
│       │   └── codAnalyzer.js
│       │
│       ├── routes
│       │   └── analyzeRoutes.js
│       │
│       └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── BugCreature.jsx
│   │   │   └── GardenCanvas.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── UploadPage.jsx
│   │   │   └── GardenPage.jsx
│   │   │
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🌿 How Bug Garden Works

## 1️⃣ Upload or Paste Code

The user submits code through the frontend.

```
Frontend → POST /analyze
```

---

## 2️⃣ Backend Analysis

The backend analyzer inspects the code and searches for patterns such as:

- unused variables
- long functions
- console logs
- potential syntax mistakes
- complexity issues

Example output:

```json
{
  "issues": [
    {
      "type": "warning",
      "message": "Unused variable",
      "line": 12
    },
    {
      "type": "error",
      "message": "Missing semicolon",
      "line": 21
    }
  ]
}
```

---

## 3️⃣ Garden Visualization

The frontend converts issues into **visual creatures**.

Example mapping:

```
Error → Red Beetle
Warning → Yellow Ant
Minor Issue → Green Worm
Clean Code → Flower
```

These creatures populate the garden canvas.

---

# 🧠 Example Analyzer Logic

Example detection logic:

```javascript
if (line.includes("console.log")) {
  issues.push({
    type: "warning",
    message: "Console log detected",
    line: lineNumber,
  });
}
```

This simple rule becomes a **bug creature in the garden**.

---

# 🚀 Running the Project Locally

## 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/bug-garden.git
cd bug-garden
```

---

## 2️⃣ Start Backend

```
cd backend
npm install
node src/server.js
```

Backend will run on:

```
http://localhost:5000
```

---

## 3️⃣ Start Frontend

Open a second terminal.

```
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 📡 API Endpoint

## Analyze Code

```
POST /analyze
```

### Request

```json
{
  "code": "console.log('hello world')"
}
```

### Response

```json
{
  "issues": [
    {
      "type": "warning",
      "message": "Console log detected",
      "line": 1
    }
  ]
}
```

---

# 🌱 Future Improvements

Possible expansions for this project:

- AST-based code analysis
- ESLint integration
- multi-language support
- animated bug creatures
- bug evolution system
- difficulty scoring
- GitHub repo analysis
- VSCode extension version

---

# 🎨 Inspiration

Debugging tools are often extremely technical and intimidating.

Bug Garden explores the idea that **developer tools can be visual and playful while still useful.**

Instead of reading walls of warnings, developers can **see their code health grow like a garden.**

---

# 📚 Learning Outcomes

This project helped practice:

- building APIs with Express
- designing frontend architecture
- integrating backend and frontend systems
- creating visual representations of data
- experimenting with developer-tool UX

---

# 👨‍💻 Author

Farhaan Khan

Computer Science Student
Building projects to learn systems, tools, and software engineering.

---

# 📜 License

This project is for educational and portfolio purposes.
