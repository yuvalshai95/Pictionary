import { useEffect, useState, useRef } from 'react';
import { showUserMsg } from '../services/event-bus.service.js'
import { socketService } from '../services/socket.service.js'
import { useNavigate } from 'react-router'
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
      console.log('empty name');
      return
    } else {
      socketService.emit('join', name)
      // redirect to choose word
      navigate('/drawing')
    }
  }

  return (
    <section className="home-page">
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input ref={inputRef} type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
        <button type="submit"> start </button>
      </form>
    </section>
  );
}

