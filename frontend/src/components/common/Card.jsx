
const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded border border-slate-100 p-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
