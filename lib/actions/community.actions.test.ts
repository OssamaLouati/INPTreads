// communityFunctions.test.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { addMemberToCommunity, createCommunity, deleteCommunity, fetchCommunities, fetchCommunityDetails, fetchCommunityPosts, removeUserFromCommunity, updateCommunityInfo } from './community.actions'; // Adjust the import path
import User from '../models/user.model';
import Community from '../models/community.model';
import Thread from '../models/thread.model';

jest.mock("../mongoose", () => ({
  connectToDB: jest.fn(),
}));

describe('Community Functions Tests', () => {
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
    await User.deleteMany({});
    await Community.deleteMany({});
    await Thread.deleteMany({});
    await User.deleteMany({});

  });

  test('createCommunity should create a new community', async () => {
    const user = new User({ id: 'user1', username: 'testuser', name: 'Test User' });
    await user.save();

    const community = await createCommunity('comm1', 'Test Community', 'testcommunity', 'image.jpg', 'Test Bio', user.id);

    expect(community).toBeDefined();
    expect(community.name).toBe('Test Community');
    expect(community.createdBy.toString()).toBe(user._id.toString());
  });

  test('fetchCommunityDetails should return community details', async () => {
    const user = new User({ id: 'user1', username: 'testuser', name: 'Test User' });
    await user.save();
  
    const newCommunity = new Community({
      id: 'comm1',
      name: 'Test Community',
      username: 'communityUsername', // Make sure this is included
      createdBy: user._id
      // Include any other required fields here
    });
    await newCommunity.save();
  
    const communityDetails = await fetchCommunityDetails('comm1');
  
    expect(communityDetails).toBeDefined();
    expect(communityDetails.name).toBe('Test Community');
    expect(communityDetails.createdBy._id.toString()).toBe(user._id.toString());
  });
  
  test('fetchCommunities should return a list of communities', async () => {
    // Setup: Create communities
    await Community.create([
      { id: 'comm3', name: 'Community A', username: 'communityA' },
      { id: 'comm4', name: 'Community B', username: 'communityB' }
    ]);
  
    // Action: Fetch communities with pagination and search criteria
    const result = await fetchCommunities({ searchString: 'Community', pageNumber: 1, pageSize: 10, sortBy: 'asc' });
  
    // Assertions
    expect(result.communities).toHaveLength(2);
    expect(result.isNext).toBe(false); // Change according to the actual expected outcome
  });

  test('addMemberToCommunity should add a member to the community', async () => {
    // Setup: Create a user and a community
    const user = new User({ id: 'user3', username: 'memberuser', name: 'Member User' });
    await user.save();
    const community = new Community({ id: 'comm5', name: 'Membership Community', username: 'membership', createdBy: user._id });
    await community.save();
  
    // Action: Add member to community
    const updatedCommunity = await addMemberToCommunity('comm5', 'user3');
  
    // Assertions
    expect(updatedCommunity.members).toContainEqual(user._id);
  });
    
  test('removeUserFromCommunity should remove a user from the community', async () => {
    // Setup: Create a user and add them to a community
    const user = new User({ id: 'user4', username: 'removeduser', name: 'Removed User' });
    await user.save();
    const community = new Community({ id: 'comm6', name: 'Removal Community', username: 'removal', createdBy: user._id, members: [user._id] });
    await community.save();
  
    // Action: Remove user from community
    const result = await removeUserFromCommunity('user4', 'comm6');
  
    // Assertions
    expect(result.success).toBe(true);
  });

  test('should update community information', async () => {
    const community = new Community({ id: 'comm1', name: 'Original Name', username: 'originalUsername', image: 'originalImage.jpg' });
    await community.save();

    const updatedCommunity = await updateCommunityInfo('comm1', 'Updated Name', 'updatedUsername', 'updatedImage.jpg');

    expect(updatedCommunity).toBeDefined();
    expect(updatedCommunity.name).toBe('Updated Name');
    expect(updatedCommunity.username).toBe('updatedUsername');
    expect(updatedCommunity.image).toBe('updatedImage.jpg');
  });

  test('should throw an error if community is not found', async () => {
    let error;

    try {
      await updateCommunityInfo('nonexistentId', 'New Name', 'newUsername', 'newImage.jpg');
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe("Community not found");
  });

  test('should fetch community posts', async () => {
    // Setup: Create users, a community, and threads
    const user = new User({ 
        id: 'uniqueUserId', // Ensure this is a unique identifier
        username: 'testuser', 
        name: 'John Doe', 
        image: 'johndoe.jpg' 
      });
      await user.save();

    const community = new Community({id: 'uniqueCommunityId', name: 'Test Community', username: 'testcommunity', createdBy: user._id });
    await community.save();

    const thread = new Thread({ text: 'Sample Thread', author: user._id, community: community._id });
    await thread.save();

    const childThread = new Thread({ text: 'Reply Thread', author: user._id, community: community._id, parentId: thread._id });
    await childThread.save();

    thread.children.push(childThread._id);
    await thread.save();

    community.threads.push(thread._id);
    await community.save();



    // Action: Fetch community posts
    const communityPosts = await fetchCommunityPosts(community._id.toString());

    // Assertions
    expect(communityPosts).toBeDefined();
    expect(communityPosts.threads).toHaveLength(1);
    expect(communityPosts.threads[0].children).toHaveLength(1);
  }); 
      
});
