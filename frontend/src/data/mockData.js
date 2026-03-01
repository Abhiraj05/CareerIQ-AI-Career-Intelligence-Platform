export const SKILLS_DATA = [
    { name: 'JavaScript / React', pct: 85, color: '#7c6dfa' },
    { name: 'System Design', pct: 62, color: '#38e2c7' },
    { name: 'Data Structures', pct: 78, color: '#f97aad' },
    { name: 'Problem Solving', pct: 91, color: '#fbbf24' },
]

export const RECENT_ACTIVITY = [
    { action: 'Completed "Mock Interview: Frontend Senior" with 88% score.', time: '2 hours ago' },
    { action: 'Updated Resume: Added new project "CareerIQ AI Platform".', time: 'Yesterday' },
    { action: 'Achieved 5-day streak in Aptitude Practice.', time: '2 days ago' },
    { action: 'Roadmap updated: Software Engineer phase 4 unlocked.', time: '3 days ago' },
]

export const APTITUDE_HISTORY = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 78 },
    { month: 'May', score: 82 },
]

export const ACTIVITY_LOG = [
    { activity: 'Senior Frontend Mock Interview', category: 'Interview', score: '88%', date: 'Feb 24, 2025', status: 'Completed' },
    { activity: 'Data Structures Quiz', category: 'Aptitude', score: '92%', date: 'Feb 22, 2025', status: 'Completed' },
    { activity: 'Resume Analysis', category: 'Resume', score: '74%', date: 'Feb 21, 2025', status: 'Done' },
    { activity: 'System Design Roadmap', category: 'Roadmap', score: 'Ph 4/12', date: 'Feb 20, 2025', status: 'In Progress' },
]

export const CAREER_ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
]

export const ROADMAPS = {
    'Frontend Developer': [
        {
            phase: 'Level 1: Fundamentals',
            modules: ['HTML5 Semantic Structure', 'CSS3 Flexbox & Grid', 'JavaScript ES6+ Basics'],
        },
        {
            phase: 'Level 2: Frameworks',
            modules: ['React Component Lifecycle', 'State Management (Redux/Context)', 'Hooks & Performance'],
        },
    ],
}

export const INTERVIEW_QUESTIONS = [
    {
        level: 'Medium',
        category: 'React',
        q: 'Explain the difference between useMemo and useCallback.',
        ans: 'useMemo returns a memoized value, while useCallback returns a memoized function. Both help in performance optimization by preventing unnecessary re-calculations or re-renders.',
    },
    {
        level: 'Hard',
        category: 'System Design',
        q: 'How would you architect a real-time notification system?',
        ans: 'Using WebSockets or Server-Sent Events (SSE) for real-time communication, a message queue (like RabbitMQ) for scaling, and a NoSQL database for fast persistence.',
    },
]

export const APTITUDE_QUESTIONS = {
    Quant: [
        { q: 'What is 15% of 200?', opts: ['20', '30', '40', '50'], ans: 1 },
        { q: 'Solve: 12 * 11', opts: ['121', '132', '142', '152'], ans: 1 },
    ],
    Logical: [
        { q: 'Complete the pattern: 2, 4, 8, 16, ?', opts: ['24', '30', '32', '64'], ans: 2 },
    ],
    Verbal: [
        { q: 'Synonym of "Swift"', opts: ['Slow', 'Fast', 'Huge', 'Tiny'], ans: 1 },
    ],
}
