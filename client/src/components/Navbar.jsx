import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";

function Navbar() {
  let navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  console.log(authState);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="write">
          <Link className="newpost" to="/createpost">
            Write
          </Link>
        </div>
        <div className="logo">
          <Link className="titlelogo" to="/">
            Bloggify
          </Link>
        </div>
        <div className="links">
          <span>
            <Link className="username" to={`/profile/${authState.id}`}>
              {authState.username}
            </Link>
          </span>
          <span onClick={logout}>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
