import { useState } from "react";
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

function AddGameForm({ genres, genresError, onGameAdded }: Props) {
  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState("");
  const [price, setPrice] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [studio, setStudio] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    try {
      const response = await fetch(`${API_BASE}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          genreId: parseInt(genreId),
          price: parseFloat(price),
          releaseDate,
          studio,
        }),
      });

      if (response.ok) {
        setName("");
        setGenreId("");
        setPrice("");
        setReleaseDate("");
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
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError("name"); }}
            placeholder="e.g. No Man's Sky"
            className={errors.name ? "input-error" : ""}
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label>Genre</label>
          <select
            value={genreId}
            onChange={(e) => { setGenreId(e.target.value); clearError("genreId"); }}
            className={errors.genreId ? "input-error" : ""}
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
          {errors.genreId && <span className="field-error">{errors.genreId}</span>}
        </div>

        <div className="form-field">
          <label>Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); clearError("price"); }}
            placeholder="e.g. 59.99"
            min="0"
            step="0.01"
            className={errors.price ? "input-error" : ""}
            required
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-field">
          <label>Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Studio</label>
          <input
            type="text"
            value={studio}
            onChange={(e) => { setStudio(e.target.value); clearError("studio"); }}
            placeholder="e.g. Hello Games"
            className={errors.studio ? "input-error" : ""}
            required
          />
          {errors.studio && <span className="field-error">{errors.studio}</span>}
        </div>
      </div>

      <div className="form-submit">
        <button type="submit">Add Game</button>
        {errors.general && <span className="field-error">{errors.general}</span>}
      </div>
    </form>
  );
}

export default AddGameForm;