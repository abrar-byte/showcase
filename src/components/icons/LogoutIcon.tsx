import React from 'react';
// fill color
export default function LogoutIcon({ className }: { className: string }) {
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
        d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
        // fill="#292D32"
        className={className}
      />
      <path
        d="M4.55994 11.25L6.62994 9.17997C6.77994 9.02997 6.84994 8.83997 6.84994 8.64997C6.84994 8.45997 6.77994 8.25997 6.62994 8.11997C6.33994 7.82997 5.85994 7.82997 5.56994 8.11997L2.21994 11.47C1.92994 11.76 1.92994 12.24 2.21994 12.53L5.56994 15.88C5.85994 16.17 6.33994 16.17 6.62994 15.88C6.91994 15.59 6.91994 15.11 6.62994 14.82L4.55994 12.75H8.99994V11.25H4.55994Z"
        // fill="#292D32"
        className={className}
      />
    </svg>
  );
}
