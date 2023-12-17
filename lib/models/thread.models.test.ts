import mongoose from 'mongoose';
import Thread from './thread.model'; // Adjust the import path as necessary
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Thread Model Test', () => {
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
    await Thread.deleteMany({});
  });

  test('create & save thread successfully', async () => {
    const validThread = new Thread({
      text: 'Sample Thread Text',
      author: new mongoose.Types.ObjectId(), // Replace with a valid ObjectId
      // Add community and children with valid ObjectId if necessary
    });
    const savedThread = await validThread.save();

    // Assertions
    expect(savedThread._id).toBeDefined();
    expect(savedThread.text).toBe(validThread.text);
    // Add more assertions as necessary
  });

  test('create thread without required field should fail', async () => {
    const threadWithoutRequiredField = new Thread({ author: new mongoose.Types.ObjectId() });
    let err;
    try {
      const savedThreadWithoutRequiredField = await threadWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.text).toBeDefined();
  });

});
