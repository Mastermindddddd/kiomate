import { useState} from 'react';
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
        }

        try {
            await axios.post('http://localhost:8000/message', { message })
            getUserMessages()
            getClickedUsersMessages()
            setTextArea("")
        } catch (error) {
            console.log(error)
        }
    }

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentEmoji, setCurrentEmoji] = useState(null);


    return (
        <div className="chat-input">
            <textarea value={textArea || currentEmoji} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage}>Submit</button>
            <div className='d-flex flex-column align-items-center'>
                <button className='btn btn-primary'
                onClick={() => setPickerVisible(!isPickerVisible)}
                >😄</button>
                <div className={isPickerVisible ? 'd-block' : 'd-none'}>
                    <Picker data={data}previewPosition='none' onEmojiSelect={(e) => {
                        setCurrentEmoji(e.native);
                        setPickerVisible(!isPickerVisible);
                    }} />
                </div>
            </div>
        </div>
    )
}

export default ChatInput