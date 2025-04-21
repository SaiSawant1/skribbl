# 🎨 DoodleDuel - Real-Time Multiplayer Drawing Game

DoodleDuel is a modern, real-time multiplayer drawing and guessing game built with cutting-edge technologies. Players can create or join rooms, take turns drawing, and compete by guessing what others are drawing.

## 🚀 Tech Stack

### Frontend Technologies
- **React 18** - Latest version with improved rendering and hooks
- **TypeScript** - For type-safe code and better developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for modern designs
- **Framer Motion** - Production-ready animation library
- **TanStack Router** - Type-safe routing solution
- **Three.js & React Three Fiber** - 3D graphics and animations
- **WebSocket** - Real-time bidirectional communication

### Backend Technologies (Go)
- **Go 1.21+** - Modern, fast, and concurrent programming language
- **Gorilla WebSocket** - WebSocket implementation for Go
- **Chi Router** - Lightweight and fast HTTP router
- **Go Modules** - Dependency management
- **Clean Architecture** - For maintainable and scalable code

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18+)
- Go (v1.21+)
- Git

## 📦 Installation

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/doodleduel.git
   cd doodleduel
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Go dependencies:
   ```bash
   go mod download
   ```

## 🚀 Development

### Running Frontend

Start the development server:
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Running Backend

Start the Go server:
```bash
cd backend
make run
```
The backend API will be available at `http://localhost:3000`

## 🏗️ Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── DoodleBackground.tsx
│   │   └── ...
│   ├── routes/           # Application routes
│   │   ├── index.tsx     # Landing page
│   │   └── ...
│   ├── styles/          # Global styles and Tailwind
│   └── main.tsx         # Application entry point
├── public/             # Static assets
└── package.json       # Dependencies and scripts
```

### Backend Structure
```
backend/
├── cmd/
│   └── server/        # Application entry point
├── internal/
│   ├── game/         # Game logic
│   ├── websocket/    # WebSocket handlers
│   └── api/          # HTTP API handlers
├── go.mod           # Go dependencies
└── Makefile        # Build and run commands
```

## 🎮 Features

- **Real-Time Drawing**: Smooth, responsive drawing interface
- **Live Collaboration**: Multiple players can join the same room
- **Chat System**: In-game chat with emoji support
- **Custom Words**: Create custom word lists for your games
- **Score Tracking**: Real-time scoring and leaderboards
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Configuration

### Frontend Configuration
- Edit `vite.config.ts` for build settings
- Modify `tailwind.config.js` for theme customization
- Update `.env` for environment variables

### Backend Configuration
- Environment variables in `.env`
- Game settings in `config.yaml`
- Network settings in server configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js for 3D graphics
- Framer Motion for animations
- TailwindCSS for styling
- Go community for backend support

## 🔗 Links

- [Live Demo](https://doodleduel.example.com)
- [Documentation](https://docs.doodleduel.example.com)
- [Report Issues](https://github.com/yourusername/doodleduel/issues)

---

Made with ❤️ by [Your Name]
