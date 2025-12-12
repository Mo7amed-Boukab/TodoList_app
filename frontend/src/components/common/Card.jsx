
const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded border border-slate-100 p-4 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
