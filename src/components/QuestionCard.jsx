import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import AnswerOptions from './AnswerOptions';
import ResultPanel from './ResultPanel';

export default function QuestionCard({ question, index, total, selected, result, onSelect, onVerify, onRetry }) {
  return (
    <Card className={`question-card ${result ? `question-${result}` : ''}`} component="article">
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
          <Chip label={`Question ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`} size="small" />
          {result === 'correct' && <CheckRoundedIcon color="success" />}
        </Stack>
        <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 3, fontWeight: 800, lineHeight: 1.25 }}>{question.questionText}</Typography>
        <AnswerOptions question={question} selected={selected} disabled={Boolean(result)} onChange={onSelect} />
        <Divider sx={{ my: 3 }} />
        {!result && <Button variant="contained" onClick={onVerify} disabled={selected.length === 0}>Verify answer</Button>}
        <ResultPanel result={result} summary={question.summary} onRetry={onRetry} />
      </CardContent>
    </Card>
  );
}
