import json

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

with open(settings.locations_path) as f:
    ALLOWED_LOCATIONS = set(json.load(f))


def request_to_dataframe(req: PredictionRequest) -> pd.DataFrame:
    """Build a one-row DataFrame with exactly the column names used in training.
    Unknown locations are mapped to 'other' (same as the notebook's grouping step).
    """
    location_grouped = req.location if req.location in ALLOWED_LOCATIONS else "other"

    row = {
        "carpet_area_sqft": req.carpet_area_sqft,
        "floor_num": req.floor_num,
        "bathroom": req.bathroom,
        "balcony": req.balcony,
        "car_parking": req.car_parking,
        "location_grouped": location_grouped,
        "Furnishing": req.furnishing,
        "Transaction": req.transaction,
        "Ownership": req.ownership,
        "facing": req.facing,
    }
    return pd.DataFrame([row])
