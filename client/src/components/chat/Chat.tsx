function Chat({isBlocked} : {isBlocked: boolean}) {
    return(
        <div className="chat">

            <h1>Chat</h1>

            <div id="chat-box"/>

            <div id="chat-input">

                <img src=".." alt="send"/>

                <input type="text" id="chat-input-text" placeholder={(isBlocked)? "Type something here" : "Chat blocked"}/>
                
            </div>

        </div>
    ) 
}
export default Chat;