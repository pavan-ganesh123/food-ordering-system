// RestaurantDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDetails = ({ restaurantName }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [orderMessage, setOrderMessage] = useState(null); // For success or error messages

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/food-items/${restaurantName}`);
                setFoodItems(response.data);
            } catch (error) {
                console.error('Error fetching food items:', error);
            }
        };
        fetchFoodItems();
    }, [restaurantName]);

    const handleOrder = async (orderData) => {
        const token = localStorage.getItem('token'); // Retrieve the token

        try {
            const response = await axios.post('http://localhost:5000/order-food', { ...orderData, userEmail: localStorage.getItem('email') }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add Authorization header
                }
            });
            setOrderMessage('Order placed successfully!'); // Set success message
            console.log('Order placed successfully:', response.data);
        } catch (error) {
            setOrderMessage('Error placing order. Please try again.'); // Set error message
            console.error('Error placing order:', error);
        }
    };

    return (
        <div>
            <h2>{restaurantName} - Menu</h2>
            {orderMessage && <p>{orderMessage}</p>} {/* Display order status message */}
            {foodItems.length > 0 ? (
                <ul>
                    {foodItems.map((item) => (
                        <li key={item._id}>
                            <img
                                src={item.imageUrl || 'https://via.placeholder.com/100'}
                                alt={item.itemName}
                                width="400"
                                height="400"

                            />
                            <h3>{item.itemName}</h3>
                            <p>{item.description}</p>
                            <p>Cost: ${item.cost}</p>
                            <button onClick={() => handleOrder(item)}>Order</button> {/* Order button */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No food items available for this restaurant.</p>
            )}
        </div>
    );
};

export default RestaurantDetails;
