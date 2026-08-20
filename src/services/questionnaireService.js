const questionnaires = import.meta.glob('../data/questionnaires/*.json', {
  eager: true,
  import: 'default'
});

export async function getQuestionnaire(topicId) {
  const questionnaire = questionnaires[`../data/questionnaires/${topicId}.json`];
  if (!questionnaire) {
    throw new Error('This topic is not available.');
  }
  return questionnaire;
}
