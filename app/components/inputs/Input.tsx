'use client';

import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  required,
  register,
  errors,
  disabled,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-300 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, { required })}
          className={clsx(
            `
            form-input
            block
            w-full
            rounded-xl
            bg-slate-900/90
            border
            border-slate-800
            py-2.5
            px-3.5
            text-slate-100
            placeholder:text-slate-500
            text-sm
            shadow-inner
            transition-all
            duration-200
            focus:outline-none
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-500/20
          `,
            errors[id] && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
    </div>
  );
};

export default Input;
