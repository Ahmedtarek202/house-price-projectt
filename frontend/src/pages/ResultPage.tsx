import { Link, useLocation, Navigate } from "react-router-dom";

function formatInr(amount: number): string {
  if (amount >= 1e7) return `₹ ${(amount / 1e7).toFixed(2)} Cr`;
  if (amount >= 1e5) return `₹ ${(amount / 1e5).toFixed(2)} Lac`;
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const price = (location.state as { price?: number } | null)?.price;

  if (price === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page result-page">
      <span className="eyebrow">Estimated value</span>
      <p className="result-price">{formatInr(price)}</p>
      <p className="result-sub">Based on the details you provided.</p>
      <Link className="pf-submit result-back" to="/">
        Estimate another property
      </Link>
    </div>
  );
}
