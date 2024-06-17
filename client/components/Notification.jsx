import { Alert } from '@mui/material';
import { useNotificationValue } from 'Utilities/contexts/NotificationContext';

function Notification() {
  const notification = useNotificationValue();

  return (
    <div>
      {notification.message && (
        <Alert severity={notification.color}>{notification.message}</Alert>
      )}
    </div>
  );
}

export default Notification;
