
const ChatEventEnum = Object.freeze({
    //?when user join the socket
    CONNECT_EVENT: "connect",
    // ?when user get disconnected
    DISCONNECT_EVENT: "disconnect",
    //?join the chat
    JOIN_EVENT: "joinChat",
    // ?new one on one chat
    NEW_CHAT_EVENT: "newChat",
    // ?when there is socket error
    SOCKET_EVENT: "socketError",
    
    
})

module.exports=Object.values(ChatEventEnum)