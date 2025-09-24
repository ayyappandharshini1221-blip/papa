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
    id: 'geometry-fundamentals',
    title: 'Geometry Fundamentals',
    subject: 'Math',
    difficulty: 'medium',
    questions: 3,
    status: 'new',
  },
  {
    id: 'cold-war',
    title: 'The Cold War',
    subject: 'History',
    difficulty: 'medium',
    questions: 3,
    status: 'new',
  },
  {
    id: 'world-war-two',
    title: 'World War II',
    subject: 'History',
    difficulty: 'hard',
    questions: 3,
    status: 'completed',
  },
  {
    id: 'cellular-biology',
    title: 'Cellular Biology',
    subject: 'Science',
    difficulty: 'hard',
    questions: 3,
    status: 'new',
  },
  {
    id: 'chemical-reactions',
    title: 'Chemical Reactions',
    subject: 'Science',
    difficulty: 'medium',
    questions: 3,
    status: 'new',
  },
  {
    id: 'intro-to-python',
    title: 'Intro to Python',
    subject: 'Programming',
    difficulty: 'easy',
    questions: 3,
    status: 'in-progress',
  },
  {
    id: 'javascript-basics',
    title: 'JavaScript Basics',
    subject: 'Programming',
    difficulty: 'easy',
    questions: 3,
    status: 'new',
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    subject: 'Programming',
    difficulty: 'hard',
    questions: 3,
    status: 'new',
  },
  {
    id: 'shakespearean-literature',
    title: 'Shakespearean Literature',
    subject: 'Literature',
    difficulty: 'medium',
    questions: 3,
    status: 'new',
  },
];

export const quizQuestions: Record<string, any[]> = {
  'algebra-basics': [
    {
      question: 'What is the value of x in the equation 2x + 3 = 11?',
      answers: ['3', '4', '5', '8'],
      correctAnswerIndex: 1,
      explanation:
        'Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.',
    },
    {
      question: 'Simplify the expression: 3(x + 4) - 2x',
      answers: ['x + 12', '5x + 4', 'x + 4', 'x - 12'],
      correctAnswerIndex: 0,
      explanation:
        'Distribute the 3 to get 3x + 12 - 2x. Combine like terms (3x - 2x) to get x + 12.',
    },
    {
      question: 'What is the slope of the line y = -2x + 5?',
      answers: ['5', '2', '-2', '1/2'],
      correctAnswerIndex: 2,
      explanation:
        'The equation is in slope-intercept form (y = mx + b), where m is the slope. So, the slope is -2.',
    },
  ],
  'geometry-fundamentals': [
    {
      question: 'What is the sum of angles in a triangle?',
      answers: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
      correctAnswerIndex: 1,
      explanation: 'The sum of the interior angles of any triangle is always 180 degrees.',
    },
    {
      question: 'What is the formula for the area of a circle?',
      answers: ['pi * r', '2 * pi * r', 'pi * r^2', '2 * pi * r^2'],
      correctAnswerIndex: 2,
      explanation: 'The area of a circle is calculated using the formula A = πr², where r is the radius.',
    },
    {
      question: 'A square has a side length of 5. What is its perimeter?',
      answers: ['10', '15', '20', '25'],
      correctAnswerIndex: 2,
      explanation: 'The perimeter of a square is 4 times the side length. So, 4 * 5 = 20.',
    },
  ],
  'cold-war': [
    {
      question: 'What was the main ideological conflict during the Cold War?',
      answers: [
        'Capitalism vs. Communism',
        'Democracy vs. Monarchy',
        'Socialism vs. Fascism',
        'Nationalism vs. Globalism',
      ],
      correctAnswerIndex: 0,
      explanation:
        'The Cold War was primarily an ideological struggle between the United States-led Western Bloc (Capitalism) and the Soviet Union-led Eastern Bloc (Communism).',
    },
    {
      question: 'Which of these events is considered the symbolic end of the Cold War?',
      answers: ['The Vietnam War', 'The Cuban Missile Crisis', 'The fall of the Berlin Wall', 'The Korean War'],
      correctAnswerIndex: 2,
      explanation: 'The fall of the Berlin Wall in 1989 is widely seen as the symbolic end of the Cold War, leading to the dissolution of the Soviet Union.',
    },
    {
      question: 'What was the "Iron Curtain"?',
      answers: ['A military defense system', 'A political boundary dividing Europe', 'A trade agreement', 'A type of submarine'],
      correctAnswerIndex: 1,
      explanation: 'The "Iron Curtain" was a term coined by Winston Churchill to describe the political, military, and ideological barrier erected by the Soviet Union after WWII to seal off itself and its dependent eastern and central European allies from open contact with the West.',
    },
  ],
   'world-war-two': [
    {
      question: 'In which year did World War II begin?',
      answers: ['1935', '1939', '1941', '1945'],
      correctAnswerIndex: 1,
      explanation: 'World War II began in 1939 when Germany invaded Poland, which led Great Britain and France to declare war.',
    },
    {
      question: 'The D-Day landings took place in which country?',
      answers: ['Germany', 'Italy', 'France', 'Belgium'],
      correctAnswerIndex: 2,
      explanation: 'The D-Day landings occurred on June 6, 1944, in Normandy, France, as part of the Allied invasion of Western Europe.',
    },
    {
      question: 'Which event directly led to the United States entering World War II?',
      answers: ['The invasion of Poland', 'The Battle of Britain', 'The attack on Pearl Harbor', 'The fall of France'],
      correctAnswerIndex: 2,
      explanation: 'The United States entered World War II after the Empire of Japan launched a surprise attack on the Pearl Harbor naval base on December 7, 1941.',
    },
  ],
  'cellular-biology': [
    {
      question: 'What is the powerhouse of the cell?',
      answers: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
      correctAnswerIndex: 2,
      explanation:
        "Mitochondria are responsible for generating most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
    },
    {
      question: 'Which organelle contains the cell\'s genetic material?',
      answers: ['Golgi Apparatus', 'Nucleus', 'Endoplasmic Reticulum', 'Lysosome'],
      correctAnswerIndex: 1,
      explanation: 'The nucleus is the large, membrane-bound organelle that contains the genetic material, in the form of multiple linear DNA molecules organized into structures called chromosomes.',
    },
    {
      question: 'What is the function of ribosomes?',
      answers: ['Energy production', 'Waste breakdown', 'Protein synthesis', 'Lipid production'],
      correctAnswerIndex: 2,
      explanation: 'Ribosomes are the cellular machinery responsible for making proteins by translating messenger RNA (mRNA).',
    },
  ],
  'chemical-reactions': [
    {
      question: 'What is a chemical reaction?',
      answers: ['A change of state', 'A process that leads to the chemical transformation of one set of chemical substances to another', 'A mixing of substances', 'A change in temperature'],
      correctAnswerIndex: 1,
      explanation: 'A chemical reaction is a process that involves rearrangement of the molecular or ionic structure of a substance, as opposed to a change in physical form or a nuclear reaction.',
    },
    {
      question: 'What does it mean for a reaction to be exothermic?',
      answers: ['It absorbs heat', 'It releases heat', 'It requires a catalyst', 'It produces light'],
      correctAnswerIndex: 1,
      explanation: 'An exothermic reaction is a chemical reaction that releases energy by light or heat. It is the opposite of an endothermic reaction.',
    },
    {
      question: 'What is a catalyst?',
      answers: ['A product of a reaction', 'A reactant in a reaction', 'A substance that is consumed in a reaction', 'A substance that increases the rate of a reaction without being consumed'],
      correctAnswerIndex: 3,
      explanation: 'A catalyst is a substance that speeds up a chemical reaction, but is not consumed by the reaction; hence a catalyst can be recovered chemically unchanged at the end of the reaction it has been used to speed up, or catalyze.',
    },
  ],
  'intro-to-python': [
    {
      question: 'What is the output of `print(2 ** 3)` in Python?',
      answers: ['6', '8', '9', '12'],
      correctAnswerIndex: 1,
      explanation:
        'The `**` operator in Python is used for exponentiation. `2 ** 3` means 2 to the power of 3, which is 8.',
    },
    {
      question:
        'Which of the following is used to define a function in Python?',
      answers: ['func', 'def', 'function', 'define'],
      correctAnswerIndex: 1,
      explanation: 'The `def` keyword is used to define a function in Python.',
    },
    {
      question: 'What data type is the result of `type("Hello, World!")`?',
      answers: ['String', 'str', 'Text', 'Character'],
      correctAnswerIndex: 1,
      explanation:
        'In Python, strings are of the type `str`. The `type()` function returns the type of an object.',
    },
  ],
  'javascript-basics': [
    {
      question: 'Which keyword is used to declare a variable that cannot be reassigned in JavaScript?',
      answers: ['var', 'let', 'const', 'static'],
      correctAnswerIndex: 2,
      explanation: '`const` is used to declare a block-scoped variable that cannot be reassigned. `let` is for re-assignable variables, and `var` is function-scoped.',
    },
    {
      question: 'What is the correct way to write a comment in JavaScript?',
      answers: ['// This is a comment', '<!-- This is a comment -->', '/* This is a comment */', 'Both // and /* */'],
      correctAnswerIndex: 3,
      explanation: 'JavaScript supports single-line comments starting with `//` and multi-line comments enclosed in `/* */`.',
    },
    {
      question: 'How do you call a function named "myFunction"?',
      answers: ['call myFunction()', 'myFunction', 'myFunction()', 'call function myFunction'],
      correctAnswerIndex: 2,
      explanation: 'You call a function in JavaScript by using its name followed by parentheses, like `myFunction()`.',
    },
  ],
  'data-structures': [
    {
      question: 'Which data structure uses a Last-In, First-Out (LIFO) approach?',
      answers: ['Queue', 'Stack', 'Linked List', 'Tree'],
      correctAnswerIndex: 1,
      explanation: 'A Stack is a linear data structure that follows a particular order in which the operations are performed. The order is LIFO(Last In First Out).',
    },
    {
      question: 'What is the time complexity of searching for an element in a balanced binary search tree?',
      answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswerIndex: 1,
      explanation: 'In a balanced binary search tree, the height is logarithmic with respect to the number of nodes (n), so search operations are O(log n).',
    },
    {
      question: 'Which data structure is ideal for implementing a FIFO (First-In, First-Out) queue?',
      answers: ['Stack', 'Array', 'Linked List', 'Graph'],
      correctAnswerIndex: 2,
      explanation: 'A Linked List is very efficient for implementing queues because adding to the tail (enqueue) and removing from the head (dequeue) are O(1) operations.',
    },
  ],
  'shakespearean-literature': [
      {
        question: 'Which of these is NOT a tragedy written by William Shakespeare?',
        answers: ['Hamlet', 'Othello', 'A Midsummer Night\'s Dream', 'King Lear'],
        correctAnswerIndex: 2,
        explanation: 'A Midsummer Night\'s Dream is one of Shakespeare\'s most popular comedies, whereas Hamlet, Othello, and King Lear are famous tragedies.',
      },
      {
        question: 'The line "To be, or not to be, that is the question" comes from which play?',
        answers: ['Macbeth', 'Romeo and Juliet', 'Hamlet', 'The Tempest'],
        correctAnswerIndex: 2,
        explanation: 'This famous soliloquy is spoken by Prince Hamlet in the play "Hamlet".',
      },
      {
        question: 'In which city is "Romeo and Juliet" primarily set?',
        answers: ['Venice', 'Rome', 'London', 'Verona'],
        correctAnswerIndex: 3,
        explanation: 'The story of the star-crossed lovers, Romeo and Juliet, is set in the city of Verona, Italy.',
      },
  ]
};
