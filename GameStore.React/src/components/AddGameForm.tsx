import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Genre } from "../types";
import { API_BASE } from "../constants";

interface Props {
  genres: Genre[];
  genresError: boolean;
  onGameAdded: () => void;
}

interface FormErrors {
  name?: string;
  genreId?: string;
  price?: string;
  studio?: string;
  general?: string;
}

function toApiDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function AddGameForm({ genres, genresError, onGameAdded }: Props) {
  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [studio, setStudio] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (!selectedDate) {
      setErrors({ general: "Please select a release date." });
      return;
    }

    try {

      const response = await fetch(`${API_BASE}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          genreId: parseInt(genreId),
          price: parseFloat(price),
          releaseDate: toApiDate(selectedDate),
          studio,
        }),
      });

      if (response.ok) {
        setName("");
        setGenreId("");
        setPrice("");
        setSelectedDate(undefined);
        setStudio("");
        onGameAdded();
      } else if (response.status === 400) {
        const body = await response.json();
        const apiErrors = body.errors as Record<string, string[]>;
        setErrors({
          name: apiErrors?.Name?.[0],
          genreId: apiErrors?.GenreId?.[0],
          price: apiErrors?.Price?.[0],
          studio: apiErrors?.Studio?.[0],
        });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ general: "Could not reach the API. Is the server running?" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError("name"); }}
            placeholder="e.g. No Man's Sky"
            className={errors.name ? "input-error" : ""}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
          {errors.name && <span id="name-error" className="field-error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => { setGenreId(e.target.value); clearError("genreId"); }}
            className={errors.genreId ? "input-error" : ""}
            aria-describedby={errors.genreId ? "genre-error" : undefined}
            required
          >
            {genresError ? (
              <option value="" disabled>API not reachable</option>
            ) : (
              <>
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.genreId && <span id="genre-error" className="field-error" role="alert">{errors.genreId}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); clearError("price"); }}
            placeholder="e.g. 59.99"
            min="0"
            step="0.01"
            className={errors.price ? "input-error" : ""}
            aria-describedby={errors.price ? "price-error" : undefined}
            required
          />
          {errors.price && <span id="price-error" className="field-error" role="alert">{errors.price}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="studio">Studio</label>
          <input
            id="studio"
            type="text"
            value={studio}
            onChange={(e) => { setStudio(e.target.value); clearError("studio"); }}
            placeholder="e.g. Hello Games"
            className={errors.studio ? "input-error" : ""}
            aria-describedby={errors.studio ? "studio-error" : undefined}
            required
          />
          {errors.studio && <span id="studio-error" className="field-error" role="alert">{errors.studio}</span>}
        </div>

        <div className="form-field date-field" ref={pickerRef}>
          <label htmlFor="release-date-btn">Release Date</label>
          <button
            id="release-date-btn"
            type="button"
            className="date-toggle"
            onClick={() => setShowPicker((v) => !v)}
            aria-expanded={showPicker}
            aria-haspopup="dialog"
          >
            {selectedDate
              ? selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              : "Select a date"}
          </button>
          {showPicker && (
            <div className="date-picker-popup" role="dialog" aria-label="Date picker">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setShowPicker(false); }}
                captionLayout="dropdown"
                startMonth={new Date(1970, 0)}
                endMonth={new Date(new Date().getFullYear() + 5, 11)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-submit">
        <button type="submit">Add Game</button>
        {errors.general && <span className="field-error" role="alert">{errors.general}</span>}
      </div>
    </form>
  );
}

export default AddGameForm;