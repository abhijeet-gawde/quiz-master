import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

const accentColors = {
  coral: { background: '#fff0eb', color: '#d6533e' },
  mint: { background: '#e5f5ee', color: '#2f8766' },
  gold: { background: '#fff4d6', color: '#b17b13' }
};

export default function TopicCard({ topic, onStart }) {
  const accent = accentColors[topic.accent] ?? accentColors.coral;

  return (
    <Card className="topic-card" component="article">
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <span className="topic-mark" style={{ backgroundColor: accent.background, color: accent.color }}>
            <AutoAwesomeRoundedIcon fontSize="small" />
          </span>
          <Chip label={topic.level} size="small" sx={{ backgroundColor: accent.background, color: accent.color, fontWeight: 700 }} />
        </Stack>
        <Typography variant="h5" component="h2" sx={{ mt: 3, mb: 1, fontWeight: 800 }}>{topic.name}</Typography>
        <Typography color="text.secondary" sx={{ minHeight: 52, lineHeight: 1.6 }}>{topic.description}</Typography>
        <Button fullWidth onClick={onStart} endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 3 }}>
          Start quiz
        </Button>
      </CardContent>
    </Card>
  );
}
