# Farmhub Unified Server

This is the unified backend server for the Farmhub project that combines all functionality from the previous separate server files.

## Features

### 🗨️ Forum System
- **GET** `/api/forum-posts` - Get all forum posts
- **POST** `/api/forum-posts` - Create a new forum post
- **POST** `/api/forum-posts/:id/comments` - Add a comment to a post
- **POST** `/api/forum-posts/:postId/comments/:commentIndex/reply` - Reply to a comment

### 🌱 Crop Health Analysis
- **POST** `/api/analyze` - Analyze crop health using Groq AI
  - Input: `{ cropName, color, leafSpots, growthSpeed, soilCondition }`
  - Output: AI-generated health analysis and score

### 📊 Resource Management
- **POST** `/api/resources` - Generate farming resource plan
  - Input: `{ crop, location, startDate, resources }`
  - Output: 12-month farming plan with weather data and recommendations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Forum Endpoints

#### Get All Posts
```http
GET /api/forum-posts
```

#### Create New Post
```http
POST /api/forum-posts
Content-Type: application/json

{
  "title": "Post Title",
  "author": "Author Name",
  "tags": ["tag1", "tag2"]
}
```

#### Add Comment
```http
POST /api/forum-posts/:id/comments
Content-Type: application/json

{
  "author": "Commenter Name",
  "comment": "Comment text"
}
```

#### Reply to Comment
```http
POST /api/forum-posts/:postId/comments/:commentIndex/reply
Content-Type: application/json

{
  "author": "Replier Name",
  "comment": "Reply text"
}
```

### Crop Analysis Endpoint

#### Analyze Crop Health
```http
POST /api/analyze
Content-Type: application/json

{
  "cropName": "Wheat",
  "color": "Green",
  "leafSpots": "None",
  "growthSpeed": "Normal",
  "soilCondition": "Good"
}
```

### Resource Management Endpoint

#### Generate Resource Plan
```http
POST /api/resources
Content-Type: application/json

{
  "crop": "Rice",
  "location": "Punjab",
  "startDate": "2024-01-01",
  "resources": ["Water Usage", "Fertilizer", "Pesticide"]
}
```

## Database Schema

### ForumPost
```javascript
{
  title: String,
  author: String,
  tags: [String],
  time: Date,
  replies: Number,
  likes: Number,
  comments: [{
    author: String,
    comment: String,
    time: Date,
    replies: [{
      author: String,
      comment: String,
      time: Date
    }]
  }]
}
```

## Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `dotenv` - Environment variable management
- `groq-sdk` - Groq AI API client

## Migration from Old Servers

The unified server combines functionality from:
- `server.js` - Forum + Crop Analysis + Resource Management
- `server1.js` - Crop Analysis + Resource Management  
- `server2.js` - Forum only

All functionality has been preserved and deduplicated in the new `unified-server.js`. 