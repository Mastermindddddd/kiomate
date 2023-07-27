import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const CardContainer = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cookies] = useCookies(['user']);
  const userId = cookies.UserId;
  const [message, setMessage] = useState('');

  const getUser = async () => {
    try {
      const response = await axios.get('/user', {
        params: { userId }
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/gendered-users`, {
        params: { gender: user?.gender_interest }
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/addmatch`, {
        userId,
        matchedUserId
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const handleVibe = (vibedUserId, name) => {
    updateMatches(vibedUserId);
    setMessage('Your request was sent to ' + name);

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId);

  const filteredGenderedUsers = genderedUsers.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  const currentGenderedUser = filteredGenderedUsers[currentIndex];

  return (
    <div className="swipe-container">
      <div className="card-container">
        {currentGenderedUser && (
          <TinderCard
            key={currentGenderedUser.user_id}
          >
            

            <div
              style={{ backgroundImage: `url(${currentGenderedUser.url})` }}
              className="card"
            >
              <div className="card-info-container">
                <h3>{currentGenderedUser.first_name}</h3>
                {user?.show_gender && (
                  <p>Gender: {currentGenderedUser.gender_identity}</p>
                )}
                <p>About: {currentGenderedUser.about}</p>
                <p>Location: {currentGenderedUser.location}</p>
                <p>Hobbies: {currentGenderedUser.hobbies}</p>
                <p>Interests: {currentGenderedUser.interests}</p>
                <p>Ideal Date: {currentGenderedUser.idealdate}</p>
                <p>Qualities: {currentGenderedUser.qualities}</p>
                <p>Deal Breaker: {currentGenderedUser.dealbreaker}</p>
              </div>
              <div className="card-buttons">
                <div className='connect-button'>
                {message && <div className="message">{message}</div>}
                <button onClick={() => handleVibe(currentGenderedUser.user_id, currentGenderedUser.first_name)}>
                  connect
                </button>
                </div>
                <div className="navigation-buttons">
        <div className='back-button'>
          <button onClick={handleBack} disabled={currentIndex === 0}>
            Back
          </button>
        </div>
        <div className='next-button'>
          <button onClick={handleNext} disabled={currentIndex === filteredGenderedUsers.length - 1}>
            Next
          </button>
        </div>
      </div>
              </div>
            </div>
          </TinderCard>
        )}
      </div>
    </div>
    
  );
};

export default CardContainer;
