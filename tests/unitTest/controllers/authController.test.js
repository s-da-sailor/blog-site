const { mockRequest, mockResponse } = require('mock-req-res');
const jwt = require('jsonwebtoken');
const authController = require('../../../controllers/authController');
const contentNegotiation = require('../../../utils/contentNegotiation');
const userService = require('../../../services/userService');

const mockResponseUserCreate = {
  dataValues: {
    username: 'dummyUsername3',
    name: 'Dummy Name C',
    email: 'dummyemail3@dummymail.com',
    password: 'dummypassword3',
    passwordConfirm: 'dummypassword3',
  },
};

const mockResponseFindUserByUsernameWithPassword = {
  dataValues: {
    username: 'dummyUsername4',
    name: 'Dummy Name D',
    email: 'dummyemail4@dummymail.com',
    password: 'dummypassword4',
    passwordChangedAt: '2022-05-09T06:28:22.000Z',
    createdAt: '2022-05-09T06:28:22.000Z',
    updatedAt: '2022-05-09T06:28:22.000Z',
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

    jest.spyOn(userService, 'createUser').mockImplementation((info) => {
      expect(info.username).toBe('dummyUsername3');
      expect(info.name).toBe('Dummy Name C');
      expect(info.email).toBe('dummyemail3@dummymail.com');
      expect(info.password).toBe('dummypassword3');
      expect(info.passwordConfirm).toBe('dummypassword3');
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

    expect(userService.createUser).toHaveBeenCalledTimes(1);
    expect(authController.createAndSendToken).toHaveBeenCalledTimes(1);
  });
});

///////////////////////////
describe('Test login', () => {
  test('Login a user with 200 status', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        username: 'dummyUsername4',
        password: 'dummypassword4',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(userService, 'findUserByUsernameWithPassword')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername4');
        return JSON.parse(
          JSON.stringify(mockResponseFindUserByUsernameWithPassword)
        );
      });

    jest
      .spyOn(userService, 'correctPassword')
      .mockImplementation((candidatePassword, userPassword) => {
        expect(candidatePassword).toBe('dummypassword4');
        expect(userPassword).toBe('dummypassword4');
        return true;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((user, statusCode, req, res, next) => {
        expect(user.username).toBe('dummyUsername4');
        expect(user.name).toBe('Dummy Name D');
        expect(user.email).toBe('dummyemail4@dummymail.com');
        expect(user.password).toBeFalsy();
        expect(user.passwordConfirm).toBeFalsy();
        expect(user.passwordChangedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.createdAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.updatedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await authController.login(mockReq, mockRes, mockNext);

    expect(userService.findUserByUsernameWithPassword).toHaveBeenCalledTimes(1);
    expect(userService.correctPassword).toHaveBeenCalledTimes(1);
    expect(authController.createAndSendToken).toHaveBeenCalledTimes(1);
  });

  test('username not given, throw error', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        password: 'dummypassword4',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(userService, 'findUserByUsernameWithPassword')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername4');
        return JSON.parse(
          JSON.stringify(mockResponseFindUserByUsernameWithPassword)
        );
      });

    jest
      .spyOn(userService, 'correctPassword')
      .mockImplementation((candidatePassword, userPassword) => {
        expect(candidatePassword).toBe('dummypassword4');
        expect(userPassword).toBe('dummypassword4');
        return true;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((user, statusCode, req, res, next) => {
        expect(user.username).toBe('dummyUsername4');
        expect(user.name).toBe('Dummy Name D');
        expect(user.email).toBe('dummyemail4@dummymail.com');
        expect(user.password).toBeFalsy();
        expect(user.passwordConfirm).toBeFalsy();
        expect(user.passwordChangedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.createdAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.updatedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await authController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('password not given, throw error', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        username: 'dummyUsername4',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(userService, 'findUserByUsernameWithPassword')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername4');
        return JSON.parse(
          JSON.stringify(mockResponseFindUserByUsernameWithPassword)
        );
      });

    jest
      .spyOn(userService, 'correctPassword')
      .mockImplementation((candidatePassword, userPassword) => {
        expect(candidatePassword).toBe('dummypassword4');
        expect(userPassword).toBe('dummypassword4');
        return true;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((user, statusCode, req, res, next) => {
        expect(user.username).toBe('dummyUsername4');
        expect(user.name).toBe('Dummy Name D');
        expect(user.email).toBe('dummyemail4@dummymail.com');
        expect(user.password).toBeFalsy();
        expect(user.passwordConfirm).toBeFalsy();
        expect(user.passwordChangedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.createdAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.updatedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await authController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('incorrect password, throw error', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      body: {
        username: 'dummyUsername4',
        password: 'incorrectdummypassword4',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest
      .spyOn(userService, 'findUserByUsernameWithPassword')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername4');
        return JSON.parse(
          JSON.stringify(mockResponseFindUserByUsernameWithPassword)
        );
      });

    jest
      .spyOn(userService, 'correctPassword')
      .mockImplementation((candidatePassword, userPassword) => {
        expect(candidatePassword).toBe('incorrectdummypassword4');
        expect(userPassword).toBe('dummypassword4');
        return false;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((user, statusCode, req, res, next) => {
        expect(user.username).toBe('dummyUsername4');
        expect(user.name).toBe('Dummy Name D');
        expect(user.email).toBe('dummyemail4@dummymail.com');
        expect(user.password).toBeFalsy();
        expect(user.passwordConfirm).toBeFalsy();
        expect(user.passwordChangedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.createdAt).toBe('2022-05-09T06:28:22.000Z');
        expect(user.updatedAt).toBe('2022-05-09T06:28:22.000Z');
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await authController.login(mockReq, mockRes, mockNext);

    expect(userService.findUserByUsernameWithPassword).toHaveBeenCalledTimes(1);
    expect(userService.correctPassword).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
