//Jay Santamaria CS 490 02/08/2024
//Inidividual Project

import React, { useState, useEffect } from 'react';

function useUserData() {
    const [topMovies, setTopMovies] = useState([]);
    const [topActors, setTopActors] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState(null);
    const [additionalInfoType, setAdditionalInfoType] = useState(null);
    const [selectedActorName, setSelectedActorName] = useState(null);
    const [top5Movies, setTop5Movies] = useState([]);
  
    useEffect(() => {
      const getUserdata = async () => {
        try {
          const moviesResponse = await fetch("/api/topmovies");
          const moviesData = await moviesResponse.json();
          setTopMovies(moviesData);
  
          const actorsResponse = await fetch("/api/topactors");
          const actorsData = await actorsResponse.json();
          setTopActors(actorsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      getUserdata();
    }, []);
  
    const clickRes = async (item, type, name) => {
      try {
        const response = await fetch(`/api/${type}/${item}`);
        const data = await response.json();
  
        if (type === "movies") {
          setAdditionalInfo(data);
          setAdditionalInfoType(type);
        } else {
          setTop5Movies(data); 
          setAdditionalInfo(data);
          setAdditionalInfoType(type);
          setSelectedActorName(name); 
        }
      } catch (error) {
        console.error(`Error fetching additional ${type} info:`, error);
      }
    };
  
    return { topMovies, topActors, additionalInfo, additionalInfoType, selectedActorName, top5Movies, clickRes };
}

export default useUserData;
