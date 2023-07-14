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
        const response = await axios.get('http://localhost:8000/gendered-users', {
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
      <ChatHeader user={user} />

      <div className="tab-container">
        <button
          className={`tab ${clickedTab === 'matches' ? 'active' : ''}`}
          onClick={() => handleTabClick('matches')}
        >
          Matches
        </button>
        <button
          className={`tab ${clickedTab === 'chat' ? 'active' : ''}`}
          disabled={!clickedUser}
          onClick={() => handleTabClick('chat')}
        >
          Chat
        </button>
        <button
          className={`tab ${clickedTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleTabClick('discover')}
        >
          Discover
        </button>
      </div>

      {clickedTab === 'matches' && (
        <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser} />
      )}

      {clickedTab === 'chat' && clickedUser && (
        <ChatDisplay user={user} clickedUser={clickedUser} />
      )}

      {clickedTab === 'discover' && (
        <CardContainer filteredGenderedUsers={filteredGenderedUsers} />
      )}
    </div>
  );
};

export default ChatContainer;
