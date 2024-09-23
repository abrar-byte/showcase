import React, { cloneElement, useState } from 'react';

type DashboardItem = {
  icon: React.ReactElement;
  classNameIcon: string;
  title: string;
  total: number;
  type: string;
  selectProps: [string, React.Dispatch<React.SetStateAction<string>>];
};

export default function CardDashboard(props: DashboardItem) {
  const { icon, classNameIcon, title, total, type } = props;
  const [select, setSelect] = props?.selectProps;
  const active = type == select;
  return (
    <button
      onClick={() => setSelect(type)}
      // href={`/dashboard/${type}`}
      className={`rounded-lg p-5 flex gap-10 items-center  shadow ${active ? 'bg-primary hover:bg-blue-800' : 'bg-white hover:bg-secondary/50'}`}
    >
      {cloneElement(icon, {
        className: `'w-10 h-10 ${active ? 'fill-white' : 'fill-secondary'} ${classNameIcon}`,
      })}
      <div className={`grid ${active ? 'text-white' : 'text-gray-900'}`}>
        <h2 className={`font-semibold text-xl  `}>{title}</h2>
        <p className="font-medium text-lg ">{total} </p>
      </div>
    </button>
  );
}
