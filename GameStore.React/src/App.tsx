import { useEffect, useState } from "react";
import "./App.css";
import AddGameForm from "./components/AddGameForm";
import ConfirmModal from "./components/ConfirmModal";
import type { Game, Genre } from "./types";
import { API_BASE } from "./constants";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [gamesError, setGamesError] = useState(false);
  const [genresError, setGenresError] = useState(false);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);

  const refreshGames = async () => {
    try {
      const response = await fetch(`${API_BASE}/games`);
      setGames(await response.json());
    } catch {
      setGamesError(true);
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_BASE}/games`);
        setGames(await response.json());
      } catch {
        setGamesError(true);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE}/genres`);
        setGenres(await response.json());
      } catch {
        setGenresError(true);
      }
    };

    fetchGames();
    fetchGenres();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingGame) return;
    try {
      await fetch(`${API_BASE}/games/${deletingGame.id}`, { method: "DELETE" });
      setDeletingGame(null);
      refreshGames();
    } catch {
      console.error("Failed to delete game.");
    }
  };

  return (
    <div>
      <div className="app-header">
        <h1>Game Store</h1>
        <p>Manage your game catalog</p>
      </div>

      <div className="card">
        <h2>Add Game</h2>
        <AddGameForm
          genres={genres}
          genresError={genresError}
          onGameAdded={refreshGames}
        />
      </div>

      <div className="card">
        <h2>Games ({games.length})</h2>
        {gamesError ? (
          <p className="empty-state">Could not load games. Is the API running?</p>
        ) : games.length === 0 ? (
          <p className="empty-state">No games yet. Add one above.</p>
        ) : (
          <table className="games-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Studio</th>
                <th>Release Date</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>{game.name}</td>
                  <td>{game.genre}</td>
                  <td>{game.studio}</td>
                  <td>{new Date(game.releaseDate).toLocaleDateString()}</td>
                  <td className="price-cell">${game.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-delete-row"
                      onClick={() => setDeletingGame(game)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deletingGame && (
        <ConfirmModal
          message={`Delete "${deletingGame.name}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingGame(null)}
        />
      )}
    </div>
  );
}

export default App;