'use client';
import React, { ChangeEventHandler } from 'react';

const Checkbox = ({
  label,
  name,
  onChange,
  checked,
  className,
  markClass,
  labelClass,
  info,
  ...props
}: any) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.checked;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center gap-2 relative w-full ${className}`}>
      <input
        {...props}
        checked={checked}
        onChange={handleChange}
        name={name}
        type="checkbox"
        id={name}
        className="
  peer
  appearance-none !w-6 !h-6 border border-secondary rounded-md bg-transparent
  checked:bg-primary checked:border-0
  relative z-10 cursor-pointer"
      />
      <label
        htmlFor={name}
        className={`cursor-pointer text-slate-500 text-lg font-semibold  ${labelClass}`}
      >
        {label}
        {info && <span className="ml-1 text-secondary">({info})</span>}
      </label>
      <svg
        className={`
  absolute
  w-4 h-4
  hidden peer-checked:block
  top-2 left-1
  pointer-events-none z-10 ${markClass}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
};

export default Checkbox;
