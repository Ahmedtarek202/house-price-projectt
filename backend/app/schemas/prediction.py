from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str = Field(..., description="Location / area name")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., ge=-1, description="Floor number (0 = ground, -1 = basement)")
    bathroom: int = Field(..., ge=0)
    balcony: int = Field(..., ge=0)
    car_parking: int = Field(0, ge=0)
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., description="'New Property' | 'Resale'")
    ownership: str
    facing: str


class PredictionResponse(BaseModel):
    predicted_price: float
