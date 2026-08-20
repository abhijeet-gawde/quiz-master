# Quiz Master

A responsive React learning and assessment app powered entirely by JSON data. Choose a topic, answer single- or multi-select questions, verify your thinking, and review the learning points behind a correct answer.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Structure

- `src/data/topics.json` contains the dashboard topics.
- `src/data/questionnaires/*.json` contains questionnaire content and answer keys.
- `src/services` provides the data loading boundary.
- `src/components` contains reusable topic, answer, question, and result UI.
- `src/pages` contains the dashboard and questionnaire screens.

Answer keys are used only by the verification handler and are never rendered as option metadata or labels. Add a new topic to `topics.json` and a matching questionnaire JSON file to make it available.
