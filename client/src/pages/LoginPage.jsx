import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function handleLogin(evt) {
    evt.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="form form_login" onSubmit={handleLogin}>
      <h1 className="form__title">Login</h1>
      <input
        className="form__input"
        type="text"
        placeholder="username"
        value={username}
        onChange={(evt) => setUsername(evt.target.value)}
      />
      <input
        className="form__input"
        type="password"
        placeholder="password"
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
      />
      <button className="form__submit-btn">Sign in</button>
    </form>
  );
};

export default LoginPage;
