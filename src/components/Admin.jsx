import React from 'react'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom';
import Firestore from '../components/Firestore';

const Admin = () => {
  let navigate = useNavigate();
	const [user, setUser] = React.useState(null)

	React.useEffect(() => {
		const user = auth.currentUser;
		if (user) {
			setUser(user)
		} else {
      navigate('/login');
		}
	}, [navigate])

	return (
		<div>
			<h1>Protected Route</h1>
			{
				user && (
					<div>
						<Firestore user={user} />
					</div>
				)
			}
		</div>
	)
}

export default Admin
