//Jay Santamaria CS 490 02/08/2024
//Inidividual Project
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Movies from './Movies';
import Userdata from './Userdata';
import useUserData from './useUserData';
import App from './App';

function Home() {
    const { topMovies, topActors, additionalInfo, additionalInfoType, selectedActorName, top5Movies, clickRes } = useUserData();
  
    return (
      <div className="container">
        <div className='topFilms'>
          <h2>Top 5 movies rented</h2>
          <ol>
            {topMovies.map((movie, index) => (
              <li key={index} className='item'>
                <a href='#' onClick={() => clickRes(movie.film_id, 'movies')}>
                  {movie.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className='topActors'>
          <h2>Top 5 actors</h2>
          <ol>
            {topActors.map((actor, index) => (
              <li key={index} className='item'>
                <a href='#' onClick={() => clickRes(actor.actor_id, 'actors', actor.name)}>
                  {actor.name}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="additionalInfo">
          {additionalInfoType === 'movies' && (
            <>
              <h3>Additional Movie Info:</h3>
              <p><strong>Title:</strong> {additionalInfo.title}</p>
              <p><strong>Release Year:</strong> {additionalInfo.release_year}</p>
              <p><strong>Description:</strong> {additionalInfo.description}</p>
              <p><strong>Special Features:</strong> {additionalInfo.special_features}</p>
            </>
          )}
          {additionalInfo && additionalInfoType === 'actors' && (
            <div className="infoBox">
              {selectedActorName && (
                <h3>Selected Actor: {selectedActorName}</h3>
              )}
              <h3>Top 5 Movies:</h3>
              <ol>
                {top5Movies.map((movie, index) => (
                  <li key={index}>
                    <strong>Title:</strong> {movie.title}, <strong>Rental Count:</strong> {movie.rental_count}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }
  export default Home;