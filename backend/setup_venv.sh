#!/bin/bash
# Run this once from the backend/ directory to set up the Python virtual environment
# This fixes Pylance "import could not be resolved" warnings in VS Code

set -e

echo "Setting up Python virtual environment..."

# Create venv
python3.11 -m venv .venv 2>/dev/null || python3 -m venv .venv

# Activate
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip --quiet

# Install all dependencies
pip install -r requirements.txt --quiet

echo ""
echo "✅ Virtual environment ready at backend/.venv"
echo ""
echo "Next steps in VS Code:"
echo "  1. Press Ctrl+Shift+P → 'Python: Select Interpreter'"
echo "  2. Choose: backend/.venv/bin/python  (or backend\\.venv\\Scripts\\python on Windows)"
echo "  3. Reload VS Code window (Ctrl+Shift+P → 'Developer: Reload Window')"
echo "  4. Pylance warnings will disappear"