import { useEffect, useRef, useState, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { themeAtom } from '@/store/theme'

interface Position {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 300
const GRID_SIZE = 20
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE
const INITIAL_SPEED = 150
const INITIAL_SNAKE: Position[] = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
]

// 斐波那契数列生成器
function generateFibonacci(n: number): Set<number> {
  const fib = [1, 1]
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2])
  }
  return new Set(fib)
}

// 预设颜色方案（蛇身、蛇头、食物）
const COLOR_SCHEMES = [
  { snake: '#059669', snakeHead: '#047857', food: '#f43f5e' },   // 绿蛇粉食
  { snake: '#3b82f6', snakeHead: '#2563eb', food: '#fbbf24' },   // 蓝蛇黄食
  { snake: '#8b5cf6', snakeHead: '#7c3aed', food: '#f97316' },   // 紫蛇橙食
  { snake: '#ec4899', snakeHead: '#db2777', food: '#10b981' },   // 粉蛇绿食
  { snake: '#f59e0b', snakeHead: '#d97706', food: '#6366f1' },   // 橙蛇靛食
  { snake: '#14b8a6', snakeHead: '#0d9488', food: '#ef4444' },   // 青蛇红食
  { snake: '#06b6d4', snakeHead: '#0891b2', food: '#a855f7' },   // 天蓝蛇紫食
  { snake: '#f43f5e', snakeHead: '#e11d48', food: '#22d3ee' },   // 玫红蛇青食
  { snake: '#84cc16', snakeHead: '#65a30d', food: '#f472b6' },   // 黄绿蛇粉食
  { snake: '#6366f1', snakeHead: '#4f46e5', food: '#fb923c' },   // 靛蛇橙食
]

// 生成前 20 项斐波那契数（1, 1, 2, 3, 5, 8, 13, 21... 最大 6765）
const FIBONACCI_SET = generateFibonacci(10)

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>({ x: 10, y: 10 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [colorSchemeIndex, setColorSchemeIndex] = useState(0)
  const theme = useAtomValue(themeAtom)

  // 主题颜色配置
  const colors = {
    light: {
      background: '#f4f4f5',
      snake: '#059669',
      snakeHead: '#047857',
      food: '#f43f5e',
      grid: '#e4e4e7',
      text: '#18181b',
    },
    dark: {
      background: '#18181b',
      snake: '#10b981',
      snakeHead: '#059669',
      food: '#fb7185',
      grid: '#3f3f46',
      text: '#f4f4f5',
    },
  }

  const currentColors = colors[theme as keyof typeof colors] || colors.light

  // 从 localStorage 加载最高分
  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score')
    if (saved) {
      setHighScore(parseInt(saved, 10))
    }
  }, [])

  // 保存最高分
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('snake-high-score', score.toString())
    }
  }, [score, highScore])

  // 生成随机食物位置
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      }
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      // 空格键暂停/继续
      if (key === ' ') {
        event.preventDefault()
        if (gameStarted && !gameOver) {
          setIsPaused((prev) => !prev)
        }
        return
      }

      // 方向控制
      const directionMap: Record<string, Direction> = {
        arrowup: 'UP',
        w: 'UP',
        arrowdown: 'DOWN',
        s: 'DOWN',
        arrowleft: 'LEFT',
        a: 'LEFT',
        arrowright: 'RIGHT',
        d: 'RIGHT',
      }

      const newDirection = directionMap[key]
      if (newDirection && gameStarted) {
        event.preventDefault()
        // 防止反向移动
        const opposites: Record<Direction, Direction> = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        }
        if (opposites[newDirection] !== direction) {
          setNextDirection(newDirection)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction, gameOver, gameStarted])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    let animationFrameId: number
    let lastUpdateTime = 0

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastUpdateTime >= INITIAL_SPEED) {
        // 更新方向
        setDirection(nextDirection)

        setSnake((prevSnake) => {
          const head = prevSnake[0]
          let newHead: Position

          // 根据方向计算新的头部位置
          switch (nextDirection) {
            case 'UP':
              newHead = { x: head.x, y: head.y - 1 }
              break
            case 'DOWN':
              newHead = { x: head.x, y: head.y + 1 }
              break
            case 'LEFT':
              newHead = { x: head.x - 1, y: head.y }
              break
            case 'RIGHT':
              newHead = { x: head.x + 1, y: head.y }
              break
          }

          // 检查是否撞墙
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_WIDTH ||
            newHead.y < 0 ||
            newHead.y >= GRID_HEIGHT
          ) {
            setGameOver(true)
            return prevSnake
          }

          // 检查是否撞到自己
          if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
            setGameOver(true)
            return prevSnake
          }

          // 检查是否吃到食物
          const newSnake = [newHead, ...prevSnake]
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore((prev) => {
              const newScore = prev + 1

              // 检查是否达到斐波那契数
              if (FIBONACCI_SET.has(newScore)) {
                // 随机选择新颜色（确保与当前不同）
                let newIndex
                do {
                  newIndex = Math.floor(Math.random() * COLOR_SCHEMES.length)
                } while (newIndex === colorSchemeIndex)
                setColorSchemeIndex(newIndex)
              }

              return newScore
            })
            setFood(generateFood(newSnake))
          } else {
            newSnake.pop()
          }

          return newSnake
        })

        lastUpdateTime = currentTime
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => cancelAnimationFrame(animationFrameId)
  }, [gameStarted, gameOver, isPaused, nextDirection, food, generateFood])

  // Canvas 渲染
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 获取当前颜色方案
    const currentScheme = COLOR_SCHEMES[colorSchemeIndex]

    // 清空画布
    ctx.fillStyle = currentColors.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // 绘制网格
    ctx.strokeStyle = currentColors.grid
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_WIDTH; i++) {
      ctx.beginPath()
      ctx.moveTo(i * GRID_SIZE, 0)
      ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * GRID_SIZE)
      ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE)
      ctx.stroke()
    }

    // 绘制蛇
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? currentScheme.snakeHead : currentScheme.snake
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      )

      // 蛇头加个眼睛效果
      if (index === 0) {
        ctx.fillStyle = currentColors.background
        const eyeSize = 3
        const eyeOffset = 5

        if (direction === 'UP' || direction === 'DOWN') {
          ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + GRID_SIZE / 2 - eyeSize / 2, eyeSize, eyeSize)
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + GRID_SIZE / 2 - eyeSize / 2, eyeSize, eyeSize)
        } else {
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE / 2 - eyeSize / 2, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize)
          ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE / 2 - eyeSize / 2, segment.y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize)
        }
      }
    })

    // 绘制食物（圆形）
    ctx.fillStyle = currentScheme.food
    ctx.beginPath()
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      2 * Math.PI
    )
    ctx.fill()
  }, [snake, food, theme, currentColors, direction, colorSchemeIndex])

  // 开始游戏
  const startGame = () => {
    setGameStarted(true)
    setIsPaused(false)
  }

  // 重新开始游戏
  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(generateFood(INITIAL_SNAKE))
    setDirection('RIGHT')
    setNextDirection('RIGHT')
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
    setColorSchemeIndex(0)  // 重置为默认颜色
  }

  return (
    <div className="select-none">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[40px]">

        </span>
        <div className="flex gap-4 text-sm">
          <span className="text-secondary">
            得分: <span className="font-bold text-primary">{score}</span>
          </span>
          <span className="text-secondary">
            最高分: <span className="font-bold text-primary">{highScore}</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-primary rounded-lg"
        />

        {/* 开始游戏遮罩 */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-4">准备好了吗？</div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold"
              >
                开始游戏
              </button>
            </div>
          </div>
        )}

        {/* 游戏结束遮罩 */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">游戏结束!</div>
              <div className="text-lg text-white mb-4">得分: {score}</div>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}

        {/* 暂停遮罩 */}
        {isPaused && !gameOver && gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">暂停中</div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-secondary text-center">
        <div>↑↓←→ 或 WASD 控制方向 | 空格键暂停</div>
        <div className="mt-1 lg:hidden text-amber-600 dark:text-amber-400">
          建议使用桌面端获得最佳体验
        </div>
      </div>
    </div>
  )
}
