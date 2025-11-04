import mongoose from 'mongoose';

// Connect to MongoDB Atlas - Replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/websharer?retryWrites=true&w=majority';

// Connection options to prevent timeout errors
const mongooseOptions = {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    connectTimeoutMS: 30000, // 30 seconds
    // Note: bufferCommands defaults to true, which allows Mongoose to queue operations
    // until connection is established. This prevents errors when operations are called
    // before connection completes.
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions).catch(err => {
    console.log('MongoDB connection failed:', err.message);
    console.log('Please set up MongoDB Atlas and update the MONGODB_URI environment variable');
    console.log('Make sure MONGODB_URI is set in your deployment platform (Render/Azure)');
});

const db = mongoose.connection;

// Connection event handlers
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Helper function to wait for MongoDB connection
export const waitForConnection = () => {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            // Already connected
            resolve();
            return;
        }
        
        if (mongoose.connection.readyState === 0) {
            // Not connected yet, wait for connection
            db.once('open', () => resolve());
            db.once('error', (err) => reject(err));
            
            // Timeout after 30 seconds
            setTimeout(() => {
                reject(new Error('MongoDB connection timeout after 30 seconds'));
            }, 30000);
        } else {
            // Connecting or disconnecting
            db.once('open', () => resolve());
            db.once('error', (err) => reject(err));
        }
    });
};

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
