import React, { FC, SyntheticEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../state';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const nameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    useStore.setState({ isAuth: true, username: nameInput?.current?.value });
    navigate('/');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="name">Name:</label>
      <input ref={nameInput} type="text" name="name" id="name" />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        ref={passwordInput}
        type="password"
        name="password"
        id="password"
      />
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default Login;
