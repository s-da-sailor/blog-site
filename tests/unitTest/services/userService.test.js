const userService = require('../../../services/userService');
const User = require('../../../models/userModel');
const throwError = require('../../../utils/throwError');

const mockResponseUserFindOne = {
  username: 'dummyUsername1',
  name: 'Dummy Name 1',
  email: 'dummyemail1@dummymail.com',
  passwordChangedAt: '2022-05-10T04:34:24.000Z',
  createdAt: '2022-05-10T04:34:23.000Z',
  updatedAt: '2022-05-10T04:34:23.000Z',
};

describe('Test userService findAllUsers', () => {
  test('find all users from db', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findAll').mockImplementation((info) => {
      expect(info.raw).toBe(true);
    });

    await userService.findAllUsers();

    expect(User.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService findUserByUsername', () => {
  test('find one user from db', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findOne').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername1');
      expect(info.raw).toBe(true);
      return mockResponseUserFindOne;
    });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    await userService.findUserByUsername('dummyUsername1');

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(0);
  });

  test('user not found, 404', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findOne').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername1');
      expect(info.raw).toBe(true);
      return null;
    });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    await userService.findUserByUsername('dummyUsername1');

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService findUserByUsernameWithPassword', () => {
  test('find one user from db', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(User.scope('withPassword'), 'findOne')
      .mockImplementation((info) => {
        expect(info.where.username).toBe('dummyUsername1');
        expect(info.raw).toBeFalsy();
        return mockResponseUserFindOne;
      });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    await userService.findUserByUsernameWithPassword('dummyUsername1');

    expect(User.scope('withPassword').findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(0);
  });

  test('user not found, 404', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(User.scope('withPassword'), 'findOne')
      .mockImplementation((info) => {
        expect(info.where.username).toBe('dummyUsername1');
        expect(info.raw).toBeFalsy();
        return null;
      });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    await userService.findUserByUsernameWithPassword('dummyUsername1');

    expect(User.scope('withPassword').findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService createUser', () => {
  test('create a new User', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'create').mockImplementation((info) => {
      expect(info.username).toBe('dummyUsername2');
      expect(info.name).toBe('Dummy Name B');
      expect(info.email).toBe('dummyemail2@dummymail.com');
      expect(info.password).toBe('dummypassword2');
      expect(info.passwordConfirm).toBe('dummypassword2');
    });

    await userService.createUser({
      username: 'dummyUsername2',
      name: 'Dummy Name B',
      email: 'dummyemail2@dummymail.com',
      password: 'dummypassword2',
      passwordConfirm: 'dummypassword2',
    });

    expect(User.create).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService updateUserByUsername', () => {
  test('update a User', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'update').mockImplementation((info, queryObject) => {
      expect(info.username).toBe('dummyUsername3');
      expect(info.name).toBe('Dummy Name C');
      expect(info.email).toBe('dummyemail3@dummymail.com');
      expect(info.password).toBe('dummypassword3');
      expect(info.passwordConfirm).toBe('dummypassword3');
      expect(queryObject.where.username).toBe('dummyUsername3');
    });

    await userService.updateUserByUsername(
      {
        username: 'dummyUsername3',
        name: 'Dummy Name C',
        email: 'dummyemail3@dummymail.com',
        password: 'dummypassword3',
        passwordConfirm: 'dummypassword3',
      },
      'dummyUsername3'
    );

    expect(User.update).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService deleteUserByUsername', () => {
  test('delete a User', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'destroy').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername4');
    });

    await userService.deleteUserByUsername('dummyUsername4');

    expect(User.destroy).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService isSameUser', () => {
  test('users are same, all ok', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findOne').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername1');
      expect(info.raw).toBe(true);
      return mockResponseUserFindOne;
    });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await userService.isSameUser('dummyUsername1', 'dummyUsername1');

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(0);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(0);
  });

  test('user not found, 404', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findOne').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername1');
      expect(info.raw).toBe(true);
      return null;
    });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await userService.isSameUser('dummyUsername1', 'dummyUsername1');

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(1);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(0);
  });

  test('users are not same, 403', async () => {
    jest.clearAllMocks();

    jest.spyOn(User, 'findOne').mockImplementation((info) => {
      expect(info.where.username).toBe('dummyUsername1');
      expect(info.raw).toBe(true);
      return mockResponseUserFindOne;
    });

    jest.spyOn(throwError, 'userNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await userService.isSameUser('dummyUsername1', 'dummyUsername2');

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.userNotFound).toHaveBeenCalledTimes(0);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(1);
  });
});

describe('Test userService correctPassword', () => {
  test('call method from userModel', async () => {
    jest.clearAllMocks();

    jest
      .spyOn(User.prototype, 'correctPassword')
      .mockImplementation((candidatePassword, userPassword) => {
        expect(candidatePassword).toBe('dummypassword5');
        expect(userPassword).toBe('dummypassword6');
      });

    await userService.correctPassword('dummypassword5', 'dummypassword6');

    expect(User.prototype.correctPassword).toHaveBeenCalledTimes(1);
  });
});
