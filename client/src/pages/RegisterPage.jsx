import { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(evt) {
    evt.preventDefault();

    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Registration successful");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <form className="form form_register" onSubmit={handleRegister}>
      <h1 className="form__title">Register</h1>
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
      <button className="form__submit-btn">Sign up</button>
    </form>
  );
};

export default RegisterPage;
