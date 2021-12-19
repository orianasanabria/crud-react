import React from "react"
import { auth } from "./config/firebase.js"
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Login from "./components/Login.jsx"
import Admin from "./components/Admin.jsx"
import Home from "./components/Home.jsx"
import Reset from "./components/Reset.jsx"

function App() {

  const [firebaseUser, setFirebaseUser] = React.useState(false)

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user)
      } else {
        setFirebaseUser(null)
      }
    });
  }, [])

  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser} />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </div>
    </Router>
  ) : ( 
    <div className="container">
      <h1 className="text-center">Cargando...</h1> 
    </div>
  )
}

export default App
