import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MatchesDisplay from './MatchesDisplay';
import ChatDisplay from './ChatDisplay';
import CardContainer from './CardContainer';
import axios from 'axios';

const ChatContainer = ({ user }) => {
  const [clickedTab, setClickedTab] = useState('matches');
  const [clickedUser, setClickedUser] = useState(null);
  const [filteredGenderedUsers, setFilteredGenderedUsers] = useState([]);

  const handleTabClick = (tab) => {
    setClickedTab(tab);
    setClickedUser(null);
  };

  useEffect(() => {
    // Fetch or calculate filteredGenderedUsers data
    const fetchFilteredGenderedUsers = async () => {
      try {
        const response = await axios.get('https://kiomate-mastermindddddds-projects.vercel.app/gendered-users', {
          params: { gender: user?.gender_interest }
        });
        setFilteredGenderedUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (clickedTab === 'discover') {
      fetchFilteredGenderedUsers();
    }
  }, [clickedTab, user]);

  return (
    <div className="chat-container">
      <div className='chat-header'>
      <ChatHeader user={user} />
      </div>

      <div className="tab-container">
        <button
          className={`tab ${clickedTab === 'matches' ? 'active' : ''}`} 
          onClick={() => {
            setClickedTab('matches');
            setClickedUser(null);
          }}
        >
          Matches
        </button>

        <button
          className={`tab ${clickedTab === 'chat' ? 'active' : ''}`} 
          disabled={!clickedUser}
        >
        </button>

        <button
          className={`tab ${clickedTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleTabClick('discover')}
        >
          Discover
        </button>
      </div>

      {clickedTab === 'matches' && !clickedUser && (
        <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser} />
      )}

      {/* Display a message when there are no matches */}
      {clickedTab === 'matches' && !clickedUser && user.matches.length === 0 && (
        <div className='displayed-message'>
        <p>No matches found. tap the Discover tab above to discover your Person!</p>
        </div>
      )}

      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}

      {clickedTab === 'discover' && (
        <CardContainer filteredGenderedUsers={filteredGenderedUsers} />
        
      )}
    </div>
  );
};

export default ChatContainer;
