# 🤖 Mini Workflow Automation

A full-stack application that creates automated 2-step workflows powered by AI agents and third-party APIs. Users can define workflows that combine AI-generated content with real-time data from various APIs.

![Workflow Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green) ![Node.js](https://img.shields.io/badge/Node.js-Backend-blue)

## 🎯 Overview

This application allows users to create intelligent workflows by:
1. **AI Agent Step**: Generate contextual content based on user prompts
2. **Third-Party API Step**: Fetch real-time data from external services
3. **Combination Step**: Merge both responses into a final, actionable output

Perfect for creating automated social media content, reports, or any task requiring AI + real-time data.

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Content Generation** - Generate tweets, posts, and content using AI agents
- 🌤️ **Weather Integration** - Get real-time weather data for any location
- 📰 **News Integration** - Fetch latest headlines and news updates
- 🚀 **GitHub Integration** - Discover trending repositories and projects
- 📊 **Workflow History** - Track and view all previously executed workflows
- 🎨 **Modern UI** - Clean, responsive interface built with Next.js and Tailwind CSS

### Technical Features
- **RESTful API** with Express.js backend
- **MongoDB** persistence for workflow history
- **Error Handling** with user-friendly messages
- **Input Validation** and sanitization
- **Responsive Design** for all device sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **TypeScript/JavaScript** - Type-safe development

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Third-Party APIs
- **OpenAI API** - AI content generation
- **OpenWeatherMap API** - Weather data
- **News API** - Latest news headlines
- **GitHub API** - Trending repositories

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB installed locally or MongoDB Atlas account
- API keys for third-party services

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/workflow-automation
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/workflow-automation

# AI Service (choose one)
OPENAI_API_KEY=your_openai_api_key_here
# HUGGINGFACE_API_KEY=your_huggingface_api_key_here (alternative)

# Third-Party APIs
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_news_api_key_here
GITHUB_TOKEN=your_github_token_here (optional, for higher rate limits)

# Server Configuration
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Keys Setup

1. **OpenAI API**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **OpenWeatherMap**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) for free API key
3. **News API**: Get your API key from [NewsAPI](https://newsapi.org/)
4. **GitHub Token**: (Optional) Create a personal access token at [GitHub Settings](https://github.com/settings/tokens)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Upthrust_Assignment.git
   cd Upthrust_Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas and update MONGODB_URI in .env.local
   ```

4. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   npm run dev:backend
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Frontend: http://localhost:3000
   Backend API: http://localhost:3001
   ```

## 📚 API Documentation

### Endpoints

#### `POST /run-workflow`
Execute a 2-step workflow with AI agent and third-party API.

**Request Body:**
```json
{
  "prompt": "Write a tweet about today's weather",
  "action": "weather",
  "location": "Delhi" // optional, for weather/news actions
}
```

**Response:**
```json
{
  "ai_response": "Perfect day to chill outside!",
  "api_response": "Sunny in Delhi, 31°C",
  "final_result": "Perfect day to chill outside! Sunny in Delhi, 31°C #weather",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Supported Actions:**
- `weather` - Fetch weather data (requires location)
- `news` - Get latest news (location optional)
- `github` - Trending repositories

#### `GET /history`
Retrieve the last 10 workflow executions.

**Response:**
```json
[
  {
    "_id": "65a5f2b8c9d4e1f2a3b4c5d6",
    "prompt": "Write a tweet about today's weather",
    "action": "weather",
    "location": "Delhi",
    "ai_response": "Perfect day to chill outside!",
    "api_response": "Sunny in Delhi, 31°C",
    "final_result": "Perfect day to chill outside! Sunny in Delhi, 31°C #weather",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🎮 Usage Examples

### Weather Tweet
```json
{
  "prompt": "Create a motivational tweet about today's weather",
  "action": "weather",
  "location": "Mumbai"
}
```

### Tech News Summary
```json
{
  "prompt": "Summarize today's top tech news in one sentence",
  "action": "news"
}
```

### GitHub Discovery
```json
{
  "prompt": "Write about trending open-source projects",
  "action": "github"
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables in deployment platform
3. Deploy backend service
4. Update NEXT_PUBLIC_API_URL in frontend

### Frontend Deployment (Vercel)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy frontend
4. Update CORS settings in backend for production domain

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI with Atlas connection string
3. Configure IP whitelist for deployment platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- OpenWeatherMap for weather data
- NewsAPI for news content
- GitHub API for repository data
- Next.js and React communities

## 📧 Support

For questions or support, please open an issue in the GitHub repository or contact verma.shubham1607@gmail.com.

---

**Made for the Upthrust Assignment**