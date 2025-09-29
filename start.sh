#!/bin/bash
echo "🚀 Starting Cashpot V7 Complete Application..."

# Start backend
cd backend
node index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend running on http://localhost:3001"
echo "✅ Frontend running on http://localhost:5173/cashpot-v7/"
echo "✅ Login: admin / password"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
