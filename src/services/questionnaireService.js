const questionnaires = import.meta.glob('../data/questionnaires/*.json', {
  eager: true,
  import: 'default'
});

function shuffleOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export async function getQuestionnaire(topicId) {
  const questionnaire = questionnaires[`../data/questionnaires/${topicId}.json`];
  if (!questionnaire) {
    throw new Error('This topic is not available.');
  }
  return {
    ...questionnaire,
    questions: questionnaire.questions.map((question) => ({
      ...question,
      options: shuffleOptions(question.options)
    }))
  };
}
