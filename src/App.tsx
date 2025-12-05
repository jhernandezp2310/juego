import { useState, useEffect, useRef } from 'react'
import './App.css'

interface BoxPosition {
  top: number
  left: number
  id: string
  isCorrect: boolean
}

function App() {
  const [showBoxes, setShowBoxes] = useState<boolean>(false)
  const [boxes, setBoxes] = useState<BoxPosition[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [lastTime, setLastTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [difficulty, setDifficulty] = useState<number>(1) // 1, 2, 3, 4 niveles
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const calculateRandomPosition = (existingBoxes: BoxPosition[] = []): { top: number; left: number } => {
    if (!gameAreaRef.current) {
      // Fallback si no hay referencia
      return { top: 100, left: 100 }
    }

    const gameArea = gameAreaRef.current
    const boxSize = 80 // Tamaño del cuadro
    const padding = 20 // Padding mínimo desde los bordes
    const minDistance = 120 // Distancia mínima entre cuadros
    
    // Obtener dimensiones del área de juego
    const areaWidth = gameArea.clientWidth
    const areaHeight = gameArea.clientHeight
    
    // Calcular límites válidos
    const maxTop = areaHeight - boxSize - padding
    const maxLeft = areaWidth - boxSize - padding
    const minTop = padding
    const minLeft = padding
    
    // Verificar que hay espacio suficiente
    if (maxTop < minTop || maxLeft < minLeft) {
      return { top: padding, left: padding }
    }
    
    let top: number
    let left: number
    let attempts = 0
    const maxAttempts = 100
    
    do {
      top = Math.random() * (maxTop - minTop) + minTop
      left = Math.random() * (maxLeft - minLeft) + minLeft
      attempts++
    } while (
      attempts < maxAttempts && 
      existingBoxes.some(box => {
        const distance = Math.sqrt(
          Math.pow(box.top - top, 2) + Math.pow(box.left - left, 2)
        )
        return distance < minDistance
      })
    )
    
    return { top, left }
  }

  const startGame = () => {
    setGameStarted(true)
    setShowBoxes(false)
    setLastTime(null)
    setErrorMessage(null)
    
    // Limpiar timeout anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Tiempo aleatorio entre 500ms y 2000ms
    const randomDelay = Math.random() * 1500 + 500
    
    const newTimeoutId = setTimeout(() => {
      // Verificar que el área de juego esté disponible
      if (!gameAreaRef.current) {
        console.warn('Game area not available, retrying...')
        // Reintentar después de un breve delay
        setTimeout(() => startGame(), 100)
        return
      }
      
      const numBoxes = difficulty + 1 // 2, 3, 4 o 5 cuadros según dificultad (nivel 1-4)
      const newBoxes: BoxPosition[] = []
      const correctIndex = Math.floor(Math.random() * numBoxes)
      
      for (let i = 0; i < numBoxes; i++) {
        const position = calculateRandomPosition(newBoxes)
        newBoxes.push({
          ...position,
          id: `box-${i}`,
          isCorrect: i === correctIndex
        })
      }
      
      setBoxes(newBoxes)
      setShowBoxes(true)
      setStartTime(Date.now())
    }, randomDelay)

    setTimeoutId(newTimeoutId)
  }

  const handleBoxClick = (boxId: string) => {
    if (startTime === null) return

    const clickedBox = boxes.find(box => box.id === boxId)
    if (!clickedBox) return

    if (!clickedBox.isCorrect) {
      // Click en cuadro incorrecto - error
      setErrorMessage('¡Error! Hiciste click en el cuadro incorrecto. Intenta de nuevo.')
      setShowBoxes(false)
      setStartTime(null)
      
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
      return
    }

    // Click correcto
    const reactionTime = Date.now() - startTime
    setLastTime(reactionTime)
    setErrorMessage(null)
    
    const newReactionTimes = [...reactionTimes, reactionTime]
    setReactionTimes(newReactionTimes)

    // Actualizar mejor tiempo
    if (bestTime === null || reactionTime < bestTime) {
      setBestTime(reactionTime)
    }

    // Resetear para siguiente intento
    setShowBoxes(false)
    setStartTime(null)
  }

  const resetStats = () => {
    setReactionTimes([])
    setLastTime(null)
    setBestTime(null)
    setShowBoxes(false)
    setStartTime(null)
    setGameStarted(false)
    setErrorMessage(null)
    
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  const tryAgain = () => {
    startGame()
  }

  const calculateAverage = (): number => {
    if (reactionTimes.length === 0) return 0
    const sum = reactionTimes.reduce((acc, time) => acc + time, 0)
    return Math.round(sum / reactionTimes.length)
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Click the Box – Prueba de Reacción</h1>
        
        <div className="difficulty-selector">
          <label>Nivel de dificultad:</label>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-btn ${difficulty === 1 ? 'active' : ''}`}
              onClick={() => {
                setDifficulty(1)
                resetStats()
              }}
            >
              Nivel 1 (2 cuadros)
            </button>
            <button
              className={`difficulty-btn ${difficulty === 2 ? 'active' : ''}`}
              onClick={() => {
                setDifficulty(2)
                resetStats()
              }}
            >
              Nivel 2 (3 cuadros)
            </button>
            <button
              className={`difficulty-btn ${difficulty === 3 ? 'active' : ''}`}
              onClick={() => {
                setDifficulty(3)
                resetStats()
              }}
            >
              Nivel 3 (4 cuadros)
            </button>
            <button
              className={`difficulty-btn ${difficulty === 4 ? 'active' : ''}`}
              onClick={() => {
                setDifficulty(4)
                resetStats()
              }}
            >
              Nivel 4 (5 cuadros)
            </button>
          </div>
        </div>
        
        <div className="game-area" ref={gameAreaRef}>
          {!gameStarted && !showBoxes && (
            <button className="start-button" onClick={startGame}>
              Empezar
            </button>
          )}
          
          {showBoxes && boxes.map((box) => (
            <div
              key={box.id}
              className={`reaction-box ${box.isCorrect ? 'correct-box' : 'wrong-box'}`}
              style={{
                top: `${box.top}px`,
                left: `${box.left}px`,
              }}
              onClick={() => handleBoxClick(box.id)}
            />
          ))}

          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          {gameStarted && !showBoxes && startTime === null && lastTime !== null && !errorMessage && (
            <div className="waiting-message">
              <p>¡Bien hecho! Presiona "Intentar de nuevo" para continuar.</p>
            </div>
          )}
        </div>

        <div className="stats-container">
          <div className="stats-box">
            <h2>Estadísticas</h2>
            <div className="stat-item">
              <span className="stat-label">Último tiempo:</span>
              <span className="stat-value">
                {lastTime !== null ? `${lastTime} ms` : '—'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Promedio:</span>
              <span className="stat-value">
                {reactionTimes.length > 0 ? `${calculateAverage()} ms` : '—'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mejor tiempo:</span>
              <span className="stat-value best-time">
                {bestTime !== null ? `${bestTime} ms` : '—'}
              </span>
            </div>
          </div>

          <div className="buttons-container">
            {gameStarted && (
              <button className="action-button" onClick={tryAgain}>
                Intentar de nuevo
              </button>
            )}
            <button className="action-button reset-button" onClick={resetStats}>
              Reiniciar estadísticas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

