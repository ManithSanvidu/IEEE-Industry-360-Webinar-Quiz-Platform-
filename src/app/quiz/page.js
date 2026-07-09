'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

export default function Quiz() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [startedAt, setStartedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [notStarted, setNotStarted] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const answersRef = useRef({});
  const submittingRef = useRef(false);
  const attemptIdRef = useRef(null);
  const questionsRef = useRef([]);
  const router = useRouter();

  // Keep refs in sync with state
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);
  useEffect(() => { attemptIdRef.current = attemptId; }, [attemptId]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const currentAnswers = answersRef.current;
      const answerArray = questionsRef.current.map(q => ({
        questionId: q.id,
        answer: currentAnswers[q.id] || ''
      }));
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attemptIdRef.current, answers: answerArray })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setQuizCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {
      setError(err.message);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, []);

  // Load quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.user) { router.push('/login'); return; }
        setUser(authData.user);

        const quizRes = await fetch('/api/quiz');
        const quizData = await quizRes.json();
        
        if (quizData.notStarted) {
          setNotStarted(true);
          setLoading(false);
          return;
        }

        if (quizData.completed) {
          setQuizCompleted(true);
          setResult({ score: quizData.score, timeTaken: quizData.timeTaken, totalQuestions: 10 });
          setLoading(false);
          return;
        }
        if (!quizRes.ok) throw new Error(quizData.error);

        setQuestions(quizData.questions);
        questionsRef.current = quizData.questions;
        setAttemptId(quizData.attemptId);
        attemptIdRef.current = quizData.attemptId;
        setStartedAt(new Date(quizData.startedAt));

        // Calculate remaining time
        const remaining = Math.max(0, 600 - (quizData.elapsedSeconds || 0));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          doSubmit();
        }
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [router, doSubmit]);

  // Auto-polling when notStarted
  useEffect(() => {
    if (!notStarted) return;
    const interval = setInterval(() => {
      fetch('/api/quiz').then(r => r.json()).then(d => {
        if (!d.notStarted && !d.error) {
          window.location.reload();
        }
      }).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [notStarted]);

  // Timer
  useEffect(() => {
    if (loading || quizCompleted || !attemptId) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, quizCompleted, attemptId, doSubmit]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const timerClass = timeLeft <= 60 ? 'timer-danger' : timeLeft <= 180 ? 'timer-warning' : 'timer-safe';
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <><DragonBackground /><Navbar />
        <div className="page-container"><div className="dragon-icon" style={{ fontSize: '4rem' }}>⌛</div><p style={{ marginTop: '1rem' }}>Loading quiz...</p></div>
      </>
    );
  }

  if (notStarted) {
    return (
      <>
        <DragonBackground />
        <Navbar />
        <div className="page-container">
          <div className="glass-card result-card" style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⏳</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              <span className="fire-text">Hold Tight!</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--sky-mist)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Waiting for the Admin to start the quiz...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div className="loading-spinner"></div>
            </div>
            <p style={{ color: 'rgba(220,231,245,0.5)', fontSize: '0.85rem' }}>
              This page will automatically refresh once the quiz begins.
            </p>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .loading-spinner {
            border: 4px solid rgba(249,115,22,0.2);
            border-top: 4px solid var(--fire-orange);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </>
    );
  }

  if (quizCompleted) {
    return (
      <><DragonBackground /><Navbar />
        <div className="page-container">
          <div className="glass-card result-card" style={{ zIndex: 1 }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              <span className="fire-text">Quest Complete!</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--sky-mist)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Thank you for participating in the quiz! 🎉
            </p>
            <div style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: '14px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📢</div>
              <p style={{ color: 'var(--dragon-gold)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Thank you for submitting , results will be published in whatsapp channel.
              </p>
              <p style={{ color: 'rgba(220,231,245,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The winner will be declared based on the highest score and fastest completion time.
              </p>
            </div>
            <p style={{ color: 'rgba(220,231,245,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Your responses have been recorded successfully. Best of luck! 🔥
            </p>
            <button className="btn-primary" onClick={() => router.push('/')}>🏠 Back to Home</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DragonBackground />
      <Navbar />
      {/* Timer Bar */}
      <div className="timer-bar"><div className="timer-fill" style={{ width: `${(timeLeft / 600) * 100}%` }} /></div>
      <div className={`timer-display ${timerClass}`}>🔥 {formatTime(timeLeft)}</div>

      <div className="quiz-container" style={{ zIndex: 1, position: 'relative' }}>
        {error && <div className="error-msg">{error}</div>}

        <div className="progress-container">
          <div className="progress-text">
            <span>Progress: {answeredCount}/{questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} className="question-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div>
              <span className="question-number">Q{q.id}</span>
              <span className="question-type">{q.type === 'mcq' ? '📝 MCQ' : '✍️ Short Answer'}</span>
            </div>
            <p className="question-text">{q.question}</p>

            {q.options ? (
              q.options.map((opt, oi) => (
                <button key={oi} className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                  onClick={() => setAnswers({...answers, [q.id]: opt})}>
                  <span style={{ color: 'var(--dragon-gold)', fontWeight: 600, marginRight: '10px' }}>
                    {String.fromCharCode(65 + oi)}.
                  </span>
                  {opt}
                </button>
              ))
            ) : (
              <input className="short-answer-input" type="text" placeholder="Type your answer here..."
                value={answers[q.id] || ''}
                onChange={e => setAnswers({...answers, [q.id]: e.target.value})} />
            )}
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <button className="btn-fire" style={{ fontSize: '1.1rem', padding: '16px 50px' }}
            onClick={() => doSubmit()} disabled={submitting}>
            {submitting ? '🔄 Submitting...' : ' Submit Quest'}
          </button>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(220,231,245,0.4)' }}>
            Answered {answeredCount} of {questions.length} questions
          </p>
        </div>
      </div>
    </>
  );
}
