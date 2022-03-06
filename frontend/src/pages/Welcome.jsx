import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router'

// Services
import { showUserMsg } from '../services/event-bus.service.js'
import { socketService } from '../services/socket.service.js'

// Icons
import logo from '../assets/imgs/logo.png'

export const Welcome = () => {
  const navigate = useNavigate()
  const inputRef = useRef()
  const [name, setName] = useState('')

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showUserMsg('You must enter a name!', 'warning')
    } else {
      socketService.emit('join', name)
      navigate('/drawing')
    }
  }

  return (
    <section className="home-page flex column align-center">
      <div className="header flex justify-center align-center">
        <div className="logo">
          <p>Pictionary</p>
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="form-wrapper flex column justify-center align-center">
        <h1>Enter your name to play</h1>
        <form className="form flex column  align-center" onSubmit={handleSubmit}>
          <input
            className="form-input"
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            placeholder="Enter name..."
          />
          <button
            className="primary-btn"
            type="submit">
            start
          </button>
        </form>
      </div>
    </section>
  );
}

