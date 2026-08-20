# React Quiz Evaluation Application - Master Prompt

You are a senior Full Stack Architect and React Developer.

Design and generate a production-ready web application using:

- Frontend: React (latest) with functional components and hooks
- Styling: Material UI OR Tailwind CSS
- Backend: Node.js + Express (only if required)
- Data Storage: JSON files (no database)
- State Management: React Context or local state
- API Layer: REST APIs if backend is used
- TypeScript preferred but JavaScript is acceptable

## Objective

Build a simple learning/assessment application where users can:

1. View available topics on a Dashboard
2. Select a topic
3. View questionnaires related to that topic
4. Answer questions
5. Verify whether selected answers are correct
6. Get immediate visual feedback
7. View explanation/data points for correct answers
8. Retry questions by resetting selections

## Functional Requirements

### Dashboard Screen

Display all available topics as cards.

Example:

```json
[
  {
    "topicId": "react",
    "topicName": "React Fundamentals",
    "description": "React basics and component architecture"
  },
  {
    "topicId": "node",
    "topicName": "Node.js",
    "description": "Node.js concepts and backend development"
  }
]
```

Each topic card should:

- Show Topic Name
- Show Description
- Have "Start" button
- Navigate to questionnaire page

---

### Questionnaire Screen

After selecting a topic:

Dynamically load all questions from JSON.

Support:

#### Single Select Question

```json
{
  "questionType": "single"
}
```

Display:

- Radio buttons

#### Multi Select Question

```json
{
  "questionType": "multiple"
}
```

Display:

- Checkboxes

---

### Question Object Structure

```json
{
  "questionId": "Q1",
  "questionText": "Which hooks are available in React?",
  "questionType": "multiple",
  "options": [
    {
      "id": "A",
      "text": "useState"
    },
    {
      "id": "B",
      "text": "useEffect"
    },
    {
      "id": "C",
      "text": "select * from"
    },
    {
      "id": "D",
      "text": "useMemo"
    }
  ],
  "correctAnswers": ["A", "B", "D"],
  "summary": [
    "useState manages component state.",
    "useEffect handles side effects.",
    "useMemo optimizes expensive calculations."
  ]
}
```

---

### Important Validation Rule

DO NOT display:

```json
correctAnswers
```

to UI users.

Correct answers must remain hidden until user clicks:

```text
Verify Answer
```

---

### Verify Functionality

Provide:

```text
[ Verify Answer ]
```

button for each question.

When clicked:

#### If Correct

- Display green border/card
- Show success icon
- Show message:

```text
Correct Answer
```

- Display summary/data points section

Example:

```text
Key Learning Points

✓ useState manages state

✓ useEffect handles side effects

✓ useMemo improves performance
```

#### If Incorrect

- Display red border/card
- Show error icon
- Show message:

```text
Incorrect Answer
```

- Do NOT reveal correct option IDs
- Show guidance:

```text
Please review and try again.
```

---

### Retry Functionality

Provide:

```text
[ Retry ]
```

button

On click:

- Clear selected options
- Remove validation colors
- Hide result message
- Hide summary section
- Allow re-answering

---

### Dynamic Data Requirement

All Topics and Questionnaires must come from JSON.

Folder structure:

```text
data/
│
├── topics.json
│
├── questionnaires/
│   ├── react.json
│   ├── node.json
│   └── javascript.json
```

Application must dynamically:

1. Load topics
2. Load selected topic questionnaire
3. Render screens from JSON

No hardcoded questions or topics.

---

### Suggested JSON Structure

#### topics.json

```json
{
  "topics": [
    {
      "id": "react",
      "name": "React Fundamentals"
    },
    {
      "id": "node",
      "name": "Node.js"
    }
  ]
}
```

#### react.json

```json
{
  "topicId": "react",
  "questions": []
}
```

---

### UI Requirements

Modern responsive dashboard.

Use:

- Cards
- Clean spacing
- Responsive grid
- Mobile-friendly layout
- Light theme

Question card should include:

```text
Question Title
Question Text

Options

[Verify Answer]

Result Area

Summary Area

[Retry]
```

---

### Component Structure

```text
src/
|
├── pages/
│   ├── Dashboard.jsx
│   ├── Questionnaire.jsx
|
├── components/
│   ├── TopicCard.jsx
│   ├── QuestionCard.jsx
│   ├── AnswerOptions.jsx
│   ├── ResultPanel.jsx
|
├── services/
│   ├── topicService.js
│   ├── questionnaireService.js
|
├── data/
│   ├── topics.json
│   └── questionnaires/
|
├── routes/
│   └── AppRoutes.jsx
|
└── App.jsx
```

---

### Bonus Features

Implement:

- Question progress indicator
- Topic search/filter
- Expandable Key Learning Points section
- Toast notifications
- Animated success/error states
- Accessibility support
- Keyboard navigation
- Loading spinner while fetching JSON

---

### Expected Deliverables

Generate:

1. Complete React application structure
2. Node.js Express backend (if needed)
3. Sample JSON files
4. Component code
5. Routing setup
6. Services layer
7. Validation logic
8. Retry logic
9. Responsive styling
10. README with setup instructions

Follow clean architecture, reusable components, separation of concerns, and best practices throughout the implementation.
