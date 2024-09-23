import React from 'react';

// stroke for outline fill for color
export default function LikeIcon({ className }: { className: string }) {
  const outlined = className.includes('stroke');

  return outlined ? (
    <svg
      //   width="24"
      //   height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
        // stroke="#90A3BF"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      //   width="24"
      //   height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.44 3.09998C14.63 3.09998 13.01 3.97998 12 5.32998C10.99 3.97998 9.37 3.09998 7.56 3.09998C4.49 3.09998 2 5.59998 2 8.68998C2 9.87998 2.19 10.98 2.52 12C4.1 17 8.97 19.99 11.38 20.81C11.72 20.93 12.28 20.93 12.62 20.81C15.03 19.99 19.9 17 21.48 12C21.81 10.98 22 9.87998 22 8.68998C22 5.59998 19.51 3.09998 16.44 3.09998Z"
        // fill="#ED3F3F"
        className={className}
      />
    </svg>

    // <svg
    //   className={`${className} outline-none border-none ring-0`}
    //   viewBox="0 0 22 20"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <g clipPath="url(#clip0_1331_6349)">
    //     <mask
    //       className={`${className} outline-none border-none ring-0`}
    //       id="mask0_1331_6349"
    //       style={{ maskType: 'luminance' }}
    //       maskUnits="userSpaceOnUse"
    //       x="0"
    //       y="0"
    //     >
    //       <path
    //         d="M6.5 1C3.4625 1 1 3.4625 1 6.5C1 12 7.5 17 11 18.163C14.5 17 21 12 21 6.5C21 3.4625 18.5375 1 15.5 1C13.64 1 11.995 1.9235 11 3.337C10.4928 2.6146 9.81908 2.02505 9.03577 1.61824C8.25245 1.21144 7.38265 0.999377 6.5 1Z"
    //         stroke="white"
    //         strokeWidth="2"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //       />
    //     </mask>
    //     <g mask="url(#mask0_1331_6349)">
    //       <path d="M-1 -3H23V21H-1V-3Z" />
    //     </g>
    //   </g>
    //   <defs>
    //     <clipPath id="clip0_1331_6349">
    //       <rect className={`${className} outline-none border-none ring-0`} />
    //     </clipPath>
    //   </defs>
    // </svg>
  );
}
