// src/components/Button.js
import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    // Base styles
    const baseStyles = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50';

    // Variant styles
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        // Add more variants as needed
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-md',
        lg: 'px-5 py-3 text-lg',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
        <button type={type} onClick={onClick} className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
