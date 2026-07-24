import joblib
import numpy as np
import pandas as pd

from app.core.config import settings

_model = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(settings.model_path)
    return _model


def predict_price(df_row: pd.DataFrame) -> float:
    model = load_model()
    pred_log = model.predict(df_row)[0]
    # the model was trained on log1p(price), so invert it here
    return float(np.expm1(pred_log))
