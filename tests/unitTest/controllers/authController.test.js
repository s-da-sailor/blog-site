const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const authController = require('../../../controllers/authController');
const contentNegotiation = require('../../../utils/contentNegotiation');
const User = require('../../../models/userModel');

const mockResponseUserCreate = {
  dataValues: {
    username: 'dummyUsername3',
    name: 'Dummy Name C',
    email: 'dummyemail3@dummymail.com',
    password: 'dummypassword3',
    passwordConfirm: 'dummypassword3',
  },
};

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

describe('Test signup', () => {
  test('Signup a new user with 201 status', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        password: 'dummypassword3',
        passwordConfirm: 'dummypassword3',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(User, 'create').mockImplementation((user) => {
      expect(user.username).toBe('dummyUsername3');
      expect(user.name).toBe('Dummy Name C');
      expect(user.email).toBe('dummyemail3@dummymail.com');
      expect(user.password).toBe('dummypassword3');
      expect(user.passwordConfirm).toBe('dummypassword3');
      return mockResponseUserCreate;
    });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((user, statusCode, req, res, next) => {
        expect(user.username).toBe('dummyUsername3');
        expect(user.name).toBe('Dummy Name C');
        expect(user.email).toBe('dummyemail3@dummymail.com');
        expect(user.password).toBeFalsy();
        expect(user.passwordConfirm).toBeFalsy();
        expect(statusCode).toBe(201);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await authController.signup(mockReq, mockRes, mockNext);

    expect(User.create).toHaveBeenCalledTimes(1);
    expect(authController.createAndSendToken).toHaveBeenCalledTimes(1);
  });
});
