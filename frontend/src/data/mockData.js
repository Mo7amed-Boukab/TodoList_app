export const mockTasks = [
    {
        id: '1',
        title: 'Dashboard Design',
        description: 'Finalize the analytics dashboard UI with updated charts, user insights, and responsive layout improvements.',
        status: 'todo',
        priority: 'high',
        daysRemaining: 4,
    },
    {
        id: '2',
        title: 'Landing Page Wireframes',
        description: 'Sketch low-fidelity wireframes for the homepage layout, including hero, testimonials, and CTA blocks.',
        status: 'todo',
        priority: 'medium',
        daysRemaining: 4,
    },
    {
        id: '3',
        title: 'Hero Section Animation Brief',
        description: 'Prepare animation concepts for hero illustrations and interactions for developer handoff.',
        status: 'todo',
        priority: 'low',
        daysRemaining: 4,
    },
    {
        id: '4',
        title: 'Dashboard Design',
        description: 'Finalize the analytics dashboard UI with updated charts, user insights, and responsive layout improvements.',
        status: 'in_progress',
        priority: 'low',
        daysRemaining: 4,
    },
    {
        id: '5',
        title: 'Landing Page',
        description: 'Create a responsive hero section with headline, subtext, CTA, and background illustration.',
        status: 'in_progress',
        priority: 'high',
        daysRemaining: 4,
    },
    {
        id: '6',
        title: 'Feedback Implementation',
        description: 'Incorporate user feedback from the latest survey, focusing on improving navigation and accessibility features.',
        status: 'done',
        priority: 'completed',
        completedDate: '10 Apr 2025',
    },
    {
        id: '7',
        title: 'UX Enhancements',
        description: 'Refine the user journey based on analytics data and user testing results for a seamless experience.',
        status: 'done',
        priority: 'completed',
        completedDate: '8 Apr 2025',
    }
];

export const columns = {
    todo: { title: 'To Do', count: 4 },
    in_progress: { title: 'In Progress', count: 6 },
    done: { title: 'Completed', count: 12 }
};
