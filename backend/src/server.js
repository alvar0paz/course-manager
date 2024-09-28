const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 5001;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursemanager';

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', mongoURI);

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Successfully connected to MongoDB');


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch(err => {
  console.error('Failed to connect to MongoDB');
  console.error('Error details:', err);
  process.exit(1);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
