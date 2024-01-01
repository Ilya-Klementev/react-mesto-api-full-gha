import { useState } from "react";

function Login({ onSubmit }) {
  
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    onSubmit(e, formData);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          className="auth__input"
          placeholder="Email"
        ></input>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          className="auth__input"
          placeholder="Пароль"
        ></input>
        <button className="auth__submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;