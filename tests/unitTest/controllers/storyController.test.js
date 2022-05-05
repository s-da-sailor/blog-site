const { mockRequest, mockResponse } = require('mock-req-res');
const storyController = require('../../../controllers/storyController');
const storyService = require('../../../services/storyService');
const contentNegotiation = require('../../../utils/contentNegotiation');

const mockResponseStories = [
  {
    id: 1,
    title: 'Dummy Title 1',
    description: 'Dummy Description 1',
    author: 'dummyAuthor1',
    createdAt: '2022-05-01T12:45:55.000Z',
    updatedAt: '2022-05-01T12:45:55.000Z',
  },
  {
    id: 2,
    title: 'Dummy Title 2',
    description: 'Dummy Description 2',
    author: 'dummyAuthor2',
    createdAt: '2022-05-01T12:46:03.000Z',
    updatedAt: '2022-05-01T12:46:03.000Z',
  },
];

const mockResponseCreateStory = {
  dataValues: {
    id: 3,
    title: 'Dummy Title 3',
    description: 'Dummy Description 3',
    author: 'dummyUsername3',
    updatedAt: '2022-05-05T12:42:54.000Z',
    createdAt: '2022-05-05T12:42:54.000Z',
  },
};

describe('Test storyController getAllStories', () => {
  test('get all stories with status 200', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(storyService, 'findAllStories')
      .mockImplementation(() => mockResponseStories);

    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNext = '';

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseStories);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await storyController.getAllStories(mockReq, mockRes, mockNext);

    expect(storyService.findAllStories).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyController getStory', () => {
  test('get a story with status 200 #1', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(storyService, 'findStoryById')
      .mockImplementation((id) => mockResponseStories[id]);

    const mockReq = mockRequest({
      params: {
        id: 0,
      },
    });
    const mockRes = mockResponse();
    const mockNext = '';

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseStories[0]);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await storyController.getStory(mockReq, mockRes, mockNext);

    expect(storyService.findStoryById).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });

  test('get a story with status 200 #2', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(storyService, 'findStoryById')
      .mockImplementation((id) => mockResponseStories[id]);

    const mockReq = mockRequest({
      params: {
        id: 1,
      },
    });
    const mockRes = mockResponse();
    const mockNext = '';

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseStories[1]);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await storyController.getStory(mockReq, mockRes, mockNext);

    expect(storyService.findStoryById).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyController createStory', () => {
  test('create a new story with status 201', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        title: 'Dummy Title 3',
        description: 'Dummy Description 3',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyEmail3@dummymail.com',
        passwordChangedAt: '2022-05-05T12:42:55.000Z',
        createdAt: '2022-05-05T12:42:54.000Z',
        updatedAt: '2022-05-05T12:42:54.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = '';

    jest.spyOn(storyService, 'createStory').mockImplementation((info) => {
      expect(info.title).toBe('Dummy Title 3');
      expect(info.description).toBe('Dummy Description 3');
      expect(info.author).toBe('dummyUsername3');

      return mockResponseCreateStory;
    });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseCreateStory.dataValues);
        expect(statusCode).toBe(201);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await storyController.createStory(mockReq, mockRes, mockNext);

    expect(storyService.createStory).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});
