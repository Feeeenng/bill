## FastAPI backend

### Setup

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

### Development server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API exposes:

- `POST /api/entries` – manual bookkeeping
- `POST /api/entries/voice` – voice-assisted bookkeeping
- `GET /api/entries?date=YYYY-MM-DD` – entries per day
- `GET /api/dashboard/daily?date=YYYY-MM-DD` – summary for dashboard widgets

Cross-origin requests are enabled for development so the React frontend can call the API from `vite` dev server.
