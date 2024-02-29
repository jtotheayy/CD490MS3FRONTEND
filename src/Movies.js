//Jay Santamaria CS 490 02/08/2024
//Inidividual Project

import React, { useState, useEffect } from 'react';

function MoviesPage() {
  const [searchName, setSearchName] = useState('');
  const [searchActor, setSearchActor] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [customerID, setCustomerID] = useState('');
  const [showRentModal, setShowRentModal] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data.slice(0, 20));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      let url = "/api/movies?";
      if (searchName) {
        url += `name=${encodeURIComponent(searchName)}`;
      } else if (searchActor) {
        url += `actor=${encodeURIComponent(searchActor)}`;
      } else if (searchGenre) {
        url += `genre=${encodeURIComponent(searchGenre)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setFilteredMovies(data);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };
 
  const handleCheckAvailability = (movie) => {
    setSelectedMovie(movie);
    setShowRentModal(true);
  };

  const handleRentMovie = async () => {
    console.log(selectedMovie);

    try {
      if (!selectedMovie) {
        alert("No movie selected");
        return;
      }
  
      if (!customerID) {
        alert("Please enter a customer ID");
        return;
      }
  
      const response = await fetch(`/api/rent/${selectedMovie.film_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerID }),
      });
  
      if (response.ok) {
        alert("Movie rented successfully!");
        setShowRentModal(false);
      } else {
        const data = await response.json();
        alert(`Error renting movie: ${data.error}`);
      }
    } catch (error) {
      console.error("Error renting movie:", error);
      alert("Error renting movie. Please try again.");
    }
  };
  
  

  return (
    <div className="search">
      <h1>Movies</h1>
      <form onSubmit={handleSearchSubmit}>
        <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search movies by Name..." />
        <input type="text" value={searchActor} onChange={(e) => setSearchActor(e.target.value)} placeholder="Search movies by Actor..." />
        <input type="text" value={searchGenre} onChange={(e) => setSearchGenre(e.target.value)} placeholder="Search movies by Genre..." />
        <button type="submit">Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Release Year</th>
            <th>Rental Rate</th>
            <th>Rating</th>
            <th>Special Features</th>
            <th>Actor</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie) => (
            <tr key={movie.id}>
              <td>
                <button onClick={() => handleCheckAvailability(movie)}>
                  {movie.title}
                </button>
              </td>
              <td>{movie.description}</td>
              <td>{movie.release_year}</td>
              <td>{movie.rental_rate}</td>
              <td>{movie.rating}</td>
              <td>{movie.special_features}</td>
              <td>{movie.actor_first_name} {movie.actor_last_name}</td>
              <td>{movie.film_genre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showRentModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowRentModal(false)}>&times;</span>
            <h2>Rent Movie</h2>
            <p>Title: {selectedMovie && selectedMovie.title}</p>
            <p>Description: {selectedMovie && selectedMovie.description}</p>
            <p>Rental Rate: {selectedMovie && selectedMovie.rental_rate}</p>
            <label htmlFor="customerId">Enter Customer ID:</label>
            <input type="text" id="customerId" value={customerID} onChange={(e) => setCustomerID(e.target.value)} />
            <button onClick={handleRentMovie}>Rent</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
