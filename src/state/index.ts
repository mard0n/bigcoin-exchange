import create from 'zustand';

const useStore = create(() => ({
  isAuth: true,
  username: '',
}));

export default useStore;
