import React, { BaseSyntheticEvent, FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../../state';
import Button from '../Button';
import Input from '../Input';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const { state: locationState }: any = useLocation();
  const [nameInputValue, setNameInputValue] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const navigate = useNavigate();

  const handleNameInputChange = (e: BaseSyntheticEvent) => {
    setNameInputValue(e.target.value);
  };
  const handlePasswordInputChange = (e: BaseSyntheticEvent) => {
    setPasswordInputValue(e.target.value);
  };

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    useStore.setState({ isAuth: true, username: nameInputValue });
    const lastLocation = locationState?.lastLocation;
    navigate(lastLocation || '/');
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full max-w-md p-8 bg-white grid gap-4 m-5 mx-auto -m-1/2"
    >
      <legend className="text-2xl font-bold text-gray-700 mb-2">Login</legend>
      <Input
        label="Name"
        id="name"
        type="text"
        placeholder="Please enter your name..."
        value={nameInputValue}
        handleChange={handleNameInputChange}
      />
      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Please enter your password..."
        value={passwordInputValue}
        handleChange={handlePasswordInputChange}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default Login;
