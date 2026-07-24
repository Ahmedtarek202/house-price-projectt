# House Price Prediction — End-to-End ML Web App

An end-to-end machine learning product: a Jupyter notebook cleans real property
listing data and trains a regression model, a FastAPI backend serves that model,
and a React + TypeScript frontend lets a user enter property details and get an
instant price estimate.

## Overview

1. **`notebooks/house_price_model.ipynb`** — loads the raw Kaggle CSV, cleans messy
   text fields (price, area, floor), explores the data, trains and compares three
   regression models, and exports the winner as `house_price.pkl`.
2. **`backend/`** — a FastAPI app that loads `house_price.pkl` once at startup and
   exposes `POST /predict`.
3. **`frontend/`** — a React + Vite app with a form for property details that calls
   the backend and shows the estimated price.

## Architecture

```
┌────────────────┐        POST /predict        ┌───────────────────┐        joblib.load        ┌────────────────────┐
│   React (Vite)  │ ───────────────────────────▶ │  FastAPI backend   │ ─────────────────────────▶ │  house_price.pkl     │
│  localhost:5173 │ ◀─────────────────────────── │  localhost:8000    │                            │  (sklearn Pipeline)  │
└────────────────┘        JSON response          └───────────────────┘                            └────────────────────┘
                                                                                                              ▲
                                                                                                              │ joblib.dump
                                                                                                     ┌────────────────────┐
                                                                                                     │  Jupyter notebook   │
                                                                                                     │  (training, once)   │
                                                                                                     └────────────────────┘
```

## Tech stack

| Layer     | Tech                                                             |
|-----------|-------------------------------------------------------------------|
| Modeling  | Python, pandas, scikit-learn (Pipeline + ColumnTransformer), joblib |
| Backend   | FastAPI, Pydantic, Uvicorn                                        |
| Frontend  | React 19, TypeScript, Vite, React Router                          |

## Project structure

```
house-price-project/
├── notebooks/
│   ├── data/house_prices.csv        # NOT committed — download it yourself (see below)
│   └── house_price_model.ipynb
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app, CORS, model loaded at startup
│   │   ├── api/routes/prediction.py # GET /health, POST /predict
│   │   ├── core/config.py           # Settings from .env
│   │   ├── schemas/prediction.py    # Request/response models
│   │   └── services/
│   │       ├── preprocessing.py     # Turns a request into a one-row DataFrame
│   │       └── inference.py         # Loads .pkl, runs predict
│   ├── models/house_price.pkl       # Copied from the notebook output
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/predictionClient.ts
    │   ├── components/PredictionForm.tsx
    │   ├── pages/HomePage.tsx | ResultPage.tsx | NotFoundPage.tsx
    │   ├── types/prediction.ts
    │   └── App.tsx
    └── .env.example
```

## Dataset

**House Price** by Juhi Bhojani — https://www.kaggle.com/datasets/juhibhojani/house-price
(~187,000 real property listings from India).

Download it (requires a free Kaggle account) and place the CSV at
`notebooks/data/house_prices.csv`:

```bash
pip install kaggle
# Kaggle → Settings → API → "Create New Token", then place kaggle.json in
# ~/.kaggle/ (macOS/Linux) or C:\Users\<you>\.kaggle\ (Windows)
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

> This repo ships with a small **synthetic placeholder** CSV (same column names)
> so the notebook, backend and frontend can be run and verified before you
> download the real dataset. Replace it, then re-run the notebook top-to-bottom.

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
# open http://localhost:8000/docs
```

Run tests:

```bash
pytest tests/ -v
```

### Backend environment variables

| Variable         | Default                    | Purpose                              |
|-------------------|-----------------------------|---------------------------------------|
| `MODEL_PATH`      | `models/house_price.pkl`   | Path to the exported pipeline          |
| `LOCATIONS_PATH`  | `models/locations.json`    | Allowed location list                  |
| `ALLOWED_ORIGIN`  | `http://localhost:5173`    | CORS origin allowed to call the API    |

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# open http://localhost:5173
```

### Frontend environment variables

| Variable              | Default                  | Purpose                  |
|------------------------|---------------------------|---------------------------|
| `VITE_API_BASE_URL`    | `http://localhost:8000`  | Base URL of the FastAPI backend |

## API reference

**`GET /health`**

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

**`POST /predict`**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Sector 1, City 1",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "car_parking": 1,
    "furnishing": "Furnished",
    "transaction": "New Property",
    "ownership": "Freehold",
    "facing": "East"
  }'
# {"predicted_price": 2816354.68}
```

## Model metrics

Metrics below are from the notebook's train/test split (see `metrics.json`,
re-generated automatically each time the notebook is run). **These numbers are
from the placeholder synthetic dataset** — re-run the notebook on the real
Kaggle CSV and update this table before submitting.

| Model            | MAE       | RMSE      | R²   |
|-------------------|-----------|-----------|------|
| Winning model      | see `notebooks/metrics.json` after running on the real dataset |

## Screenshots

Run the app locally (backend + frontend) and add screenshots of the form and
result page here before submitting.

## Common pitfalls

- Committing `.env` or the raw dataset CSV.
- scikit-learn version mismatch between the notebook and `backend/requirements.txt`
  (check with `python -c "import sklearn; print(sklearn.__version__)"`).
- Hard-coding `http://localhost:8000` in frontend components instead of using
  `VITE_API_BASE_URL`.
