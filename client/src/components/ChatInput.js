import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatInput = ({ user, clickedUser, getUserMessages, getClickedUsersMessages }) => {
    const [textArea, setTextArea] = useState("")
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id
  
    const addMessage = async () => {
      const message = {
        timestamp: new Date().toISOString(),
        from_userId: userId,
        to_userId: clickedUserId,
        message: textArea
      };
  
      try {
        await axios.post('https://dark-ruby-mackerel-gown.cyclic.app/message', { message })
        getUserMessages()
        getClickedUsersMessages()
        setTextArea("")
      } catch (error) {
        console.log(error)
      }
    };
  
    const [isPickerVisible, setPickerVisible] = useState(false)
    const [currentEmoji, setCurrentEmoji] = useState("")
  
    const pickerRef = useRef(null)
  
    // Listen for clicks outside the emoji button and picker
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          pickerRef.current &&
          !pickerRef.current.contains(event.target) &&
          event.target.getAttribute('data-picker-button') !== 'emoji-picker'
        ) {
          setPickerVisible(false)
        }
      };
  
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);
  
    return (
      <div className="chat-input">
        <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
        <button
          className="secondary-button"
          onClick={addMessage}
          data-picker-button="emoji-picker"
        >
         ➤
        </button>
        <div className='d-flex flex-column align-items-center'>
          <button
            className='btn btn-primary'
            onClick={() => setPickerVisible(!isPickerVisible)}
            data-picker-button="emoji-picker"
          >
            😄
          </button>
          {isPickerVisible && (
            <div ref={pickerRef}>
              <Picker
                data={data}
                previewPosition='none'
                onEmojiSelect={(e) => {
                  setCurrentEmoji(e.native)
                  if (currentEmoji) {
                    setTextArea(textArea + currentEmoji)
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ChatInput;
  