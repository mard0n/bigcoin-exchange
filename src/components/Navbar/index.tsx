import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../state';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { isAuth, username } = useStore((state: any) => ({
    isAuth: state.isAuth,
    username: state.username,
  }));
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/trade">Trade</Link>
      {isAuth ? (
        <>
          {username}
          <button
            type="button"
            onClick={() => {
              useStore.setState({ isAuth: false, username: '' });
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </div>
  );
};

export default Navbar;
