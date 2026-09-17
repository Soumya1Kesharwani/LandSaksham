#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================================================"
echo "🏛️  National Land & Infrastructure Intelligence System (LandSaksham)"
echo "======================================================================"

echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
(cd "$DIR/backend" && python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

sleep 2

echo "[2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ..."
(cd "$DIR/frontend" && npm run dev -- --host 127.0.0.1 --port 5173) &
FRONTEND_PID=$!

echo ""
echo "======================================================================"
echo "✅ Both servers are running!"
echo "📡 Backend API Docs: http://127.0.0.1:8000/docs"
echo "🌐 Frontend Portal:  http://127.0.0.1:5173"
echo "======================================================================"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
