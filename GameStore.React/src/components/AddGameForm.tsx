import { useState } from "react";
import type { Genre } from "../types";
import { API_BASE } from "../constants";

interface Props {
  genres: Genre[];
  genresError: boolean;
  onGameAdded: () => void;
}

function AddGameForm({ genres, genresError, onGameAdded }: Props) {
  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState("");
  const [price, setPrice] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [studio, setStudio] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      } else {
        console.error("Failed to add game:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. No Man's Sky"
            required
          />
        </div>

        <div className="form-field">
          <label>Genre</label>
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
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
        </div>

        <div className="form-field">
          <label>Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 59.99"
            min="0"
            step="0.01"
            required
          />
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
            onChange={(e) => setStudio(e.target.value)}
            placeholder="e.g. Hello Games"
            required
          />
        </div>
      </div>

      <div className="form-submit">
        <button type="submit">Add Game</button>
      </div>
    </form>
  );
}

export default AddGameForm;
