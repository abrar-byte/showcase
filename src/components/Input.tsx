import React, { cloneElement } from 'react';

type Props = {
  float?: boolean;
  textarea?: boolean;
  title?: string;
  className?: string;
  inputClass?: string;
  iconClass?: string;
  labelClass?: string;
  icon?: any;
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Input(p: Props) {
  const {
    float,
    className = '',
    iconClass,
    labelClass = '',
    icon,
    label,
    textarea = false,
    error,
    ...props
  } = p;
  return float ? (
    <FloatInput {...p} />
  ) : (
    <div className={`${className} space-y-1 relative w-full`}>
      {!!label && (
        <label className={`text-gray-900 font-semibold ${labelClass}`}>
          {props.required ? <span className="mr-1 text-red-500">*</span> : null}
          {label}
        </label>
      )}
      <div className="relative">
        {!!icon &&
          cloneElement(icon, {
            className: `absolute top-0 bottom-0 my-auto left-2 w-5 h-5 ${iconClass}`,
          })}
        {textarea ? (
          <textarea
            className={`w-full bg-neutral-100 rounded-lg shadow  pr-2 py-2.5 text-gray-900 placeholder:text-slate-400 focus:outline-none
          disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-7' : 'pl-2'} ${props.inputClass}`}
            {...props}
          />
        ) : (
          <input
            className={`w-full bg-neutral-100 rounded-lg shadow  pr-2 py-2.5 text-gray-900 placeholder:text-slate-400 focus:outline-none
          disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-7' : 'pl-2'} ${props.inputClass}`}
            {...props}
          />
        )}
      </div>
      {error && <div className="text-red-500 text-xs pl-1">{error}</div>}
    </div>
  );
}

export function FloatInput({
  textarea,
  id,
  name,
  label,
  labelClass = '',
  inputClass = '',
  className = '',
  error,
  title,
  ...props
}: Props) {
  return (
    <div title={title || ''} className={className}>
      <div className={`relative flex flex-col items-start `}>
        <div
          className={` relative w-full flex rounded-md justify-center items-center`}
        >
          {textarea ? (
            <textarea
              id={id || name}
              name={name || id}
              placeholder={' '}
              className={`disabled:cursor-not-allowed disabled:opacity-50 resize w-full rounded-md 
            placeholder-white focus:placeholder-slate-400
            px-2.5 pb-1  pt-5 text-gray-800 appearance-none 
            focus:outline-none  border border-primary focus:border-2 peer
          
            ${inputClass}`}
              {...props}
            />
          ) : (
            <input
              id={id || name}
              name={name || id}
              className={`disabled:cursor-not-allowed disabled:opacity-50 px-4 !outline-none !outline-0 !ring-0 h-12 p-2 w-full placeholder-white focus:placeholder-slate-400 pt-4 text-gray-900 rounded-lg  appearance-none focus:outline-none focus:ring-0 border border-primary focus:border-2 peer
            ${inputClass}`}
              placeholder={' '}
              {...props}
            />
          )}

          <label
            htmlFor={id || name}
            className={`absolute  text-sm bg-white text-gray-400 peer-focus:text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${labelClass}`}
          >
            {props.required ? (
              <span className="mr-1 text-red-500">*</span>
            ) : null}{' '}
            {label}
          </label>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs pl-1">{error}</div>}
    </div>
  );
}
