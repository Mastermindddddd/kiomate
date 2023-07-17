import {React, useState, useEffect} from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import {useCookies} from 'react-cookie';

const CardContainer = () => {
  const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId


    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }

    const handleVibe = (VibedUserId, name) => {
      updateMatches(VibedUserId);
      console.log(name + " is now added to your chats");
    }

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))

  


  return (
    <div className="swipe-container">
      <div className="card-container">
        {filteredGenderedUsers?.map((genderedUser) => (
          <TinderCard
            className="swipe"
            key={genderedUser.user_id}
            //onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
          >
            <div
              style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
              className="card"
            >
              <h3>{genderedUser.first_name}</h3>
              <div className="card-buttons">
                <button onClick={() => handleVibe(genderedUser.user_id, genderedUser.first_name)}>
                  Vibe
                </button>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
