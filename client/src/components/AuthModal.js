import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const validateEmailFormat = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePasswordStrength = (password) => {
    // Add your password strength criteria here, e.g., minimum length, uppercase, lowercase, special characters, etc.
    return password && password.length >= 8; // For example, at least 8 characters
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!validateEmailFormat(email)) {
        setError('Invalid email format. Please enter a valid email.');
        return;
      }

      if (!validatePasswordStrength(password)) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      if (isSignUp && password !== confirmPassword) {
        setError('Passwords need to match!');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/${isSignUp ? 'signup' : 'login'}`, { email, password });

      setCookie('AuthToken', response.data.token);
      setCookie('UserId', response.data.userId);

      const success = response.status === 201;
      if (success && isSignUp) navigate('/OnBoarding');
      if (success && !isSignUp) navigate('/Dashboard');

      window.location.reload();

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please log in');
      } else {
        console.log(error);
      }
    }
  };

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>x</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT': 'LOG IN'}</h2>
            <p>By logging in, you acknowledge that you have read and agree to our Terms of Service. For more information on how we handle your data, please refer to our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <h1>Email</h1>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <h1>password</h1>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit" value={isSignUp ? 'SIGN UP': 'LOG IN'}/>
                <p>{error}</p>
            </form>

            <hr/>
            
            <h2>WELCOME</h2>

        </div>
    )
}
export default AuthModal