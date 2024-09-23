type Props = { label?: string } & React.InputHTMLAttributes<HTMLInputElement>;

const Toggle = ({ label, ...props }: Props) => {
  return (
    <div className="flex flex-row items-center gap-5">
      {label && <div className="text-gray-400 text-sm">{label} </div>}
      <label
        className={`inline-flex items-center w-min ${
          props.disabled ? 'cursor-not-allowed	' : 'cursor-pointer'
        }`}
      >
        <input type="checkbox" {...props} value="" className="sr-only peer" />
        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
};

export default Toggle;
