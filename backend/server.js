require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://food-ordering-system-imn3.vercel.app', // your frontend Vercel URL
  credentials: true
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Mongoose schemas and models
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const ownerSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    restaurantName: { type: String, unique: true, required: false },
    address: { type: String, required: false },
    openingHours: { type: String, required: false },
    cuisineType: { type: String, required: false },
    restaurantImage: { type: String }
});

const Owner = mongoose.model('Owner', ownerSchema);

const foodItemSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    itemName: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: Number, required: true },
    category: { type: String, required: false },
    available: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    imageUrl: { type: String, required: false },
    cuisineType: { type: String, required: false } // New field
});


const FoodItem = mongoose.model('FoodItem', foodItemSchema);


// Route for user signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up user', error });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Owner signup route
app.post('/owner/signup', async (req, res) => {
    const { email, password, restaurantName, address, openingHours, cuisineType, restaurantImage } = req.body;
    try {
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ message: 'Owner already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new Owner({ email, password: hashedPassword, restaurantName, address, openingHours, cuisineType,restaurantImage });
        await newOwner.save();
        res.status(200).json({ message: 'Owner signed up successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up owner', error });
    }
});


// Route for owner login
app.post('/owner/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: owner.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, email: owner.email, restaurantName: owner.restaurantName });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Route to add food item
app.post('/owner/add-food', async (req, res) => {
    const { restaurantName, itemName, description, cost, imageUrl } = req.body;
    try {
        const foodItem = new FoodItem({ restaurantName, itemName, description, cost, imageUrl });
        await foodItem.save();
        res.status(200).json({ message: 'Food item added successfully', foodItem });
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ message: 'Error adding food item', error });
    }
});


// Route to get food items by restaurant name
app.get('/food-items/:restaurantName', async (req, res) => {
    const { restaurantName } = req.params;
    try {
        const foodItems = await FoodItem.find({ restaurantName });
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food items', error });
    }
});

// Route to get all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    // grab the owner’s _id too
    const owners = await Owner.find({}, 'restaurantName restaurantImage');
    const restaurants = owners.map(owner => ({
      _id: owner._id,                 // add this
      name: owner.restaurantName,
      image: owner.restaurantImage || 'https://via.placeholder.com/150'
    }));
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
});


app.post('/food-item/rate', async (req, res) => {
    const { itemName, rating } = req.body;
    try {
        const foodItem = await FoodItem.findOne({ itemName });
        if (foodItem) {
            // Update rating calculation
            const totalRating = foodItem.rating * (foodItem.ratingCount || 0) + rating;
            foodItem.ratingCount = (foodItem.ratingCount || 0) + 1;
            foodItem.rating = totalRating / foodItem.ratingCount;

            await foodItem.save();
            res.status(200).json({ message: 'Rating added successfully', foodItem });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding rating', error });
    }
});

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    itemName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    date: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

app.get('/search', async (req, res) => {
    const { cuisine, minCost, maxCost } = req.query;
    try {
        const query = {};
        if (cuisine) query.cuisine = cuisine;
        if (minCost) query.cost = { $gte: minCost };
        if (maxCost) query.cost = { ...query.cost, $lte: maxCost };

        const foodItems = await FoodItem.find(query);
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: 'Error searching food items', error });
    }
});

app.post('/food-item/review', async (req, res) => {
    const { user, itemName, comment, rating } = req.body;
    try {
        const newReview = new Review({ user, itemName, comment, rating });
        await newReview.save();
        res.status(200).json({ message: 'Review added successfully', newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
});
// Route to delete a food item
app.delete('/food-item/:id', async (req, res) => {
    console.log("DELETE request received for ID:", req.params.id); // Log the ID received
    const { id } = req.params;
    try {
        const deletedItem = await FoodItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json({ message: 'Food item deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting food item', error });
    }
});


app.delete('/owner/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOwner = await Owner.findByIdAndDelete(id);
        if (!deletedOwner) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        res.status(200).json({ message: 'Owner deleted successfully', deletedOwner });
    } catch (error) {
        console.error('Error deleting owner:', error);
        res.status(500).json({ message: 'Error deleting owner', error });
    }
});

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Example Express route for deleting a food item
app.delete('/owner/delete-food/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        // Logic to delete the food item from the database
        const result = await FoodItem.findByIdAndDelete(itemId); // Adjust according to your model

        if (!result) {
            return res.status(404).send({ message: 'Food item not found' });
        }

        res.status(200).send({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting food item', error });
    }
});

// Example Express route for deleting an owner account

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.delete('/owner/delete-account', authenticateToken, async (req, res) => {
    const ownerId = req.user.id; // Assuming you have middleware to get the logged-in owner's ID

    try {
        // Check if the owner exists
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).send({ message: 'Owner account not found' });
        }

        // Delete all food items associated with the owner account
        const deletedFoodItems = await FoodItem.deleteMany({ owner: ownerId });

        // Then delete the owner account
        await Owner.findByIdAndDelete(ownerId);

        res.status(200).send({ 
            message: 'Account and all food items deleted successfully',
            deletedFoodItems: deletedFoodItems.deletedCount,
            deletedOwnerId: ownerId
        });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).send({ message: 'Error deleting account', error: error.message });
    }
});

// Order Schema remains the same
const OrderSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  itemName:       { type: String, required: true },
  cost:           { type: Number, required: true },
  description:    { type: String },
  imageUrl:       { type: String },
  quantity:       { type: Number, required: true },    // <-- new
  status:         { type: String, enum: ['pending','completed'], default: 'pending' },
  userEmail:      { type: String, required: true },
  date:           { type: Date, default: Date.now }
});

const OrderItem = mongoose.model('OrderItem', OrderSchema);
app.post('/order-food', authenticateToken, async (req, res) => {
  const { restaurantName, itemName, description, cost, imageUrl, quantity } = req.body;
  const userEmail = req.user.email;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const orderItem = new OrderItem({
      restaurantName,
      itemName,
      description,
      cost,
      imageUrl,
      quantity,            // <-- store it
      userEmail
    });
    await orderItem.save();
    res.status(200).json({ message: 'Food item ordered successfully', orderItem });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  }
});
    
// Endpoint for owner to mark an order as completed
app.put('/owner/complete-order/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        const result = await OrderItem.findByIdAndUpdate(
            itemId,
            { status: 'completed' },
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ message: 'Food item not found' });
        }

        res.status(200).send({ message: 'Order marked as completed successfully', order: result });
    } catch (error) {
        res.status(500).send({ message: 'Error completing the order', error });
    }
});

// New endpoint for users to get their orders with the status
app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await OrderItem.find({ userEmail: req.user.email }); // Filter orders by user email
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching orders', error });
    }
});

// Backend route to get orders for a specific restaurant
app.get('/owner/orders/:restaurantName', async (req, res) => {
    const { restaurantName } = req.params;
    try {
        // Retrieve orders for the specified restaurant where status is not 'completed'
        const orders = await OrderItem.find({ restaurantName, status: { $ne: 'completed' } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});




// ==== Backend: Add Admin model & routes ==== 

// 1. Define Admin schema/model
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// 2. Seed one admin (run once or via an admin setup script)
(async () => {
  const existing = await Admin.findOne({ username: process.env.ADMIN_USER });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    await Admin.create({ username: process.env.ADMIN_USER, password: hashed });
    console.log('Admin user created');
  }
})();

// 3. Admin login route (no link in UI):
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Logged in', token });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err });
  }
});

// 4. Admin auth middleware
const authenticateAdmin = (req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.sendStatus(401);
  jwt.verify(auth, process.env.JWT_SECRET, (err, payload) => {
    if (err || payload.role !== 'admin') return res.sendStatus(403);
    req.admin = payload;
    next();
  });
};

// 5. Admin delete routes
// Delete any restaurant (owner)
app.delete('/admin/restaurant/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedOwner = await Owner.findByIdAndDelete(req.params.id);
    await FoodItem.deleteMany({ restaurantName: deletedOwner.restaurantName });
    res.json({ message: 'Restaurant deleted', deletedOwner });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err });
  }
});

// Delete any user
app.delete('/admin/user/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted', deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
