import { createContext } from "react";
import { NotificationOptions } from "./notification-options.ts";

interface NotificationsContextValue {
  show: (notification: NotificationOptions) => void;
}

export const NotificationsContext = createContext<NotificationsContextValue>({
  show: () => {},
});
