const { mockRequest, mockResponse } = require('mock-req-res');
const storyController = require('../../../controllers/storyController');
const storyService = require('../../../services/storyService');
const contentNegotiation = require('../../../utils/contentNegotiation');

const mockResponseFindAllStories = [
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
  jest.clearAllMocks();

  test('get all stories with status 200', async () => {
    jest
      .spyOn(storyService, 'findAllStories')
      .mockImplementation(() => mockResponseFindAllStories);

    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNext = '';

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindAllStories);
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
