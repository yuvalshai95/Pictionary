import { useState, useEffect, useRef } from 'react'

// Services
import { socketService } from '../services/socket.service.js'

export const Chat = ({ isDrawer }) => {
    const bottomRef = useRef()
    const [msg, setMsg] = useState('')
    const [chats, setChats] = useState([])

    useEffect(() => {
        socketService.off('chat')
        socketService.on('chat', handleReceiveChat)
        scrollToBottom()
        return () => {
            socketService.off('chat', handleReceiveChat)
        }
    }, [chats])

    const handleReceiveChat = (chat) => {
        setChats([...chats, chat])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (msg.trim() === '') return
        socketService.emit('chat', msg.trim())
        setMsg('')
    }


    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }


    return (
        <div className="chat">
            <h1>Chat Box</h1>
            <ul className="chat-list clean-list flex column">
                {chats.map((msg, index) => (
                    <li key={index} className="chat-item">
                        {
                            msg.from === 'Host' ? <b style={{ color: msg.color }}>{msg.msg}</b>
                                : <>
                                    <b>{msg.from}</b>: {msg.msg}
                                </>
                        }
                    </li>
                ))}
                <div ref={bottomRef}></div>
            </ul>
            <form className="flex" onSubmit={handleSubmit}>
                <input
                    type="text"
                    disabled={false}
                    value={msg}
                    onChange={(e) => { setMsg(e.target.value) }}
                    placeholder="Guess the answer here..."
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isDrawer}
                >
                    Guess
                </button>
            </form>
        </div>
    )
}


