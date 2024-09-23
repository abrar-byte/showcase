import React from 'react';

// stroke color
export default function ArrowBackIcon({ className }: { className: string }) {
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
        d="M9.57 5.93005L3.5 12.0001L9.57 18.0701"
        // stroke="#292D32"
        className={className}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.5 12H3.67004"
        // stroke="#292D32"
        className={className}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
