
const variants = {
    high: 'bg-white text-red-700 ',
    medium: 'bg-white text-orange-700 ',
    low: 'bg-white text-gray-700 ',
    completed: 'bg-white text-green-700 ',
};

const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Less',
    completed: 'Completed'
}

const Badge = ({ variant = 'low' }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${variants[variant] || variants.low}`}>
            {labels[variant]}
        </span>
    );
};

export default Badge;
