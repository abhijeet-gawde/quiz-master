import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';

export default function AnswerOptions({ question, selected, disabled, onChange }) {
  const isMultiple = question.questionType === 'multiple';
  const options = question.options;

  return (
    <FormControl component="fieldset" fullWidth disabled={disabled}>
      <FormLabel component="legend" sx={{ mb: 1, color: 'text.secondary', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {isMultiple ? 'Select all that apply' : 'Select one answer'}
      </FormLabel>
      {isMultiple ? (
        <Stack gap={1}>
          {options.map((option) => (
            <FormControlLabel
              key={option.id}
              className="answer-option"
              control={<Checkbox checked={selected.includes(option.id)} onChange={() => onChange(option.id)} />}
              label={option.text}
            />
          ))}
        </Stack>
      ) : (
        <RadioGroup value={selected[0] ?? ''} onChange={(event) => onChange(event.target.value)}>
          <Stack gap={1}>
            {options.map((option) => (
              <FormControlLabel key={option.id} className="answer-option" value={option.id} control={<Radio />} label={option.text} />
            ))}
          </Stack>
        </RadioGroup>
      )}
    </FormControl>
  );
}
