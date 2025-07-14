import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) return;
    fetch('https://mern-backend-b5c1.onrender.com/restaurants', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, [token]);

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`https://mern-backend-b5c1.onrender.com/admin/restaurant/${_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const { message } = await res.json();
      return alert('Delete failed: ' + message);
    }
    // remove from UI
    setRestaurants(prev => prev.filter(r => r._id !== _id));
  };

  return (
    <div className="admin-panel">
      <h2>Manage Restaurants</h2>
      <ul>
        {restaurants.map(r => (
          <li key={r._id}>
            <img src={r.image} alt={r.name} width={50} />
            <span>{r.name}</span>
            <button onClick={() => handleDelete(r._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
