/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../icons';
import { InputProps } from '@/types';

const Input = ({
  label = '',
  id,
  value,
  onChange,
  className = '',
  labelClassName = '',
  containerClassName = '',
  bottomText = '',
  bottomClassName = '',
  type = 'text',
  as = 'input',
  rows = 4,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPasswordType = type === 'password' && as === 'input';
  const inputType = isPasswordType && showPassword ? 'text' : type;
  const hasValue = Boolean(value && value.toString().length > 0);
  const isFloating = focused || hasValue;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`w-full flex flex-col text-sm ${containerClassName}`}>
      <div className="relative">
        {as === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange as any}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={rows}
            className={`peer w-full bg-transparent border border-border rounded-lg px-3 py-4 text-appBlack placeholder:text-border focus:outline-none focus:ring-2 focus:ring-primary resize-vertical ${className}`}
            {...(props as any)}
          />
        ) : (
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange as any}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`peer w-full bg-transparent border border-border rounded-lg px-3 py-4 text-appBlack placeholder:text-border focus:outline-none focus:ring-2 focus:ring-primary ${isPasswordType ? 'pr-10' : ''} ${className}`}
            {...props}
          />
        )}

        {label && (
          <label
            htmlFor={id}
            className={`absolute left-3 transition-all duration-300 ease-in-out pointer-events-none ${labelClassName} ${
              isFloating
                ? '-top-2 text-xs bg-white px-1 text-border'
                : 'top-4 text-sm text-border'
            }`}
          >
            {label}
          </label>
        )}

        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3.5 top-4.5 text-gray300 hover:text-border cursor-pointer focus:outline-none focus:text-border transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOffIcon size={18} />
            ) : (
              <EyeIcon size={18} />
            )}
          </button>
        )}
      </div>

      {bottomText && (
        <label htmlFor={id} className={`block text-xs md:text-sm text-appBlack mt-4 ${bottomClassName}`}>
          {bottomText}
        </label>
      )}
    </div>
  );
};

export default Input; 