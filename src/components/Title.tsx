import React, { ReactNode } from 'react';

export function Title({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={`font-bold text-xl lg:text-2xl ${className}`}>{children}</h1>
  );
}
