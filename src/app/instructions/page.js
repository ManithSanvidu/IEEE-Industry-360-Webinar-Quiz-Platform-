'use client';
import Link from 'next/link';
import DragonBackground from '@/components/DragonBackground';
import Navbar from '@/components/Navbar';

const guidelines = [
  { icon: '⏱️', title: 'Time Limit', desc: 'You have exactly 10 minutes to complete all 10 questions. The timer starts the moment the quiz opens. Unanswered questions will be marked as incorrect once time expires.' },
  { icon: '🎯', title: 'Topic Relevance', desc: 'All questions are directly based on the content covered by the speaker during today\'s webinar. Pay close attention to key concepts, statistics, and insights shared.' },
  { icon: '👤', title: 'Individual Attempt Only', desc: 'Each participant must complete the quiz independently. Collaboration or sharing answers with others is strictly prohibited.' },
  { icon: '🚫', title: 'No External Resources', desc: 'Do not use search engines, notes, or any external materials during the quiz. It is a test of your active listening and understanding.' },
  { icon: '✅', title: 'MCQ Instructions', desc: 'For multiple-choice questions, select the single best answer from the four options provided. There is no negative marking for incorrect answers, so attempt every question.' },
  { icon: '✍️', title: 'Short Answer Instructions', desc: 'For the 3 short answer questions, write brief, precise answers. Lengthy explanations are not required — clarity and accuracy matter most.' },
  { icon: '🌐', title: 'Stable Connection', desc: 'Ensure you have a stable internet connection before starting the quiz. Technical issues during the quiz cannot be grounds for a re-attempt.' },
  { icon: '🏆', title: 'Winner Declaration', desc: 'The participant with the highest score who has completed the quiz in the lowest amount of time will be declared the winner. Speed and accuracy both count!' }
];

export default function Instructions() {
  return (
    <>
      <DragonBackground />
      <Navbar />
      <div className="instructions-container" style={{ zIndex: 1, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="dragon-icon" style={{ fontSize: '3.5rem' }}>📜</div>
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>Quiz Guidelines</h1>
          <p style={{ color: 'rgba(220,231,245,0.6)' }}>Everything you need to know before you play</p>
        </div>

        <div className="info-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="info-card"><div className="info-value">10</div><div className="info-label">Total Questions</div></div>
          <div className="info-card"><div className="info-value">10</div><div className="info-label">Minutes Duration</div></div>
          <div className="info-card"><div className="info-value">1</div><div className="info-label">Lucky Winner</div></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
            alignItems: "start",
          }}
        >
          {/* Quiz Format */}
          <div className="glass-card">
            <h2
              style={{
                color: "var(--dragon-gold)",
                marginBottom: "1rem",
                fontSize: "1.3rem",
              }}
            >
              📋 Quiz Format
            </h2>

            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(192,38,211,0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(192,38,211,0.2)",
                }}
              >
                <h3 style={{ color: "var(--main-purple)", marginBottom: ".5rem" }}>
                  Multiple Choice (7 Questions)
                </h3>

                <ul
                  style={{
                    listStyle: "none",
                    fontSize: ".9rem",
                    color: "rgba(220,231,245,.7)",
                  }}
                >
                  <li>• 7 out of 10 questions are MCQs</li>
                  <li>• 4 answer options (A–D)</li>
                  <li>• Select ONE answer</li>
                  <li>• No negative marking</li>
                </ul>
              </div>

              <div
                style={{
                  padding: "1rem",
                  background: "rgba(249,115,22,0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(249,115,22,0.2)",
                }}
              >
                <h3 style={{ color: "var(--fire-orange)", marginBottom: ".5rem" }}>
                  Short Answer (3 Questions)
                </h3>

                <ul
                  style={{
                    listStyle: "none",
                    fontSize: ".9rem",
                    color: "rgba(220,231,245,.7)",
                  }}
                >
                  <li>• Brief written answers</li>
                  <li>• Keep answers concise</li>
                  <li>• Based on webinar</li>
                  <li>• Accuracy matters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Question Sequence */}
          <div className="glass-card">
            <h2
              style={{
                color: "var(--dragon-gold)",
                marginBottom: "1rem",
                fontSize: "1.3rem",
              }}
            >
              📊 Question Sequence
            </h2>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Type</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Q1–Q2</td>
                  <td style={{ color: "var(--main-purple)" }}>MCQ</td>
                </tr>

                <tr>
                  <td>Q3–Q5</td>
                  <td style={{ color: "var(--fire-orange)" }}>Short</td>
                </tr>

                <tr>
                  <td>Q6–Q10</td>
                  <td style={{ color: "var(--main-purple)" }}>MCQ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            marginBottom: "1.5rem",
            padding: "1.2rem",
          }}
        >
          <h2
            style={{
              marginBottom: ".8rem",
              textAlign: "center",
              color: "var(--dragon-gold)",
              fontSize: "1.3rem",
            }}
          >
            📌 Participation Guidelines
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.8rem",
            }}
          >
            {guidelines.map((g, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.8rem",
                  padding: "0.9rem",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {g.icon}
                </div>

                <div>
                  <h3
                    style={{
                      marginBottom: ".2rem",
                      fontSize: ".95rem",
                      color: "var(--sky-mist)",
                    }}
                  >
                    {g.title}
                  </h3>

                  <p
                    style={{
                      fontSize: ".82rem",
                      lineHeight: 1.45,
                      color: "rgba(220,231,245,.65)",
                      margin: 0,
                    }}
                  >
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,185,66,0.1))' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <h2 style={{ color: 'var(--dragon-gold)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Winner&apos;s Prize</h2>
          <p style={{ color: 'rgba(220,231,245,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Exclusive gift box courtesy of our valued Gift Partner. Prize handed over after identity verification post-webinar.
          </p>
          <Link href="/quiz"><button className="btn-fire" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>🔥 Start Quiz Now</button></Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(220,231,245,0.4)' }}>
            Best of luck! Listen carefully, think quickly, and enjoy the quiz.
          </p>
        </div>
      </div>
    </>
  );
}
