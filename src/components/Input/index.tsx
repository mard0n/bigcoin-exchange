import React, { FC, HTMLInputTypeAttribute, SyntheticEvent } from 'react';

interface InputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  id: string;
  value: any;
  handleChange: (e: SyntheticEvent) => void;
  customStyleClass?: string;
}

const Input: FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  id,
  value,
  handleChange,
  customStyleClass = '',
}) => {
  return (
    <div className="relative h-20 bg-white">
      <input
        className={`absolute w-full h-full px-4 pt-2 font-semibold tracking-wide border rounded-md overflow-hidden ${customStyleClass}`}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <label
        className="absolute text-gray-500 text-sm font-medium px-4 py-2"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
