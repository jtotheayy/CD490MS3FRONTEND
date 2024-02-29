//Jay Santamaria CS 490 02/08/2024
//Inidividual Project
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Movies from './Movies';
import Home from './Home';
import Customers from './Customers'
import useUserData from './useUserData';

function App() {
  const { topMovies, topActors, additionalInfo, additionalInfoType, selectedActorName, top5Movies, clickRes } = useUserData();

  return (
    <Router>
      <div>
        <header className="header">
          <div className="logo">SAKILA</div>
          <nav className="nav">
            <Link to="/" className="button">Home</Link>
            <Link to="/movies" className="button">Movies</Link>
            <Link to="/customers" className="button">Customers</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/movies" element={<Movies />} />
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
