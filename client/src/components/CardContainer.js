import React from 'react';
import TinderCard from 'react-tinder-card';

const CardContainer = ({ filteredGenderedUsers, swiped, outOfFrame }) => {
  return (
    <div className="swipe-container">
      <div className="card-container">
        {filteredGenderedUsers?.map((genderedUser) => (
          <TinderCard
            className="swipe"
            key={genderedUser.user_id}
            onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
            onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
          >
            <div
              style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
              className="card"
            >
              <h3>{genderedUser.first_name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
