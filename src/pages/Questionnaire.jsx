import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Alert, Button, Container, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { getQuestionnaire } from '../services/questionnaireService';
import { getTopics } from '../services/topicService';

export default function Questionnaire() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getTopics(), getQuestionnaire(topicId)])
      .then(([topics, questionnaire]) => { setTopic(topics.find((item) => item.id === topicId)); setQuestions(questionnaire.questions); })
      .catch(() => setError('This questionnaire could not be loaded.'))
      .finally(() => setLoading(false));
  }, [topicId]);

  function selectAnswer(question, optionId) {
    if (question.questionType === 'multiple') {
      setAnswers((current) => ({ ...current, [question.questionId]: (current[question.questionId] ?? []).includes(optionId) ? current[question.questionId].filter((id) => id !== optionId) : [...(current[question.questionId] ?? []), optionId] }));
    } else {
      setAnswers((current) => ({ ...current, [question.questionId]: [optionId] }));
    }
  }

  function verify(question) {
    const selected = answers[question.questionId] ?? [];
    const expected = [...question.correctAnswers].sort();
    setResults((current) => ({ ...current, [question.questionId]: JSON.stringify([...selected].sort()) === JSON.stringify(expected) ? 'correct' : 'incorrect' }));
  }

  function retry(questionId) {
    setAnswers((current) => ({ ...current, [questionId]: [] }));
    setResults((current) => { const next = { ...current }; delete next[questionId]; return next; });
  }

  if (loading) return <Container maxWidth="md" className="page-shell"><LinearProgress /></Container>;
  if (error || !topic) return <Container maxWidth="md" className="page-shell"><Alert severity="error">{error || 'Topic not found.'}</Alert><Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to topics</Button></Container>;

  const completed = Object.values(results).filter((result) => result === 'correct').length;
  return <main><Container maxWidth="md" className="page-shell questionnaire-shell">
    <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/')} sx={{ mb: 4 }}>All topics</Button>
    <Typography className="eyebrow">{topic.level} pathway</Typography>
    <Typography variant="h2" component="h1" sx={{ mb: 1 }}>{topic.name}</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>{topic.description}</Typography>
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography variant="body2" fontWeight={700}>Progress</Typography><Typography variant="body2" color="text.secondary">{completed} of {questions.length} complete</Typography></Stack>
    <LinearProgress variant="determinate" value={questions.length ? (completed / questions.length) * 100 : 0} sx={{ mb: 5 }} />
    <Stack gap={3}>{questions.map((question, index) => <QuestionCard key={question.questionId} question={question} index={index} total={questions.length} selected={answers[question.questionId] ?? []} result={results[question.questionId]} onSelect={(optionId) => selectAnswer(question, optionId)} onVerify={() => verify(question)} onRetry={() => retry(question.questionId)} />)}</Stack>
  </Container></main>;
}
