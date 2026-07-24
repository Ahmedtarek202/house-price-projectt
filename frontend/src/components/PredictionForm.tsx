import { useEffect, useState, type FormEvent } from "react";
import { getLocations } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

interface Props {
  onSubmit: (payload: PredictionRequest) => void;
  loading: boolean;
}

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Cooperative society"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North - East"];

export default function PredictionForm({ onSubmit, loading }: Props) {
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsError, setLocationsError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<PredictionRequest>({
    location: "",
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 1,
    balcony: 0,
    car_parking: 0,
    furnishing: FURNISHING_OPTIONS[0],
    transaction: TRANSACTION_OPTIONS[0],
    ownership: OWNERSHIP_OPTIONS[0],
    facing: FACING_OPTIONS[0],
  });

  useEffect(() => {
    getLocations()
      .then((locs) => {
        setLocations(locs);
        setForm((f) => ({ ...f, location: locs[0] ?? "" }));
      })
      .catch(() => setLocationsError("Couldn't load the locations list."));
  }, []);

  function update<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.location) next.location = "Choose a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0)
      next.carpet_area_sqft = "Area must be greater than 0.";
    if (form.floor_num < -1) next.floor_num = "Floor looks invalid.";
    if (form.bathroom < 0) next.bathroom = "Bathrooms can't be negative.";
    if (form.balcony < 0) next.balcony = "Balconies can't be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  return (
    <form className="pf-form" onSubmit={handleSubmit} noValidate>
      <div className="pf-grid">
        <label className="pf-field">
          <span>Location</span>
          <select
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {locationsError && <small className="pf-error">{locationsError}</small>}
          {errors.location && <small className="pf-error">{errors.location}</small>}
        </label>

        <label className="pf-field">
          <span>Carpet area (sqft)</span>
          <input
            type="number"
            min={1}
            value={form.carpet_area_sqft || ""}
            onChange={(e) => update("carpet_area_sqft", Number(e.target.value))}
          />
          {errors.carpet_area_sqft && <small className="pf-error">{errors.carpet_area_sqft}</small>}
        </label>

        <label className="pf-field">
          <span>Floor</span>
          <input
            type="number"
            value={form.floor_num}
            onChange={(e) => update("floor_num", Number(e.target.value))}
          />
          {errors.floor_num && <small className="pf-error">{errors.floor_num}</small>}
        </label>

        <label className="pf-field">
          <span>Bathrooms</span>
          <input
            type="number"
            min={0}
            value={form.bathroom}
            onChange={(e) => update("bathroom", Number(e.target.value))}
          />
          {errors.bathroom && <small className="pf-error">{errors.bathroom}</small>}
        </label>

        <label className="pf-field">
          <span>Balconies</span>
          <input
            type="number"
            min={0}
            value={form.balcony}
            onChange={(e) => update("balcony", Number(e.target.value))}
          />
          {errors.balcony && <small className="pf-error">{errors.balcony}</small>}
        </label>

        <label className="pf-field">
          <span>Car parking</span>
          <input
            type="number"
            min={0}
            value={form.car_parking}
            onChange={(e) => update("car_parking", Number(e.target.value))}
          />
        </label>

        <label className="pf-field">
          <span>Furnishing</span>
          <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)}>
            {FURNISHING_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>

        <label className="pf-field">
          <span>Transaction</span>
          <select value={form.transaction} onChange={(e) => update("transaction", e.target.value)}>
            {TRANSACTION_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>

        <label className="pf-field">
          <span>Ownership</span>
          <select value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
            {OWNERSHIP_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>

        <label className="pf-field">
          <span>Facing</span>
          <select value={form.facing} onChange={(e) => update("facing", e.target.value)}>
            {FACING_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <button className="pf-submit" type="submit" disabled={loading}>
        {loading ? "Estimating…" : "Estimate price"}
      </button>
    </form>
  );
}
