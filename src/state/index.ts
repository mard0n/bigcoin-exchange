import create from 'zustand';

const useStore = create(() => ({
  isAuth: false,
  username: '',
}));

export default useStore;
