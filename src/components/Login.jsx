import React from "react"
import { auth, db } from "../config/firebase"
import { doc, setDoc, addDoc, collection } from "firebase/firestore"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  let navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [pass, setPass] = React.useState("")
  const [error, setError] = React.useState(null)

  const [signUpOn, setSignUpOn] = React.useState(true)

  const getData = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("You must write an email")
      return
    }
    if (!pass.trim()) {
      setError("You must write an password")
      return
    }
    if (pass.length < 6) {
      setError("Your password must have 6 characters or more")
      return
    }
    setError(null)

    if (signUpOn) {
      signUp()
    } else {
      login()
    }
  }

  const signUp = React.useCallback(async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass)
      console.log("SignUp succesful!", res.user)
      await setDoc(doc(db, "users", res.user.email), {
        email: res.user.email,
        uid: res.user.uid,
      })
      await addDoc(collection(db, res.user.email), {
        name: res.user.email,
        date: Date.now(),
      })
      console.log(res.user)
      setEmail("")
      setPass("")
      setError(null)
      navigate("/admin")
    } catch (error) {
      setError(error.message)
    }
  }, [email, pass, navigate])

  const login = React.useCallback(async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass)
      console.log("login succesful!", res.user)
      setEmail("")
      setPass("")
      setError(null)
      navigate("/admin")
    } catch (error) {
      setError(error.message)
      console.log(error)
    }
  }, [email, pass, navigate])

  return (
    <div className="mt-5">
      <h3 className="text-center">{signUpOn ? "Sign Up" : "Log In"}</h3>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={getData}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter Password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            />
            <button className="btn btn-lg btn-dark btn-block" type="submit">
              {signUpOn ? "Sign Up" : "Log In"}
            </button>
            <button
              className="btn btn-sm btn-info btn-block"
              type="button"
              onClick={() => setSignUpOn(!signUpOn)}
            >
              {signUpOn ? "Already signed up?" : "Create an account"}
            </button>

            {!signUpOn ? (
              <button
                className="btn btn-sm mt-2 btn-outline-danger"
                type="button"
                onClick={() => navigate("/reset")}
              >
                I forgot my password
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
