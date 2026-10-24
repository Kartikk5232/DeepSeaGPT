# 🌊 DeepSeaGPT

An AI-powered ocean data analyst chatbot that uses real-time **Argo float** sensor data to answer questions about the ocean — temperature, salinity, pressure, and more.

---

## 🚀 Features

- 🤖 **AI Chat** powered by Google Gemini (gemini-2.0-flash)
- 🌍 **Live Argo Float Data** — real ocean sensor readings
- 📊 **Interactive Charts** — visualize ocean metrics
- 🗺️ **Map View** — see float locations across the globe

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Google Gemini API |
| Ocean Data | Argo Float Dataset |
| Charts | Recharts |
| Map | React Leaflet |

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DeepSeaGPT.git
cd DeepSeaGPT
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the App

### Start the Backend
```bash
cd backend
venv\Scripts\uvicorn main:app --reload --port 8000
```

### Start the Frontend
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

Create a `backend/.env` file based on `backend/.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 📁 Project Structure

```
DeepSeaGPT/
├── backend/
│   ├── main.py              # FastAPI server + Gemini AI chat
│   ├── fetch_argo.py        # Argo data fetcher
│   ├── process_s3_argo.py   # Data processing
│   ├── argo_cache.json      # Cached ocean data
│   ├── .env.example         # Environment variable template
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
└── README.md
```

---

## 📜 License

MIT License — feel free to use and modify!
