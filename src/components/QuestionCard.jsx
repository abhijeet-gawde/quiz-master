import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Alert, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AnswerOptions from './AnswerOptions';
import ResultPanel from './ResultPanel';

export default function QuestionCard({ question, index, total, selected, result, onSelect, onVerify, onRetry }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className={`question-card ${result ? `question-${result}` : ''}`} component="article">
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" justifyContent="space-between" gap={2} alignItems="flex-start" sx={{ mb: 2 }}>
          <Chip label={`Question ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`} size="small" />
          {result === 'correct' && <CheckRoundedIcon color="success" />}
        </Stack>

        {/* Skills Tags */}
        {question.skills && question.skills.length > 0 && (
          <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mb: 2 }}>
            {question.skills.map((skill) => (
              <Chip key={skill} label={skill} size="small" variant="outlined" color="primary" sx={{ height: 24, fontSize: '0.75rem' }} />
            ))}
          </Stack>
        )}

        <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 3, fontWeight: 800, lineHeight: 1.25 }}>{question.questionText}</Typography>
        <AnswerOptions question={question} selected={selected} disabled={Boolean(result)} onChange={onSelect} />

        {/* Hint Section */}
        {question.hint && (
          <Stack sx={{ my: 3 }}>
            <Button
              startIcon={<LightbulbOutlinedIcon />}
              onClick={() => setShowHint(!showHint)}
              variant="text"
              size="small"
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              {showHint ? 'Hide Hint' : 'Get Hint'}
            </Button>
            {showHint && (
              <Alert severity="info" sx={{ mt: 1, bgcolor: 'info.lighter', border: 'none' }}>
                <Typography variant="body2">{question.hint}</Typography>
              </Alert>
            )}
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />
        {!result && <Button variant="contained" onClick={onVerify} disabled={selected.length === 0}>Verify answer</Button>}
        <ResultPanel result={result} summary={question.summary} onRetry={onRetry} />
      </CardContent>
    </Card>
  );
}
