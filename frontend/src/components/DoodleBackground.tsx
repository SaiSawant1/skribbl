import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const shapes = [
  'M10 10C14.4183 10 18 13.5817 18 18C18 22.4183 14.4183 26 10 26C5.58172 26 2 22.4183 2 18C2 13.5817 5.58172 10 10 10Z',
  'M2 2L18 18M2 18L18 2',
  'M2 10H18M10 2V18',
  'M2 2H18V18H2Z',
  'M10 2L18 18H2L10 2Z',
  'M5 15.2679C3.20069 14.1826 2 12.2272 2 10C2 6.68629 4.68629 4 8 4C11.3137 4 14 6.68629 14 10C14 12.2272 12.7993 14.1826 11 15.2679V18H5V15.2679Z',
  'M8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4V14C12 15.1046 11.1046 16 10 16C8.89543 16 8 15.1046 8 14V4Z'
]

function generateRandomDoodle() {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const scale = Math.random() * 1 + 1.5
  const rotation = Math.random() * 360
  const pathIndex = Math.floor(Math.random() * shapes.length)
  const delay = Math.random() * 4
  const duration = Math.random() * 3 + 4
  const color = `hsl(${Math.random() * 360}, 70%, 70%)`

  return {
    x,
    y,
    scale,
    rotation,
    pathIndex,
    delay,
    duration,
    color
  }
}

export function DoodleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const doodles = Array.from({ length: 30 }, generateRandomDoodle)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      container.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <div 
        ref={containerRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        {doodles.map((doodle, i) => (
          <motion.svg
            key={i}
            width="40"
            height="40"
            viewBox="0 0 20 20"
            style={{
              position: 'absolute',
              left: `${doodle.x}%`,
              top: `${doodle.y}%`,
              color: doodle.color,
            }}
            initial={{ 
              scale: 0,
              rotate: doodle.rotation - 90,
              opacity: 0 
            }}
            animate={{ 
              scale: doodle.scale,
              rotate: doodle.rotation,
              opacity: 0.4
            }}
            transition={{
              duration: doodle.duration,
              delay: doodle.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <motion.path
              d={shapes[doodle.pathIndex]}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: doodle.duration * 0.75,
                delay: doodle.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
    </div>
  )
} 