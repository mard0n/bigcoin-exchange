/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  [resProps: string]: any;
}

const Button: FC<ButtonProps> = ({ children, ...resProps }) => {
  return (
    <button
      type="button"
      {...resProps}
      className="w-full h-16 rounded-md bg-blue-700 text-white font-semibold tracking-wider"
    >
      {children}
    </button>
  );
};

export default Button;
