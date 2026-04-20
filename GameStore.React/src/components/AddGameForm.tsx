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
    <form onSubmit={handleSubmit} noValidate>
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
          <label htmlFor="releaseDate">Release Date</label>
          <input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
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
      </div>

      <div className="form-submit">
        <button type="submit">Add Game</button>
        {errors.general && <span className="field-error" role="alert">{errors.general}</span>}
      </div>
    </form>
  );
}

export default AddGameForm;