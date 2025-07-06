import { useState } from 'react';

const qaFlow = [
  { field: 'material', question: 'What material are the bottles made of?', options: ['glass', 'plastic', 'aluminum', 'steel', 'other'] },
  { field: 'volume_per_unit', question: 'What is the size or volume of each bottle?', options: ['0.5L', '1L', '2L', '5L'] },
  { field: 'filled', question: 'Are they empty or filled?', options: ['empty', 'filled'] },
  { field: 'contents', question: 'If filled, what is the content?', options: ['water', 'juice', 'chemical', 'empty'], conditional_on: { filled: 'filled' } },
  { field: 'packaging', question: 'How are they packaged?', options: ['boxed', 'palletized', 'shrink-wrapped', 'loose'] },
  { field: 'fragile', question: 'Are they fragile or require special handling?', options: ['yes', 'no'] },
  { field: 'total_weight', question: 'What is the total weight of the shipment?', options: ['<50 lbs', '50-100 lbs', '100-200 lbs', '200+ lbs'] },
  { field: 'dimensions', question: 'What are the total dimensions (LxWxH)?', options: ['10x10x10', '20x20x20', '40x40x60', 'custom'] }
];

export default function NMFCChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const current = qaFlow[step];
  const shouldSkip = current?.conditional_on &&
    Object.entries(current.conditional_on).some(([key, val]) => answers[key] !== val);

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [current.field]: value }));
    setStep(prev => prev + 1);
  };

  const submitToBackend = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://nmfc-api-backend.railway.app/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch NMFC classification. Contact Ankit S and tell him this sucks:", error);
      setResult({ error: "Failed to classify. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (step >= qaFlow.length) {
    if (!result && !loading) submitToBackend();
    return (
      <div style={{ marginTop: '2rem', background: '#f8f8f8', padding: '1rem', borderRadius: '8px' }}>
        <h2 style={{ fontWeight: 'bold' }}>✅ Summary</h2>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
        {loading && <p>🔄 Classifying with GPT + FAISS...</p>}
        {result && !loading && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e0ffe0' }}>
            <h3>📦 NMFC Classification Result</h3>
            {result.error ? (
              <p style={{ color: 'red' }}>{result.error}</p>
            ) : (
              <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>
        )}
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
      {current.options.map(opt => (
        <button key={opt} onClick={() => handleAnswer(opt)} style={{
          margin: '0.5rem', padding: '0.5rem 1rem',
          background: '#007bff', color: 'white', border: 'none', borderRadius: '5px'
        }}>
          {opt}
        </button>
      ))}
    </div>
  );
}
