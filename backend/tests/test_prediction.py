from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_predict_happy_path():
    payload = {
        "location": "Sector 1, City 1",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Furnished",
        "transaction": "New Property",
        "ownership": "Freehold",
        "facing": "East",
    }
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 200
    body = resp.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0


def test_predict_invalid_input():
    # missing required fields -> 422 Unprocessable Entity
    payload = {"location": "Sector 1, City 1"}
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 422
