// contexts/NotificationContext.tsx
import { createContext, useContext, useState } from "react";
import { type AlertColor } from "@mui/material";

type NotificationContextType = {
  notification: {
    message: string;
    type: AlertColor;
  } | null;
  showNotification: (message: string, type: AlertColor) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] =
    useState<NotificationContextType["notification"]>(null);

  const showNotification = (message: string, type: AlertColor) => {
    setNotification({ message, type });
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
