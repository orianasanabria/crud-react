import React from 'react'
import { auth } from "../config/firebase"
import { sendPasswordResetEmail } from "firebase/auth";

const Reset = () => {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState(null)

  const getData = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("You must write an email")
      return
    }
    setError(null)
  }

	const reset = React.useCallback( async() => {
		try {
			await sendPasswordResetEmail(auth, email)
			console.log("correo enviado");
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
	}, [])

	return (
		<div>
    <div className="mt-5">
      <h3 className="text-center">Reset Password</h3>
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
            <button className="btn btn-lg btn-dark btn-block" type="submit" onClick={() => reset()}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
		</div>
	)
}

export default Reset
