import { useState } from 'react';

const qaFlow = [
  { field: 'material', question: 'What material are the bottles made of?', options: ['glass', 'plastic', 'aluminum', 'steel', 'other'] },
  { field: 'volume_per_unit', question: 'What is the size or volume of each bottle?', type: 'text' },
  { field: 'filled', question: 'Are they empty or filled?', options: ['empty', 'filled'] },
  { field: 'contents', question: 'If filled, what is the content?', type: 'text', conditional_on: { filled: 'filled' } },
  { field: 'packaging', question: 'How are they packaged?', options: ['boxed', 'palletized', 'shrink-wrapped', 'loose'] },
  { field: 'fragile', question: 'Are they fragile or require special handling?', options: ['yes', 'no'] },
  { field: 'total_weight', question: 'What is the total weight of the shipment?', type: 'text' },
  { field: 'dimensions', question: 'What are the total dimensions (LxWxH)?', type: 'text' }
];

export default function NMFCChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = qaFlow[step];
  const shouldSkip = current?.conditional_on &&
    Object.entries(current.conditional_on).some(([key, val]) => answers[key] !== val);

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [current.field]: value }));
    setStep(prev => prev + 1);
  };

  if (step >= qaFlow.length) {
    return (
      <div style={{ marginTop: '2rem', background: '#f8f8f8', padding: '1rem', borderRadius: '8px' }}>
        <h2 style={{ fontWeight: 'bold' }}>✅ Summary</h2>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  if (shouldSkip) {
    setStep(prev => prev + 1);
    return null;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <p><strong>{current.question}</strong></p>
      {current.options ? (
        current.options.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
            {opt}
          </button>
        ))
      ) : (
        <input
          type="text"
          placeholder="Type your answer"
          onKeyDown={e => e.key === 'Enter' && handleAnswer(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
          autoFocus
        />
      )}
    </div>
  );
}
