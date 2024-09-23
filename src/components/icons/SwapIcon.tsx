import React from 'react';
// stroke color
export default function SwapIcon({ className }: { className: string }) {
  return (
    <svg
      //   width="24"
      //   height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.16051 3.83577L7.16051 17.4536"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.08273 7.93188L7.1605 3.83522L11.2383 7.93188"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0887 20.1671L17.0887 6.54934"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.1665 16.071L17.0887 20.1677L13.0109 16.071"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
