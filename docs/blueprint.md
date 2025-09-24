# **App Name**: EduSmart AI

## Core Features:

- User Authentication: Secure authentication using Firebase Auth with email/password and Google Sign-In. User roles (teacher/student) are stored in Firestore during signup.
- AI-Powered Quiz Generation: Teachers can create and assign AI-generated quizzes using Google Gemini. These quizzes can then be served to students, using role-based access controls to protect routes.
- Adaptive Quiz Difficulty: AI adapts quiz difficulty in real-time based on student performance. Difficulty adjustment tool helps ensure optimal challenge.
- Student Dashboard: Students can join classes, take assigned quizzes, view progress, and participate in gamified activities (leaderboards, challenges).
- Teacher Dashboard: Teachers can create/manage classes, invite students, assign quizzes, track progress, view analytics, and access an AI assistant for recommendations.
- Gamified Learning: Gamification features include XP points, badges, streak bonuses, leaderboards, and challenges to enhance student engagement. Teachers are provided controls for activating and configuring gamification within classes.
- Real-time Notifications: Firebase Cloud Messaging is used to send notifications for quiz reminders, new assignments, XP updates, and leaderboard changes. Includes a tool for teachers to draft custom messages to all students or individuals.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to evoke a sense of trust, intelligence, and modernity, aligning with the educational context.  
- Background color: Light, desaturated blue (#E5F6FD) provides a clean and calming backdrop that is easy on the eyes.
- Accent color: Orange (#FF8C00) will provide a cheerful contrast for key actions and elements.
- Body and headline font: 'PT Sans' (sans-serif) combines a modern look and warmth for readability and approachability.
- Use flat, modern icons to represent subjects, achievements, and navigation elements. Icons should be clear, intuitive, and visually engaging.
- Employ a clean, responsive layout using TailwindCSS grid system for optimal viewing on all devices. Content should be well-organized and easy to navigate.
- Use subtle animations and transitions to provide feedback, guide users, and enhance the overall user experience. Animations should be used sparingly to avoid distractions.