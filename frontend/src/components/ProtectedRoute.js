import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ Component, loggedIn, ...props }) => {
  return (
    <>{loggedIn ? <Component {...props} /> : <Navigate to="/signin" />}</>
  );
};

export default ProtectedRoute;