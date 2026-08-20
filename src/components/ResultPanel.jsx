import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Alert, Button, Collapse, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default function ResultPanel({ result, summary, onRetry }) {
  const [showSummary, setShowSummary] = useState(true);
  if (!result) return null;

  return (
    <Stack gap={2} className={`result-panel ${result === 'correct' ? 'result-correct' : 'result-incorrect'}`}>
      <Alert severity={result === 'correct' ? 'success' : 'error'} icon={result === 'correct' ? <CheckCircleRoundedIcon /> : <ErrorRoundedIcon />}>
        <Typography fontWeight={800}>{result === 'correct' ? 'Correct Answer' : 'Incorrect Answer'}</Typography>
        <Typography variant="body2">{result === 'correct' ? 'Nice work. Keep building on this concept.' : 'Please review and try again.'}</Typography>
      </Alert>
      {result === 'correct' && (
        <>
          <Divider />
          <Button variant="text" onClick={() => setShowSummary((current) => !current)} sx={{ alignSelf: 'flex-start', px: 0 }}>
            {showSummary ? 'Hide key learning points' : 'Show key learning points'}
          </Button>
          <Collapse in={showSummary}>
            <Stack gap={1}>
              <Typography variant="subtitle2" fontWeight={800}>Key Learning Points</Typography>
              {summary.map((point) => <Typography key={point} variant="body2" color="text.secondary">✓ {point}</Typography>)}
            </Stack>
          </Collapse>
        </>
      )}
      <Button variant="outlined" onClick={onRetry} sx={{ alignSelf: 'flex-start' }}>Retry</Button>
    </Stack>
  );
}
