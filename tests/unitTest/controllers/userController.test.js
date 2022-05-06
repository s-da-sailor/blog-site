const { mockRequest, mockResponse } = require('mock-req-res');
const userController = require('../../../controllers/userController');
const userService = require('../../../services/userService');
const contentNegotiation = require('../../../utils/contentNegotiation');
const authController = require('../../../controllers/authController');

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

const mockResponseFindUserByUsername = {
  username: 'dummyUsername3',
  name: 'New Dummy Name C',
  email: 'newdummyemail3@dummymail.com',
  passwordChangedAt: '2022-05-05T14:36:12.000Z',
  createdAt: '2022-05-05T13:35:52.000Z',
  updatedAt: '2022-05-05T14:36:12.000Z',
};

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

describe('Test userController updateUserPatch', () => {
  test('update a user with status 200 (change password)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
        email: 'newdummyemail3@dummymail.com',
        password: 'new12345678',
        passwordConfirm: 'new12345678',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.password).toBe('new12345678');
        expect(info.passwordConfirm).toBe('new12345678');
        expect(info.passwordChangedAt).toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPatch(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(authController.createAndSendToken).toHaveBeenCalledTimes(1);
  });

  test('update a user with status 200 (do not change password)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
        email: 'newdummyemail3@dummymail.com',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.passwordChangedAt).not.toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPatch(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });

  test('update a user with status 200 (update just name)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.passwordChangedAt).not.toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPatch(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });

  test('update a user with status 200 (update just email)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        email: 'newdummyemail3@dummymail.com',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.passwordChangedAt).not.toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPatch(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});

describe('Test userController updateUserPut', () => {
  test('update a user with status 200', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
        email: 'newdummyemail3@dummymail.com',
        password: 'new12345678',
        passwordConfirm: 'new12345678',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.password).toBe('new12345678');
        expect(info.passwordConfirm).toBe('new12345678');
        expect(info.passwordChangedAt).toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPut(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.findUserByUsername).toHaveBeenCalledTimes(1);
    expect(authController.createAndSendToken).toHaveBeenCalledTimes(1);
  });

  test('incomplete info, throw error (password missing)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
        email: 'newdummyemail3@dummymail.com',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.passwordChangedAt).not.toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPut(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('incomplete info, throw error (name missing)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        email: 'newdummyemail3@dummymail.com',
        password: 'new12345678',
        passwordConfirm: 'new12345678',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.password).toBe('new12345678');
        expect(info.passwordConfirm).toBe('new12345678');
        expect(info.passwordChangedAt).toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPut(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('incomplete info, throw error (email missing)', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername3',
      },
      body: {
        name: 'New Dummy Name C',
        password: 'new12345678',
        passwordConfirm: 'new12345678',
      },
      user: {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        passwordChangedAt: '2022-05-05T13:36:12.000Z',
        createdAt: '2022-05-05T13:35:52.000Z',
        updatedAt: '2022-05-05T13:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername3');
      expect(username).toBe('dummyUsername3');
    });

    jest
      .spyOn(userService, 'updateUserByUsername')
      .mockImplementation((info, username) => {
        expect(info.name).toBe('New Dummy Name C');
        expect(info.email).toBe('newdummyemail3@dummymail.com');
        expect(info.password).toBe('new12345678');
        expect(info.passwordConfirm).toBe('new12345678');
        expect(info.passwordChangedAt).toBeTruthy();
        expect(username).toBe('dummyUsername3');
      });

    jest
      .spyOn(userService, 'findUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername3');
        return mockResponseFindUserByUsername;
      });

    jest
      .spyOn(authController, 'createAndSendToken')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(mockResponseFindUserByUsername);
        expect(statusCode).toBe(200);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.updateUserPut(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

describe('Test userController deleteUser', () => {
  test('delete a user with status 204', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      params: {
        username: 'dummyUsername4',
      },
      user: {
        username: 'dummyUsername4',
        name: 'Dummy Name D',
        email: 'dummyemail4@dummymail.com',
        passwordChangedAt: '2022-05-05T15:36:12.000Z',
        createdAt: '2022-05-05T15:35:52.000Z',
        updatedAt: '2022-05-05T15:36:12.000Z',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(userService, 'isSameUser').mockImplementation((id, username) => {
      expect(id).toBe('dummyUsername4');
      expect(username).toBe('dummyUsername4');
    });

    jest
      .spyOn(userService, 'deleteUserByUsername')
      .mockImplementation((username) => {
        expect(username).toBe('dummyUsername4');
      });

    jest
      .spyOn(contentNegotiation, 'serveData')
      .mockImplementation((data, statusCode, req, res, next) => {
        expect(data).toEqual(null);
        expect(statusCode).toBe(204);
        expect(req).toEqual(mockReq);
        expect(res).toEqual(mockRes);
        expect(next).toEqual(mockNext);
      });

    await userController.deleteUser(mockReq, mockRes, mockNext);

    expect(userService.isSameUser).toHaveBeenCalledTimes(1);
    expect(userService.deleteUserByUsername).toHaveBeenCalledTimes(1);
    expect(contentNegotiation.serveData).toHaveBeenCalledTimes(1);
  });
});
