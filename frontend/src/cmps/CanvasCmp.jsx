import { useEffect, useState, useRef } from 'react'
import { socketService } from '../services/socket.service'

export const CanvasCmp = ({ isDrawer }) => {
    const canvasRef = useRef()
    const canvasWrapperRef = useRef()
    const [isDrawing, setIsDrawing] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })

    // Canvas init
    useEffect(() => {
        initCanvas()
    }, [])

    useEffect(() => {
        // Canvas drawing history for players joining after game started
        socketService.off('join')
        socketService.on('join', ({ drawingCache }) => {
            drawingCache.forEach(line => drawLine(line.xStart, line.yStart, line.xFinish, line.yFinish, false));
        })

        // Multiplayer draw in real time socket
        socketService.off('draw')
        socketService.on('draw', ({ xStart, yStart, xFinish, yFinish }) => {
            drawLine(xStart, yStart, xFinish, yFinish, false)
        })

        // Clear canvas socket
        socketService.off('clear')
        socketService.on('clear', () => {
            initCanvas()
        })

        window.addEventListener('resize', () => {
            resizeCanvas()

        });

        resizeCanvas()

    }, [])


    const resizeCanvas = () => {
        console.log('here')
        canvasRef.current.width = canvasWrapperRef.current.offsetWidth
        canvasRef.current.height = canvasWrapperRef.current.offsetHeight
        console.log('canvasRef.width', canvasRef.current.width)
        console.log('canvasRef.height', canvasRef.current.height)
    }

    const initCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#000'
        ctx.lineCap = 'round'
        ctx.lineWidth = 5
    }

    // MouseDown
    const startDrawing = (e) => {
        setIsDrawing(true)
        setCoords(getRecentCoords(e))
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
        // Draw a single dot
        if (isDrawing && isDrawer) {
            drawLine(newCoords.x, newCoords.y, newCoords.x, newCoords.y, true)
        }
        setIsDrawing(false)
    }

    // MouseMove
    const draw = (e) => {
        if (!isDrawing || !isDrawer) return

        const newCoords = getRecentCoords(e)
        drawLine(coords.x, coords.y, newCoords.x, newCoords.y, true)
        setCoords(newCoords)
    }

    const drawLine = (xStart, yStart, xFinish, yFinish, isEmit) => {
        const ctx = canvasRef.current.getContext('2d')

        ctx.beginPath()
        ctx.moveTo(xStart, yStart) // Start
        ctx.lineTo(xFinish, yFinish) // Finish
        ctx.stroke()

        if (isEmit) {
            socketService.emit('draw', { xStart, yStart, xFinish, yFinish })
        }
    }


    const clear = () => {
        socketService.emit('clear')
    }

    return (
        <div ref={canvasWrapperRef} className="canvas-wrapper flex column align-center">
            <canvas
                ref={canvasRef}
                className={`rounded ${isDrawer ? 'canvas-enabled' : 'canvas-disabled'}`}
                width={600}
                height={450}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            {isDrawer && <button className="secondary-btn" onClick={clear}>Clear</button>}
        </div>
    )
}