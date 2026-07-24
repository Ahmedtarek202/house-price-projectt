from fastapi import APIRouter

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import request_to_dataframe
from app.services.inference import predict_price

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    df_row = request_to_dataframe(req)
    price = predict_price(df_row)
    return PredictionResponse(predicted_price=round(price, 2))
