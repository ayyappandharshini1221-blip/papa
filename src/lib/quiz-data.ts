export const allQuizzes = [
  {
    id: 'algebra-basics',
    title: 'Algebra Basics',
    subject: 'Math',
    difficulty: 'easy',
    questions: 3,
    status: 'new',
  },
  {
    id: 'cold-war',
    title: 'The Cold War',
    subject: 'History',
    difficulty: 'medium',
    questions: 15,
    status: 'new',
  },
  {
    id: 'cellular-biology',
    title: 'Cellular Biology',
    subject: 'Science',
    difficulty: 'hard',
    questions: 20,
    status: 'new',
  },
  {
    id: 'intro-to-python',
    title: 'Intro to Python',
    subject: 'Programming',
    difficulty: 'easy',
    questions: 12,
    status: 'in-progress',
  },
  {
    id: 'world-war-two',
    title: 'World War II',
    subject: 'History',
    difficulty: 'hard',
    questions: 25,
    status: 'completed',
  },
  {
    id: 'chemical-reactions',
    title: 'Chemical Reactions',
    subject: 'Science',
    difficulty: 'medium',
    questions: 18,
    status: 'new',
  },
];

export const quizQuestions: Record<string, any[]> = {
    'algebra-basics': [
        {
          question: 'What is the value of x in the equation 2x + 3 = 11?',
          answers: ['3', '4', '5', '8'],
          correctAnswerIndex: 1,
          explanation: 'Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.',
        },
        {
          question: 'Simplify the expression: 3(x + 4) - 2x',
          answers: ['x + 12', '5x + 4', 'x + 4', 'x - 12'],
          correctAnswerIndex: 0,
          explanation: 'Distribute the 3 to get 3x + 12 - 2x. Combine like terms (3x - 2x) to get x + 12.',
        },
        {
          question: 'What is the slope of the line y = -2x + 5?',
          answers: ['5', '2', '-2', '1/2'],
          correctAnswerIndex: 2,
          explanation: 'The equation is in slope-intercept form (y = mx + b), where m is the slope. So, the slope is -2.',
        },
    ],
    'cold-war': [
        {
            question: 'What was the main ideological conflict during the Cold War?',
            answers: ['Capitalism vs. Communism', 'Democracy vs. Monarchy', 'Socialism vs. Fascism', 'Nationalism vs. Globalism'],
            correctAnswerIndex: 0,
            explanation: 'The Cold War was primarily an ideological struggle between the United States-led Western Bloc (Capitalism) and the Soviet Union-led Eastern Bloc (Communism).'
        }
    ],
    'cellular-biology': [
        {
            question: 'What is the powerhouse of the cell?',
            answers: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
            correctAnswerIndex: 2,
            explanation: 'Mitochondria are responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.'
        }
    ]
    // Other quiz questions can be added here
}
