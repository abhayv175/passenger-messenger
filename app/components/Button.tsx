'use client';

import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        cursor-pointer
      `,
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        fullWidth && 'w-full',
        danger &&
          'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/40 focus-visible:outline-rose-500 active:scale-[0.98]',
        secondary &&
          'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 hover:border-slate-600 focus-visible:outline-slate-500 active:scale-[0.98]',
        !secondary &&
          !danger &&
          'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-950/50 focus-visible:outline-indigo-500 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
