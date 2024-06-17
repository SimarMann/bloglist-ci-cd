import { createContext, useReducer, useContext, useMemo } from 'react';

import storageService from 'Utilities/services/storageService';
import loginService from 'Utilities/services/loginService';

const initialState = storageService.loadUser();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'LOGOUT_USER':
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, dispatch] = useReducer(reducer, initialState);

  const loginUser = async (username, password) => {
    const newUser = await loginService.login({ username, password });
    dispatch({ type: 'SET_USER', payload: newUser });
    storageService.saveUser(newUser);
  };

  const logoutUser = () => {
    dispatch({ type: 'LOGOUT_USER' });
    storageService.removeUser();
  };

  const contextValue = useMemo(() => ({ user, loginUser, logoutUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUserValue = () => {
  const { user } = useContext(UserContext);
  return user;
};

export const useLogin = () => {
  const { loginUser } = useContext(UserContext);
  return loginUser;
};

export const useLogout = () => {
  const { logoutUser } = useContext(UserContext);
  return logoutUser;
};

export default UserContext;
