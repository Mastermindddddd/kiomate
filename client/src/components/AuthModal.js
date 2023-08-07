import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken', 'UserId']); // Provide cookie names

  const navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const validateEmailFormat = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePasswordStrength = (password) => {
    // Add your password strength criteria here
    return password && password.length >= 8;
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

      const response = await axios.post(
        `https://dark-ruby-mackerel-gown.cyclic.app/${
          isSignUp ? 'signup' : 'login'
        }`,
        { email, password }
      );

  setCookie('AuthToken', response.data.token, {
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: true,
    sameSite: 'strict',
  });

  setCookie('UserId', response.data.userId, {
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: true,
    sameSite: 'None',
  });

      if (isSignUp) {
        navigate('/OnBoarding');
      } else {
        navigate('/Dashboard');
      }

      // You might not need the following line as navigating to a new page will trigger a reload
      // window.location.reload();

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please log in');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        x
      </div>

      <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
      <p>
        By logging in, you acknowledge that you have read and agree to our
        Terms of Service. For more information on how we handle your data,
        please refer to our Privacy Policy and Cookie Policy.
      </p>
      <form onSubmit={handleSubmit}>
        <h1>Email</h1>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email@example.com"
          required={true}
          value={email} // Bind value to state
          onChange={(e) => setEmail(e.target.value)}
        />
        <h1>Password</h1> {/* Use consistent capitalization */}
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required={true}
          value={password} // Bind value to state
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="Confirm password"
            required={true}
            value={confirmPassword} // Bind value to state
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit" value="SIGN UP" />
        <p>{error}</p>
      </form>

      <hr />

      <h2>WELCOME</h2>
    </div>
  );
};

export default AuthModal;
