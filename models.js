import mongoose from 'mongoose';

// Connect to MongoDB Atlas - Replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/websharer?retryWrites=true&w=majority';

// Try to connect, but don't crash if it fails
mongoose.connect(MONGODB_URI).catch(err => {
    console.log('MongoDB connection failed:', err.message);
    console.log('Please set up MongoDB Atlas and update the MONGODB_URI in models.js');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Define Post schema
const postSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    }
});

// Create Post model
const Post = mongoose.model('Post', postSchema);

// Export models object
const models = {
    Post: Post
};

export default models;
