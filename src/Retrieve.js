import React, { useState, useEffect } from 'react';
import './App.css';

const LandingPage = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [topActors, setTopActors] = useState([]);

  useEffect(() => {
    fetch("/api/topmovies")
      .then((res) => res.json())
      .then((data) => {
        console.log("Top Movies Data:", data);
        setTopMovies(data);
      })
      .catch((error) => console.error("Error fetching top movies:", error));
  
    fetch("/api/topactors")
      .then((res) => res.json())
      .then((data) => {
        console.log("Top Actors Data:", data);
        setTopActors(data);
      })
      .catch((error) => console.error("Error fetching top actors:", error));
  }, []);

  console.log("Top Actors:", topActors);
  console.log("Top Movies:", topMovies);
  

  return (
    <div>
      <div className='topFilms'>
        <h2>Top 5 movies rented</h2>
        <ol>
          {topMovies.map((movie, index) => (
            <li key={index} className='item'>{movie.title}</li>
          ))}
        </ol>
      </div>

      <div className='topActors'>
        <h2>Top 5 actors</h2>
        <ol>
          {topActors.map((actor, index) => (
            <li key={index} className='item'>{actor.name}</li>
          ))}
        </ol>
      </div>
      {/* Add your other page content here */}
    </div>
  );


};

export default LandingPage;
