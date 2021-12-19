import React from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { signOut } from "firebase/auth";

const Navbar = (props) => {
  let navigate = useNavigate();

  const logout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    })
  }

  return (
    <div className="navbar navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        React Admin
      </Link>
      <div>
        <div className="d-flex">
          <NavLink className="btn btn-dark mr-2" to="/">
            Home
          </NavLink>
          {
            props.firebaseUser !== null ? (
              <NavLink className="btn btn-dark mr-2" to="/admin">
                Admin
              </NavLink>
            ) : null
          }
          {
            props.firebaseUser !== null ? (
              <button onClick={() => logout()} className="btn btn-dark">Logout</button>
            ) : (
              <NavLink className="btn btn-dark" to="/login">
                Login
              </NavLink>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
