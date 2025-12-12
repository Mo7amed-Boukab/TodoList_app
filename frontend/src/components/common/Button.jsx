
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-950 hover:cursor-pointer",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:cursor-pointer",
        ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:cursor-pointer",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
