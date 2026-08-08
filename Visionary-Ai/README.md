Visionary AI – AI Image Caption Generator

A full-stack AI application that accepts an uploaded image and generates multiple caption variations. Built as part of my CODSOFT internship.

Status: Runs successfully in a local development environment. Not publicly deployed — see Current Status.

🧠 What It Does

Upload an image → BLIP generates a base caption → Gemini enhances it into four distinct styles: Professional, Creative, Detailed, Social Media.

🛠️ Tech Stack

Frontend: React + Vite
Backend: Python + FastAPI 
AI/ML: Salesforce BLIP, PyTorch, Hugging Face Transformers, Google Gemini API 
Other: Pillow, python-dotenv

🔄 AI Workflow
User uploads an image (React → FastAPI)
BLIP generates the base caption
Base caption sent to Gemini
Gemini returns four stylistic variations
Results displayed in the UI

📁 Project Structure
Visionary-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── caption.py
│   │   │       └── health.py
│   │   └── services/
│   │       ├── caption_model.py
│   │       └── gemini_service.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
└── README.md
🚀 Local Setup (Windows)

Backend

bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create a .env file in backend/ with:

GEMINI_API_KEY=your_gemini_api_key

⚠️ Never commit .env or expose your API key.

Run:

bash
uvicorn main:app --reload

Docs available at http://127.0.0.1:8000/docs

Frontend (new terminal)

bash
cd frontend
npm install
npm run dev

Open the local URL shown by Vite, typically http://localhost:5173

📡 API
POST /api/v1/caption/generate

Accepts an uploaded image, returns the generated captions.

🤖 AI Models
BLIP – generates the base caption from the image
Gemini – enhances it into four stylistic variations

Gemini API key is loaded via .env — never commit it or expose it publicly.

📚 What I Learned
Full-stack AI app development (React + FastAPI)
Integrating a vision model (BLIP) and an LLM (Gemini) into one pipeline
API-key security via environment variables
Debugging AI model/API integration issues
Structuring a real app into frontend, backend, routes, and services
📌 Current Status

Visionary AI currently runs successfully in a local development environment. The project has been prepared for deployment, but the BLIP model's memory requirements are currently being evaluated for free-tier hosting.

🖼️ Screenshots
Application

(Screenshot to be added)

Generated Captions

(Screenshot to be added)

🔭 Future Improvements
Optimize model memory usage for cloud deployment
Improve caption customization options
Add additional AI models/providers
Deploy the complete application
Improve accessibility
Further UI/UX improvements
Optional authentication
Author

Developed as part of my CODSOFT internship.