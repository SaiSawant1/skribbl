import { createFileRoute } from '@tanstack/react-router'
import { BackgroundCanvas } from '../components/BackgroundCanvas'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DoodleBackground } from '../components/DoodleBackground'

const features = [
  {
    title: "Real-Time Drawing",
    description: "Express your creativity with our smooth drawing tools and real-time collaboration.",
    icon: "🎨"
  },
  {
    title: "Quick Rounds",
    description: "Fast-paced rounds keep the excitement high and the fun flowing.",
    icon: "⚡"
  },
  {
    title: "Custom Words",
    description: "Create your own word lists or use our curated categories.",
    icon: "📝"
  },
  {
    title: "Global Players",
    description: "Connect and compete with players from around the world.",
    icon: "🌍"
  },
  {
    title: "Score Tracking",
    description: "Climb the leaderboard and track your drawing prowess.",
    icon: "🏆"
  },
  {
    title: "Chat & Emotes",
    description: "Interact with other players through chat and fun emotes.",
    icon: "💬"
  }
]

const howToPlay = [
  {
    step: 1,
    title: "Join or Create",
    description: "Start a new game room or join an existing one with friends."
  },
  {
    step: 2,
    title: "Take Turns",
    description: "Players take turns drawing while others try to guess the word."
  },
  {
    step: 3,
    title: "Draw & Guess",
    description: "Use your artistic skills to draw, or your wit to guess quickly!"
  },
  {
    step: 4,
    title: "Score Points",
    description: "Earn points for correct guesses and great drawings."
  }
]

export const Route = createFileRoute('/')({
  component: LandingPage,
})

export function LandingPage() {
  const [showGameOptions, setShowGameOptions] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')

  const handleCreateGame = () => {
    if (!playerName) {
      setError('Please enter your name')
      return
    }
    // TODO: Implement create game logic
  }

  const handleJoinGame = () => {
    if (!playerName || !roomId) {
      setError('Please enter your name and room ID')
      return
    }
    // TODO: Implement join game logic
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <DoodleBackground />
      
      <div className="relative z-10">
        {!showGameOptions ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 py-16 space-y-24"
          >
            {/* Hero Section */}
            <motion.div 
              variants={itemVariants}
              className="text-center max-w-4xl mx-auto pt-16"
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                DoodleDuel
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                The ultimate multiplayer drawing and guessing game where creativity meets competition!
              </p>
              <motion.button
                className="btn btn-primary text-lg px-8 py-3"
                onClick={() => setShowGameOptions(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Playing Now
              </motion.button>
            </motion.div>

            {/* Features Grid */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-center mb-12">Game Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* How to Play Section */}
            <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How to Play</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {howToPlay.map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-primary text-xl font-bold mb-2">Step {step.step}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              variants={itemVariants}
              className="text-center py-16"
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Play?</h2>
              <motion.button
                className="btn btn-primary text-lg px-8 py-3"
                onClick={() => setShowGameOptions(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join the Fun
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <button 
                onClick={() => setShowGameOptions(false)}
                className="text-gray-400 hover:text-white transition-colors mb-4"
              >
                ← Back to Home
              </button>
              
              <h2 className="text-3xl font-bold text-center text-white">
                Join the Fun!
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-300">
                    Your Name
                  </label>
                  <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="input w-full mt-1"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
                    Room ID (optional)
                  </label>
                  <input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="input w-full mt-1"
                    placeholder="Enter room ID to join"
                  />
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <div className="flex flex-col space-y-2">
                  <motion.button
                    onClick={handleCreateGame}
                    className="btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create New Game
                  </motion.button>
                  
                  <motion.button
                    onClick={handleJoinGame}
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Game
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 