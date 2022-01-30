import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  console.log('test');
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/trade">Trade</Link>
    </div>
  );
};

export default Navbar;
