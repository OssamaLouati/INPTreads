import mongoose from 'mongoose';
import User from './user.model'; // Adjust the import path as necessary
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('User Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.deleteMany({});
  });

  test('create & save user successfully', async () => {
    const validUser = new User({
      id: '123',
      username: 'testuser',
      name: 'Test User',
      image: 'testimage.jpg',
      bio: 'Test Bio',
      // Add threads and communities with valid ObjectId if necessary
      onboarded: true,
    });
    const savedUser = await validUser.save();

    // Assertions
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.onboarded).toBe(true);
    // Add more assertions as necessary
  });

  test('insert user successfully, but field not defined in schema should be undefined', async () => {
    const userWithInvalidField = new User({
      id: '123',
      username: 'testuser2',
      name: 'Test User',
      nickname: 'Tester', // This field is not defined in the schema
    });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.nickname).toBeUndefined();
  });

  test('create user without required field should fail', async () => {
    const userWithoutRequiredField = new User({ name: 'Test User' });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.username).toBeDefined();
  });

});
