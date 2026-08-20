import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Alert, Container, InputAdornment, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/TopicCard';
import { getTopics } from '../services/topicService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTopics().then(setTopics).catch(() => setError('Topics could not be loaded.')).finally(() => setLoading(false));
  }, []);

  const filteredTopics = topics.filter((topic) => `${topic.name} ${topic.description}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <main>
      <Container maxWidth="lg" className="page-shell">
        <section className="dashboard-hero">
          <div>
            <Typography className="eyebrow">Your learning studio</Typography>
            <Typography variant="h1" component="h1">Make every answer<br /><em>move you forward.</em></Typography>
            <Typography className="hero-copy">Short, focused assessments for curious builders. Choose a topic and see what sticks.</Typography>
          </div>
          <div className="hero-stats"><strong>{topics.length || '—'}</strong><span>paths to explore</span></div>
        </section>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3 }}>
          <div><Typography variant="h4" component="h2" fontWeight={800}>Pick a topic</Typography><Typography color="text.secondary">A little practice goes a long way.</Typography></div>
          <TextField size="small" placeholder="Search topics" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }} sx={{ width: { xs: '100%', sm: 230 } }} />
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? <div className="topic-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={290} />)}</div> : filteredTopics.length > 0 ? <div className="topic-grid">{filteredTopics.map((topic) => <TopicCard key={topic.id} topic={topic} onStart={() => navigate(`/quiz/${topic.id}`)} />)}</div> : <Typography color="text.secondary">No topics match your search.</Typography>}
      </Container>
    </main>
  );
}
