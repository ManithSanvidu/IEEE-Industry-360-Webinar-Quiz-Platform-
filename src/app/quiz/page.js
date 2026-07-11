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
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Load quiz definition
  const loadQuiz = useCallback(async () => {
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
      setNotStarted(false);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [router, doSubmit]);

  // Initial load
  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  // Auto-polling when notStarted
  useEffect(() => {
    if (!notStarted) return;
    const interval = setInterval(() => {
      fetch('/api/quiz').then(r => r.json()).then(d => {
        if (!d.notStarted && !d.error) {
          clearInterval(interval);
          setLoading(true);
          loadQuiz();
        }
      }).catch(() => { });
    }, 5000);
    return () => clearInterval(interval);
  }, [notStarted, loadQuiz]);

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
  const progress = questions?.length ? (answeredCount / questions.length) * 100 : 0;

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
        <style dangerouslySetInnerHTML={{
          __html: `
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

  // Prevent copy, cut, right-click, and specific key combinations (Ctrl+C, Ctrl+U, F12, Ctrl+Shift+I)
  useEffect(() => {
    const handleContext = (e) => e.preventDefault();
    const handleCopyCut = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            <span>Progress: {answeredCount}/{questions?.length || 0}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        {(questions?.length || 0) > 0 && (
          <div
            className="question-card slide-in-right"
            key={currentIndex}
            style={{
              animation: 'slideInRight 0.4s ease-out forwards',
              opacity: 0,
              maxWidth: '900px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <span className="question-number">Q{questions[currentIndex]?.id}</span>
              <span className="question-type" style={{ marginLeft: '10px' }}>
                {questions[currentIndex]?.type === 'mcq' ? '📝 MCQ' : '✍️ Short Answer'}
              </span>
            </div>
            <p
              className="question-text"
              style={{
                maxWidth: '750px',
                margin: '0 auto 2rem',
                textAlign: 'center',
                fontSize: '1.4rem',
                lineHeight: '1.7',
                fontWeight: 600
              }}
            >
              {questions[currentIndex]?.question}
            </p>

            {questions[currentIndex]?.options ? (
              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}
              >
                {questions[currentIndex].options.map((opt, oi) => (
                  <button key={oi} className={`option-btn ${answers[questions[currentIndex].id] === opt ? 'selected' : ''}`}
                    onClick={() => setAnswers({ ...answers, [questions[currentIndex].id]: opt })}>
                    <span style={{ color: 'var(--dragon-gold)', fontWeight: 600, marginRight: '10px' }}>
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <input className="short-answer-input" type="text" placeholder="Type your answer here..."
                  style={{ textAlign: 'center', width: '100%' }}
                  value={answers[questions[currentIndex]?.id] || ''}
                  onChange={e => setAnswers({ ...answers, [questions[currentIndex].id]: e.target.value })} />
              </div>
            )}

            <div className="quiz-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(220,231,245,0.5)' }}>
                Answered {answeredCount} of {questions?.length || 0}
              </p>
              <div>
                {currentIndex > 0 && (
                  <button
                    className="btn-secondary"
                    style={{ marginRight: '1rem', padding: '12px 24px' }}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                  >
                    ⬅️ Previous
                  </button>
                )}
                {currentIndex < (questions?.length || 0) - 1 ? (
                  <button
                    className="btn-primary"
                    style={{ padding: '12px 24px' }}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                  >
                    Next ➡️
                  </button>
                ) : (
                  <button
                    className="btn-fire"
                    style={{ padding: '12px 24px' }}
                    onClick={() => doSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? '🔄 Submitting...' : ' Submit Quest'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes slideInRight {
            0% { transform: translateX(50px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}} />
      </div>
    </>
  );
}
