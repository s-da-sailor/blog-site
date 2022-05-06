const { mockRequest, mockResponse } = require('mock-req-res');
const userController = require('../../../controllers/userController');
const userService = require('../../../services/userService');
const contentNegotiation = require('../../../utils/contentNegotiation');

const mockResponseUsers = [
  {
    username: 'dummyUsername1',
    name: 'Dummy Name A',
    email: 'dummyemail1@dummyemail.com',
    passwordChangedAt: '2022-05-06T06:53:56.000Z',
    createdAt: '2022-05-06T06:53:56.000Z',
    updatedAt: '2022-05-06T06:53:56.000Z',
  },
  {
    username: 'dummyUsername2',
    name: 'Dummy Name B',
    email: 'dummyemail2@dummyemail.com',
    passwordChangedAt: '2022-05-06T06:53:56.000Z',
    createdAt: '2022-05-06T06:53:56.000Z',
    updatedAt: '2022-05-06T06:53:56.000Z',
  },
];

describe('Test userController getAllUsers', () => {
  test('get all users with status 200', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(userService, 'findAllUsers')
      .mockImplementation(() => mockResponseUsers);

    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseUsers);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.getAllUsers(mockReq, mockRes, mockNext);

    expect(userService.findAllUsers).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});

describe('Test userController getUser', () => {
  test('get a user with status 200 #1', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername1');
        return mockResponseUsers[0];
      });

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername1',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseUsers[0]);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.getUser(mockReq, mockRes, mockNext);

    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });

  test('get a user with status 200 #2', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername2');
        return mockResponseUsers[1];
      });

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername2',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseUsers[1]);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.getUser(mockReq, mockRes, mockNext);

    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});
