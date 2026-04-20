import { useState, useEffect } from "react";

interface Genre {
  id: number;
  name: string;
}

function AddGameForm() {
  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState("");
  const [price, setPrice] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [studio, setStudio] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:5129/genres");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newGame = {
      name,
      genreId: parseInt(genreId),
      price: parseFloat(price),
      releaseDate,
      studio,
    };

    try {
      const response = await fetch("http://localhost:5129/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        // reload the page to see the new game
        window.location.reload();
      } else {
        console.error("Failed to add game");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Game</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Genre:</label>
        <select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
          <option value="">Select a genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <label>Release Date:</label>
        <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
      </div>
      <div>
        <label>Studio:</label>
        <input type="text" value={studio} onChange={(e) => setStudio(e.target.value)} required />
      </div>
      <button type="submit">Add Game</button>
    </form>
  );
}

export default AddGameForm;
