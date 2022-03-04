import { useEffect, useState, useRef } from 'react'
import { socketService } from '../services/socket.service'

export const CanvasCmp = () => {
    const canvasRef = useRef()
    const [isDrawing, setIsDrawing] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })

    // Canvas init
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineCap = 'round'
        ctx.lineWidth = 5
    }, [])


    // Live draw socket
    useEffect(() => {
        socketService.on('draw', ({ xStart, yStart, xFinish, yFinish }) => {
            drawLine(xStart, yStart, xFinish, yFinish, false)
        })
    }, [])

    // MouseDown
    const startDrawing = (e) => {
        setIsDrawing(true)
        setCoords(getRecentCoords(e))
        canvasRef.current.getContext('2d').beginPath()
    }

    const getRecentCoords = (e) => {
        const canvas = canvasRef.current

        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        }
    }

    // MouseUp / MouseOut
    const stopDrawing = (e) => {
        const newCoords = getRecentCoords(e)
        drawLine(newCoords.x, newCoords.y, newCoords.x, newCoords.y, true)
        canvasRef.current.getContext('2d').closePath()
        setIsDrawing(false)
    }

    // MouseMove
    const draw = (e) => {
        if (!isDrawing) return

        const newCoords = getRecentCoords(e)
        drawLine(coords.x, coords.y, newCoords.x, newCoords.y, true)
        setCoords(newCoords)
    }

    const drawLine = (xStart, yStart, xFinish, yFinish, isEmit) => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.moveTo(xStart, yStart) // Start
        ctx.lineTo(xFinish, yFinish) // Finish
        ctx.stroke()

        if (isEmit) {
            socketService.emit('draw', { xStart, yStart, xFinish, yFinish })
        }
    }


    const clear = () => {

    }

    return (
        <>
            <canvas
                ref={canvasRef}
                className='rounded'
                width={600}
                height={450}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            <button onClick={clear}>Clear</button>
        </>
    )
}