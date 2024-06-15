import { createContext, useReducer, useContext, useMemo } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return {
        message: null,
        color: null,
      };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export function NotificationContextProvider({ children }) {
  const [notification, dispatch] = useReducer(reducer, {
    message: null,
    color: null,
  });
  const contextValue = useMemo(
    () => [notification, dispatch],
    [notification, dispatch],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext);
  return notification;
};

export const useNotify = () => {
  const valueAndDispatch = useContext(NotificationContext);
  const dispatch = valueAndDispatch[1];
  return (payload) => {
    dispatch({ type: "SET", payload });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

export default NotificationContext;
