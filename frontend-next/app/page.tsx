"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Real-Time Drawing",
    description:
      "Express your creativity with our smooth drawing tools and real-time collaboration.",
    icon: "🎨",
  },
  {
    title: "Quick Rounds",
    description:
      "Fast-paced rounds keep the excitement high and the fun flowing.",
    icon: "⚡",
  },
  {
    title: "Custom Words",
    description: "Create your own word lists or use our curated categories.",
    icon: "📝",
  },
  {
    title: "Global Players",
    description: "Connect and compete with players from around the world.",
    icon: "🌍",
  },
  {
    title: "Score Tracking",
    description: "Climb the leaderboard and track your drawing prowess.",
    icon: "🏆",
  },
  {
    title: "Chat & Emotes",
    description: "Interact with other players through chat and fun emotes.",
    icon: "💬",
  },
];

const howToPlay = [
  {
    step: 1,
    title: "Join or Create",
    description: "Start a new game room or join an existing one with friends.",
  },
  {
    step: 2,
    title: "Take Turns",
    description:
      "Players take turns drawing while others try to guess the word.",
  },
  {
    step: 3,
    title: "Draw & Guess",
    description:
      "Use your artistic skills to draw, or your wit to guess quickly!",
  },
  {
    step: 4,
    title: "Score Points",
    description: "Earn points for correct guesses and great drawings.",
  },
];
export default function Home() {
  const router = useRouter();
  const startGame = () => {
    console.log("start");
    router.push("/start");
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10">
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
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text bg-gradient-to-r from-blue-700 text-blue-500/70">
              DoodleDuel
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              The ultimate multiplayer drawing and guessing game where
              creativity meets competition!
            </p>
            <motion.button
              className=" bg-blue-700/60 text-white hover:bg-blue-700 rounded-xl text-lg px-8 py-3 font-bold"
              whileHover={{ scale: 1.05 }}
              onClick={startGame}
            >
              Start Playing Now
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Game Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-4xl mb-4 block">
                    {feature.icon}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Play Section */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <h2 className="text-3xl text-violet-500 font-bold text-center mb-12">
              How to Play
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {howToPlay.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-violet-300 text-xl font-bold mb-2">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
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
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              Ready to Play?
            </h2>
            <motion.button
              className="rounded-xl font-bold text-white  bg-blue-700 text-lg px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
            >
              Join the Fun
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
