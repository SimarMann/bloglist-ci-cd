/* eslint-disable no-param-reassign */
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useNotify } from "Utilities/contexts/NotificationContext";
import { useLogin } from "Utilities/contexts/UserContext";

function Login() {
  const loginUser = useLogin();
  const notifyWith = useNotify();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.target.username.value = "";
    event.target.password.value = "";
    try {
      await loginUser(username, password);
      notifyWith({
        message: `welcome!`,
        color: "success",
      });
      navigate("/");
    } catch (error) {
      notifyWith({
        message: `wrong username or password`,
        color: "error",
      });
    }
  };

  const spacing = {
    marginBottom: 2,
    padding: 5,
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div style={spacing}>
          <TextField
            label="username"
            name="username"
            type="text"
            id="username"
          />
        </div>
        <div style={spacing}>
          <TextField
            label="password"
            name="password"
            type="password"
            id="password"
            autoComplete="off"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="login-button"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  );
}

export default Login;
