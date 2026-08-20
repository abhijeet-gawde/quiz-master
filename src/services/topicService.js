import topicData from '../data/topics.json';

export async function getTopics() {
  return topicData.topics;
}
