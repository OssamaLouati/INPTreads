import mongoose from 'mongoose';
import { connectToDB } from './mongoose';

// Mocking mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  set: jest.fn(),
}));

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    process.env.MONGODB_URL = 'mongodb://example.com';
    await connectToDB();
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
  });

  it('should not connect if MongoDB URL is missing', async () => {
    delete process.env.MONGODB_URL;
    console.log = jest.fn();
    await connectToDB();
    expect(console.log).toHaveBeenCalledWith('Missing MongoDB URL');
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('should not connect if already connected', async () => {
    process.env.MONGODB_URL = 'mongodb://example.com';
    // Mock isConnected as true
    require('./mongoose').isConnected = true;
    console.log = jest.fn();
    await connectToDB();
    expect(console.log).toHaveBeenCalledWith('MongoDB connection already established');
    expect(mongoose.connect).not.toHaveBeenCalled();
  });
});
