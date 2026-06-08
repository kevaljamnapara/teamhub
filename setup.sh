#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting TeamHub setup..."

# 1. Server Setup
echo "📦 Installing server dependencies..."
cd server
npm install

if [ ! -f .env ]; then
  echo "📄 Creating server .env file..."
  cp .env.example .env
  
  # Generate secure JWT secrets
  echo "🔐 Generating JWT secrets..."
  ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  
  # Determine OS for sed syntax
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/your_access_token_secret_here_min_32_chars/$ACCESS_SECRET/" .env
    sed -i '' "s/your_refresh_token_secret_here_min_32_chars/$REFRESH_SECRET/" .env
  else
    sed -i "s/your_access_token_secret_here_min_32_chars/$ACCESS_SECRET/" .env
    sed -i "s/your_refresh_token_secret_here_min_32_chars/$REFRESH_SECRET/" .env
  fi
  echo "✅ Server .env file created and JWT secrets generated!"
else
  echo "⚠️ Server .env file already exists, skipping creation."
fi
cd ..

# 2. Client Setup
echo "📦 Installing client dependencies..."
cd client
npm install

if [ ! -f .env ]; then
  echo "📄 Creating client .env file..."
  echo "VITE_API_URL=http://localhost:3001/api" > .env
  echo "✅ Client .env file created!"
else
  echo "⚠️ Client .env file already exists, skipping creation."
fi
cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Make sure you have MongoDB running locally or update the MONGODB_URI in server/.env to use MongoDB Atlas."
echo ""
echo "To run the application, open two terminal windows:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm run dev"
echo ""
