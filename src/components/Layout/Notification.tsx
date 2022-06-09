import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (type: NotificationType, customMessage: string) => {
    notification[type]({
        message: customMessage,
        onClick: () => {
            console.log('Notification Clicked!');
        }
    })
}
