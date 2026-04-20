import { useEffect, useState } from "react";
import "./App.css";
import GenresList from "./components/GenresList";
import AddGameForm from "./components/AddGameForm";

interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
  studio: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5129/games");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Game Store</h1>
      <AddGameForm />
      <div>
        <h2>Games</h2>
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.name} - {game.genre} - ${game.price}
            </li>
          ))}
        </ul>
      </div>
      <GenresList />
    </div>
  );
}

export default App;
