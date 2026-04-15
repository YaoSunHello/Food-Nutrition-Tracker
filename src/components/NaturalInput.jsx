import { useState, useRef } from 'react';
import { parseMealText } from '../services/mealParser.js';
import { searchFood, extractNutrients } from '../services/nutritionApi.js';

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export default function NaturalInput({ onAddMultiple }) {
  const [text, setText]         = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState(''); // progress messages
  const [error, setError]       = useState('');
  const recognitionRef          = useRef(null);

  // ── Voice ────────────────────────────────────────────
  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Try Chrome or Safari.');
      return;
    }

    setError('');
    const recognition = new SpeechRecognition();
    recognition.continuous    = false;
    recognition.interimResults = false;
    recognition.lang          = 'en-US';

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => (prev ? prev + ', ' + transcript : transcript));
    };

    recognition.onerror = (e) => {
      setError('Voice error: ' + e.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  // ── Parse & fetch ─────────────────────────────────────
  async function handleAdd() {
    const items = parseMealText(text);
    if (items.length === 0) {
      setError('Could not understand the input. Try something like: "apple 150g, chicken breast 200g"');
      return;
    }

    setLoading(true);
    setError('');
    const entries = [];
    const failed  = [];

    for (let i = 0; i < items.length; i++) {
      const { food, grams } = items[i];
      setStatus(`Looking up ${i + 1} of ${items.length}: ${food}…`);
      try {
        const result = await searchFood(food);
        entries.push(extractNutrients(result, grams));
      } catch {
        failed.push(food);
      }
    }

    setLoading(false);
    setStatus('');

    if (entries.length > 0) {
      onAddMultiple(entries);
      setText('');
    }

    if (failed.length > 0) {
      setError(`Could not find: ${failed.join(', ')}. Try simpler names.`);
    }
  }

  return (
    <div className="natural-input">
      <div className="natural-input__header">
        <span className="natural-input__label">Describe your meal</span>
        <span className="natural-input__hint">
          e.g. "apple 150g, chicken breast 200g, brown rice 180g"
        </span>
      </div>

      <div className="natural-input__row">
        <textarea
          className="natural-input__textarea"
          placeholder="Type or use the mic to describe what you ate…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          rows={3}
        />
        <button
          type="button"
          className={`natural-input__mic ${listening ? 'natural-input__mic--active' : ''}`}
          onClick={toggleVoice}
          disabled={loading}
          title={listening ? 'Stop listening' : 'Start voice input'}
        >
          {listening ? '⏹' : '🎤'}
        </button>
      </div>

      {listening && (
        <p className="natural-input__listening">Listening… speak now</p>
      )}

      {status && <p className="natural-input__status">{status}</p>}
      {error  && <p className="natural-input__error">{error}</p>}

      <button
        type="button"
        className="natural-input__btn"
        onClick={handleAdd}
        disabled={loading || !text.trim()}
      >
        {loading ? 'Adding…' : 'Add to Table'}
      </button>
    </div>
  );
}
