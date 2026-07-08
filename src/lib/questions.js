export const quizQuestions = [
  {
    id: 1,
    type: 'mcq',
    question: 'Which stage of the Software Development Life Cycle (SDLC) is experiencing one of the biggest impacts from AI?',
    options: [
      'Deployment',
      'Planning and Product Management',
      'Testing',
      'Maintenance'
    ],
    correctAnswer: 'Planning and Product Management',
    category: 'Topic Overview'
  },
  {
    id: 2,
    type: 'mcq',
    question: 'In a real enterprise environment, AI coding tools mainly improve productivity by:',
    options: [
      'Replacing senior developers',
      'Eliminating code reviews',
      'Speeding up coding tasks while changing team workflows',
      'Removing the need for testing'
    ],
    correctAnswer: 'Speeding up coding tasks while changing team workflows',
    category: 'Topic Overview'
  },
  {
    id: 3,
    type: 'short',
    question: 'As AI becomes more common in software development, the role of a Software Engineer is shifting toward:',
    options: [
      'Writing only boilerplate code',
      'Becoming only a prompt engineer',
      'Higher-level problem solving and oversight of AI-generated output',
      'Eliminating collaboration with teams'
    ],
    correctAnswer: 'Higher-level problem solving and oversight of AI-generated output',
    category: 'Deeper Comprehension'
  },
  {
    id: 4,
    type: 'short',
    question: 'If AI generates code based on strict specifications, the role of Quality Assurance (QA) becomes:',
    options: [
      'Less important',
      'More critical because AI-generated code still needs verification',
      'Completely automated',
      'Replaced by AI tools'
    ],
    correctAnswer: 'More critical because AI-generated code still needs verification',
    category: 'Deeper Comprehension'
  },
  {
    id: 5,
    type: 'short',
    question: 'Which emerging skill should students focus on to remain competitive in an AI-driven future?',
    options: [
      'Memorizing programming syntax',
      'Developing adaptability and emerging skills alongside AI tools',
      'Learning only one programming language',
      'Depending entirely on AI tools'
    ],
    correctAnswer: 'Developing adaptability and emerging skills alongside AI tools',
    category: 'Deeper Comprehension'
  },
  {
    id: 6,
    type: 'mcq',
    question: 'Which AI-powered tool is commonly used to assist developers with coding?',
    options: [
      'Microsoft Word',
      'GitHub Copilot',
      'VLC Player',
      'Notepad'
    ],
    correctAnswer: 'GitHub Copilot',
    category: 'Key Takeaways'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'What is the best way for students to use AI in their learning?',
    options: [
      'Copy AI-generated answers directly',
      'Avoid AI completely',
      'Use AI to learn and verify understanding',
      'Submit AI output without reviewing it'
    ],
    correctAnswer: 'Use AI to learn and verify understanding',
    category: 'Key Takeaways'
  },
  {
    id: 8,
    type: 'short',
    question: 'What competency is considered more important than mastering a single technology in an AI-driven industry?',
    correctAnswer: 'Continuous learning',
    acceptableAnswers: ['continuous learning', 'continuous improvement', 'adaptability', 'lifelong learning'],
    category: 'Key Takeaways'
  },
  {
    id: 9,
    type: 'short',
    question: 'What should Software Engineers focus on instead of routine coding as AI becomes more capable?',
    correctAnswer: 'Problem-solving',
    acceptableAnswers: ['problem solving', 'problem-solving', 'critical thinking', 'higher-level problem solving'],
    category: 'Key Takeaways'
  },
  {
    id: 10,
    type: 'short',
    question: 'What mindset replaces the traditional "developer-first" mindset in AI-assisted software development?',
    correctAnswer: 'AI-assisted development',
    acceptableAnswers: ['ai-assisted development', 'ai assisted development', 'ai-first', 'ai assisted'],
    category: 'Key Takeaways'
  }
];

export function checkAnswer(questionId, userAnswer) {
  const question = quizQuestions.find(q => q.id === questionId);
  if (!question) return false;

  if (question.type === 'mcq' || (question.type === 'short' && question.options)) {
    return userAnswer === question.correctAnswer;
  }

  // For short answer questions without options
  if (question.acceptableAnswers) {
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    return question.acceptableAnswers.some(ans =>
      normalizedAnswer.includes(ans.toLowerCase())
    );
  }

  return userAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
}

// Return questions without answers for client
export function getClientQuestions() {
  return quizQuestions.map(q => {
    const { correctAnswer, acceptableAnswers, ...rest } = q;
    return rest;
  });
}
