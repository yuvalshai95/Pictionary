import { useEffect, useState, useRef } from 'react'

export const CanvasCmp = () => {
    const canvasRef = useRef()
    const canvasCtxRef = useRef()
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineCap = 'round'
        ctx.lineWidth = 5

        canvasCtxRef.current = ctx
    }, [])

    const startDrawing = ({ nativeEvent }) => {
        setIsDrawing(true)
        const { offsetX, offsetY } = nativeEvent
        canvasCtxRef.current.beginPath()
        canvasCtxRef.current.moveTo(offsetX, offsetY)

    }

    const stopDrawing = () => {
        canvasCtxRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return

        const { offsetX, offsetY } = nativeEvent
        canvasCtxRef.current.lineTo(offsetX, offsetY)
        canvasCtxRef.current.stroke()

    }

    return (
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


    )
}