import "./intro.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const Intro = ({ onLogin }) => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				onLogin();
				navigate("/monitoring");
			}
		});
		return () => {
			unsubscribe();
		};
	}, [navigate, onLogin]);

	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle();
			onLogin();
			navigate("/monitoring");
		} catch (error) {
			console.error("Google Sign In Error:", error);
		}
	};

	return (
		<div className="landing-page">
			<div className="signin">
				<button onClick={handleGoogleSignIn} className="google-sign-in-btn">
					Sign in with Google
				</button>
			</div>
		</div>
	);
};

export default Intro;
