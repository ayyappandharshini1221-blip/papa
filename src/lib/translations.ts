
type Translations = {
  [key: string]: string;
};

const en: Translations = {
  // Student Layout
  dashboard: 'Dashboard',
  myQuizzes: 'My Quizzes',
  myProgress: 'My Progress',
  badges: 'Badges',
  leaderboard: 'Leaderboard',
  aiChat: 'AI Chat',
  settings: 'Settings',

  // Student Dashboard
  studentDashboardTitle: "Let's Go, {name}!",
  studentDashboardSubtitle: 'Time to crush some quizzes and climb the ranks.',
  level: 'Level',
  explorer: 'Explorer',
  xpToNextLevel: 'XP to next level',
  streak: 'Streak',
  days: 'days',
  keepTheFireBurning: 'Keep the fire burning!',
  newBadge: 'New: "{badgeName}"',
  leaderboardRank: 'Leaderboard Rank',
  inClass: 'In {className}',
  noClassJoined: 'No class joined',
  myClasses: 'My Classes',
  joinAClass: 'Join a Class',
  viewQuizzes: 'View Quizzes',
  noClassesYet: 'No classes yet!',
  clickJoinAClass: 'Click "Join a Class" to get started.',
  yourDailyQuest: 'Your Daily Quest',
  dailyQuestDescription: 'AI-suggested topics to help you improve and earn bonus XP.',
  focusArea: 'Focus Area: {subject}',
  focusAreaDescription: 'Master "{topic}" to earn a treasure chest of XP!',
  startQuest: 'Start Quest',
  classLeaderboard: 'Class Leaderboard',
  topPerformers: '{className} - Top Performers',
  joinClassToSeeLeaderboard: 'Join a class to see the leaderboard',
  you: ' (You)',
  loadingClasses: 'Loading classes...',
  loadingLeaderboard: 'Loading leaderboard...',
  joinClassDialogTitle: 'Join a new class',
  joinClassDialogDescription: 'Enter the invite code or the exact class name from your teacher to join.',
  codeOrName: 'Code or Name',
  joinClassDialogPlaceholder: 'e.g., ALG101-XYZ or Algebra 101',
  joinClass: 'Join Class',
  joining: 'Joining...',

  // Quizzes Page
  startNewQuiz: 'Start a New Quiz',
  selectSubjectChallenge: 'Select a subject to begin your challenge.',
  selectProgrammingLanguage: 'Select a Programming Language',
  whichLanguageQuiz: 'Choose which language you want to be quizzed on.',
  backToSubjects: 'Back to subjects',
  selectLanguage: 'Select a Language',

  // Quiz Start Dialog
  chooseChallengeLevel: 'Choose your challenge level. Higher difficulty means more XP!',
  easy: 'Easy',
  normal: 'Normal',
  hard: 'Hard',
  recommendedSolid: 'Recommended for a solid challenge.',

  // Take Quiz Page
  generatingQuiz: 'Generating your {subject} quiz...',
  quizGenerationError: 'The AI failed to generate a quiz for this topic. Please try a different one.',
  quizGenerationBusy: 'The AI is a bit busy right now due to high traffic. Please wait a moment and try again.',
  failedToGenerateQuiz: 'Failed to generate the quiz. Please try again.',
  oopsError: 'Oops! Something went wrong.',
  tryAgain: 'Try Again',
  couldNotLoadQuiz: 'Could not load quiz content.',
  quizTitle: '{subject} Quiz',
  questionProgress: 'Question {current} of {total}',
  back: 'Back',
  next: 'Next',
  submitQuiz: 'Submit Quiz',
  excellentWork: 'Excellent Work!',
  quizResults: 'Quiz Results: {subject}',
  youScored: 'You scored {score}%!',
  yourAnswer: 'Your answer: {answer}',
  notAnswered: 'Not answered',
  correctAnswer: 'Correct answer: {answer}',
  takeAnotherQuiz: 'Take Another Quiz',
  xpGained: '+{totalXpGained} XP Gained!',
  scoreAndStreak: 'You scored {score}% and your streak is now {streak} days!',
  badgeUnlocked: 'Badge Unlocked: {badgeTitle}!',
  badgeXp: '+{xp} for this achievement!',

  // AI Chat
  aiTutor: 'AI Tutor',
  aiTutorDescription: 'Your personal AI tutor. Ask me anything!',
  aiTutorWelcome: 'Hello! I am your personal AI tutor. You can ask me for explanations on complex topics, help with homework, or quiz preparation tips. How can I help you learn today?',
  typeYourMessage: 'Type your message...',
  
  // Badges Page
  badgesCollection: 'Badges Collection',
  badgesDescription: 'Celebrate your achievements and unlock new ones!',
  yourProgress: 'Your Progress',
  unlocked: 'Unlocked',
  earnedBadges: 'Earned Badges',
  lockedBadges: 'Locked Badges',
  complete: 'Complete',
  loading: 'Loading...',

  // Leaderboard Page
  overallRankings: 'Overall Rankings',
  topStudentsAllTime: 'Top students based on all-time XP.',
  rank: 'Rank',
  student: 'Student',
  dayStreak: '{streak} day streak',
  
  // Progress Page
  myProgressTitle: 'My Progress',
  myProgressDescription: 'Track your learning journey and achievements.',
  totalXP: 'Total XP',
  levelLabel: 'Level {level}',
  currentStreak: 'Current Streak',
  badgesUnlocked: 'Badges Unlocked',
  almostThere: 'Almost there!',
  topPercentile: 'Top {percent}% in your class',
  subjectProgress: 'Subject Progress',
  subjectProgressDescription: 'Your performance across different subjects and difficulties.',
  quizzes: 'quizzes',
  quiz: 'quiz',
  avg: 'avg',
  noQuizHistory: 'No quiz history yet. Take a quiz to see your progress!',
  badgesCollectionTitle: 'Badges Collection',
  badgesCollectionDescription: 'Celebrate your achievements and unlock new ones.',
  aiRecommendations: 'AI Recommendations',
  unlockBadge: 'Unlock "{badgeName}"',
  unlockBadgeDescription: 'You\'ve completed {completed} quizzes. Complete {remaining} more to unlock this badge!',
  startAQuiz: 'Start a Quiz',
  remediation: 'Remediation: {subject}',
  remediationDescription: 'Your score in {difficulty} {subject} quizzes is a bit low. Try a remediation quiz to strengthen your skills.',
  startRemediation: 'Start Remediation',
  recentActivity: 'Recent Activity',

  // Settings Page
  settingsTitle: 'Settings',
  settingsDescription: 'Manage your account settings and profile.',
  profile: 'Profile',
  profileDescription: 'Update your personal information here.',
  name: 'Name',
  email: 'Email',
  saveChanges: 'Save Changes',
  saving: 'Saving...',
  success: 'Success',
  profileUpdated: 'Your profile has been updated.',
  error: 'Error',
  studentNotFound: 'Student data not found.',
  nameNotEmpty: 'Name cannot be empty.',
};

const translations: { [key: string]: Translations } = {
  en,
};

export const getTranslation = (lang: string, key: string): string => {
  return translations[lang]?.[key] || key;
};
