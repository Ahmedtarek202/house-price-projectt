import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PredictionForm from "../components/PredictionForm";
import { predictPrice } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(payload: PredictionRequest) {
    setLoading(true);
    setError("");
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { price: result.predicted_price } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <span className="eyebrow">Property valuation</span>
        <h1>What's this property worth?</h1>
        <p>Enter the details below and get an instant estimate from the trained model.</p>
      </header>

      <PredictionForm onSubmit={handleSubmit} loading={loading} />
      {error && <p className="pf-error pf-error-banner">{error}</p>}
    </div>
  );
}
