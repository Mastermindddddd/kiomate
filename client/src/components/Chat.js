const Chat = ({descendingOrderMessages}) => {
    return (
        <>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index} className="chat-message">
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={message.name + ' profile'}/>
                            </div>
                        </div>
                        <div className="user-message-container" >
                        <p>{message.name}:  {message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat