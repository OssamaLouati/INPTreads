import mongoose from 'mongoose';
import Community from './community.model';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Community Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
  // Clear the database before each test
  await Community.deleteMany({});
});


  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('create & save community successfully', async () => {
    const validCommunity = new Community({
      id: '123',
      username: 'testuser',
      name: 'Test Community',
      image: 'testimage.jpg',
      bio: 'Test Bio',
    });
    const savedCommunity = await validCommunity.save();

    // Assertions
    expect(savedCommunity._id).toBeDefined();
    expect(savedCommunity.username).toBe(validCommunity.username);
    expect(savedCommunity.name).toBe(validCommunity.name);
  });

  test('insert community successfully, but the field not defined in schema should be undefined', async () => {
    const communityWithInvalidField = new Community({
      id: '123',
      username: 'testuser',
      name: 'Test Community',
      nickname: 'Tester', // This field is not defined in the schema
    });
    const savedCommunityWithInvalidField = await communityWithInvalidField.save();
    expect(savedCommunityWithInvalidField._id).toBeDefined();
    expect(savedCommunityWithInvalidField.nickname).toBeUndefined();
  });

  test('create community without required field should fail', async () => {
    const communityWithoutRequiredField = new Community({ username: 'testuser' });
    let err;
    try {
      const savedCommunityWithoutRequiredField = await communityWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });
});
