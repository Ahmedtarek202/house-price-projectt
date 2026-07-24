import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page result-page">
      <span className="eyebrow">404</span>
      <p className="result-price" style={{ fontSize: "3rem" }}>
        Page not found
      </p>
      <Link className="pf-submit result-back" to="/">
        Back to the estimator
      </Link>
    </div>
  );
}
