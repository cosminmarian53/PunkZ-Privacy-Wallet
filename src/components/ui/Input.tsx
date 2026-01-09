import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightContent,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-slate-400 text-sm mb-2">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 bg-slate-900/80 border rounded-xl text-white 
            placeholder-slate-500 focus:outline-none transition-colors
            ${leftIcon ? 'pl-10' : ''}
            ${rightContent ? 'pr-20' : ''}
            ${error ? 'border-rose-500' : 'border-slate-700 focus:border-fuchsia-500'}
            ${className}
          `}
          {...props}
        />
        {rightContent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightContent}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
