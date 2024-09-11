import "./App.css";
import { useMovies } from "./hocks/useMovies";
import { Movies } from "./components/Movies";
import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }

    if (search.match(/^\+$/)) {
      setError("No se puede buscar una pelicula con numeros");
      return;
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debounceGetMovies = useCallback(
    debounce((search) => {
      console.log("search", search);
      getMovies({ search });
    }, 300),
    [getMovies]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    getMovies();
  };

  const handleChange = (e) => {
    const newSearch = e.target.value;
    updateSearch(newSearch);
    debounceGetMovies(newSearch);
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <>
      <div className="page">
        <header>
          <h1>Peliculas </h1>
          <form onSubmit={handleSubmit}>
            <input
              name="query"
              value={search}
              onChange={handleChange}
              placeholder="Buscar la pelicula ..."
            />
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <button>Buscar</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </header>

        <main>
          {loading ? <p>Cargando ...</p> : <Movies movies={movies} />}
        </main>
      </div>
    </>
  );
}

export default App;
