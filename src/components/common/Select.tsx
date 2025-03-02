interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ options, ...props }) => {
  return (
    <>
      <select
        {...props}
        className="px-2 py-1 bg-white border"
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          if (props.onChange) props.onChange?.(event);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-sm">
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
