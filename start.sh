#!/bin/bash
# Nectar Retail Media Agent Builder — Start Script

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_DIR/api"
UI_DIR="$PROJECT_DIR/ui"

echo ""
echo "🛒 Nectar Retail Media Agent Builder"
echo "====================================="
echo ""

# Check ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    # Try loading from Signal's .env
    if [ -f "/home/r2/Signal/.env" ]; then
        export $(grep ANTHROPIC_API_KEY /home/r2/Signal/.env | xargs) 2>/dev/null
        echo "✅ Loaded ANTHROPIC_API_KEY from Signal/.env"
    else
        echo "⚠️  ANTHROPIC_API_KEY not set. Set it or the agent won't work."
    fi
else
    echo "✅ ANTHROPIC_API_KEY found"
fi

# Install Python deps globally (skip venv due to system constraints)
echo "📦 Installing Python dependencies..."
pip install -q --user -r "$API_DIR/requirements.txt" 2>/dev/null || echo "Dependencies may already be installed"
echo "✅ Python dependencies ready"

# Start FastAPI
echo "🚀 Starting FastAPI backend on :8001..."
cd "$API_DIR"
uvicorn main:app --host 0.0.0.0 --port 8001 --reload &
FASTAPI_PID=$!
echo "   FastAPI PID: $FASTAPI_PID"

# Start Vite dev server
echo "🌐 Starting Vite dev UI on :5173..."
cd "$UI_DIR"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing UI dependencies..."
    npm install --silent
fi
npm run dev &
VITE_PID=$!
echo "   Vite PID: $VITE_PID"

echo ""
echo "✅ All services started!"
echo ""
echo "   📊 Agent UI:     http://localhost:5173"
echo "   🔧 FastAPI docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Cleanup on exit
cleanup() {
    echo "Stopping services..."
    kill $FASTAPI_PID $VITE_PID 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM

wait
