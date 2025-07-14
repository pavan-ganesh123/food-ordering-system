// Restaurants.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu'; // <-- Updated
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="restaurant-list">
      {selectedRestaurant ? (
        <Menu restaurantName={selectedRestaurant} />
      ) : (
        <div>
          {restaurants.map((restaurant, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedRestaurant(restaurant.name)}
              style={{ cursor: 'pointer', marginBottom: '20px', textAlign: 'center' }}
            >
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                width="800" 
                height="500" 
                style={{ borderRadius: '8px' }} 
              />
              <h3>{restaurant.name}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Restaurants;
