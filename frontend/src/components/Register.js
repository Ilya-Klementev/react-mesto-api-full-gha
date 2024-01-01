import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    const navigatePath = () => navigate("/signin");
    onSubmit(e, formData, navigatePath);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
          <input
          name="email"
          type="email"
          className="auth__input"
          onChange={handleChange}
          placeholder="Email"
        ></input>
        <input
          name="password"
          type="password"
          className="auth__input"
          onChange={handleChange}
          placeholder="Пароль"
        ></input>
        <button className="auth__submit">Зарегистрироваться</button>
      </form>
      <Link to="/signin" className="auth__link">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}

export default Register;