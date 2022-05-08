const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const authController = require('../../../controllers/authController');
const contentNegotiation = require('../../../utils/contentNegotiation');

describe('Test signToken', () => {
  test('Sign a token with proper parameters', () => {
    jest.clearAllMocks();

    jest.spyOn(jwt, 'sign').mockImplementation((info) => {
      expect(info.username).toBe('dummyUsername1');
      // @TODO: handle environment variables
    });

    authController.signToken('dummyUsername1');

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });
});

describe('Test createAndSendToken', () => {
  test('Create token, set cookie, and send', () => {
    jest.clearAllMocks();

    jest.spyOn(authController, 'signToken').mockImplementation((username) => {
      expect(username).toBe('dummyUsername2');
      return 'dummyToken2';
    });

    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(mockRes, 'cookie')
      .mockImplementation((jwtName, token, cookieOptions) => {
        expect(jwtName).toBe('jwt');
        expect(token).toBe('dummyToken2');
        expect(cookieOptions.expires).toBeTruthy();
        expect(cookieOptions.httpOnly).toBe(true);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data.username).toBe('dummyUsername2');
        expect(data.token).toBe('dummyToken2');
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    authController.createAndSendToken(
      { username: 'dummyUsername2' },
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(authController.signToken).toHaveBeenCalledTimes(1);
    expect(mockRes.cookie).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});
