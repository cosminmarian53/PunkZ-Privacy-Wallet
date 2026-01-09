import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-zinc-900',
    elevated: 'bg-zinc-900 shadow-lg',
    outlined: 'bg-transparent border border-zinc-800',
  };

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${onClick ? 'cursor-pointer hover:bg-zinc-800 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
