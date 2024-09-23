import React from 'react';

// class stroke colour
export default function Chevrondown({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={className}
        d="M1 1L7 7L13 1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
