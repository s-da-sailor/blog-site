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
