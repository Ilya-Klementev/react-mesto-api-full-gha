import { useContext, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Header({loggedIn, onExitProfile}) {
 
  const { email } = useContext(CurrentUserContext);
  const [navActive, setNavActive] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!loggedIn) {
      setNavActive(false);
    }
  }, [loggedIn]);

  const toggleNavmenu = () => {
    setNavActive(!navActive);
  };

  const classHeaderAuthLogged = `header__auth ${loggedIn && "header__auth_logged"}`;

  const links = {
    "/signup": (<Link to="/signin" className="header__link">Войти</Link>),
    "/signin": (<Link to="/signup" className="header__link">Регистрация</Link>),
    "/": (
      <Link to="/signin" className="header__link header__link_signout" onClick={onExitProfile}>
        Выйти
      </Link>
    ),
  };

  return (
    <header className="header">
      <div className={`header__container ${loggedIn && "header__container_logged"}`}>
        <div className="header__default">
          <img className="header__logo" src={require('../images/logo.svg').default} alt="Логотип Место"/>
          {loggedIn && (
            <button
              className={`header__nav-menu ${navActive && "header__nav-menu_active"}`}
              onClick={toggleNavmenu}
            ></button>
          )}
        </div>
        <div className={`${classHeaderAuthLogged} ${navActive && "header__auth_logged_active"}`}>
          <p className="header__email">{email}</p>
          {links[path]}
        </div>
      </div>

     </header>
  )
}

export default Header
