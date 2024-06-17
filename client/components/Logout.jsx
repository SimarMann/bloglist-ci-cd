import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNotify } from 'Utilities/contexts/NotificationContext';
import { useUserValue, useLogout } from 'Utilities/contexts/UserContext';

function Logout() {
  const user = useUserValue();
  const logoutUser = useLogout();
  const notifyWith = useNotify();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logoutUser();
    notifyWith({
      message: `logged out!`,
      color: 'success',
    });
    navigate('/login');
  };

  return (
    <>
      {user.name} logged in
      <Button
        variant="text"
        color="inherit"
        type="button"
        onClick={handleLogout}
      >
        logout
      </Button>
    </>
  );
}

export default Logout;
