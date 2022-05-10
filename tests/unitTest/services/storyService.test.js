const storyService = require('../../../services/storyService');
const Story = require('../../../models/storyModel');
const throwError = require('../../../utils/throwError');

const mockResponseStoryFindOne = {
  id: 1,
  title: 'Dummy Title 1',
  description: 'Dummy Description 1',
  author: 'dummyAuthor1',
  createdAt: '2022-05-10T03:09:57.000Z',
  updatedAt: '2022-05-10T03:09:57.000Z',
};

describe('Test storyService findAllStories', () => {
  test('find all stories from db', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findAll').mockImplementation((info) => {
      expect(info.raw).toBe(true);
    });

    await storyService.findAllStories();

    expect(Story.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyService findStoryById', () => {
  test('find one story from db', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findOne').mockImplementation((info) => {
      expect(info.where.id).toBe(1);
      expect(info.raw).toBe(true);
      return mockResponseStoryFindOne;
    });

    jest.spyOn(throwError, 'storyNotFound').mockImplementation(() => {});

    await storyService.findStoryById(1);

    expect(Story.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.storyNotFound).toHaveBeenCalledTimes(0);
  });

  test('No Story found, 404', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findOne').mockImplementation((info) => {
      expect(info.where.id).toBe(1);
      expect(info.raw).toBe(true);
      return null;
    });

    jest.spyOn(throwError, 'storyNotFound').mockImplementation(() => {});

    await storyService.findStoryById(1);

    expect(Story.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.storyNotFound).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyService createStory', () => {
  test('create a new story', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'create').mockImplementation((info) => {
      expect(info.title).toBe('Dummy Title 2');
      expect(info.description).toBe('Dummy Description 2');
    });

    await storyService.createStory({
      title: 'Dummy Title 2',
      description: 'Dummy Description 2',
    });

    expect(Story.create).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyService updateStoryById', () => {
  test('create a new story', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'update').mockImplementation((info, queryObject) => {
      expect(info.title).toBe('Dummy Title 3');
      expect(info.description).toBe('Dummy Description 3');
      expect(queryObject.where.id).toBe(3);
    });

    await storyService.updateStoryById(
      {
        title: 'Dummy Title 3',
        description: 'Dummy Description 3',
      },
      3
    );

    expect(Story.update).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyService deleteStoryById', () => {
  test('delete a story', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'destroy').mockImplementation((info) => {
      expect(info.where.id).toBe(4);
    });

    await storyService.deleteStoryById(4);

    expect(Story.destroy).toHaveBeenCalledTimes(1);
  });
});

describe('Test storyService isSameAuthor', () => {
  test('authors are same, all ok', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findOne').mockImplementation((info) => {
      expect(info.where.id).toBe(1);
      expect(info.raw).toBe(true);
      return mockResponseStoryFindOne;
    });

    jest.spyOn(throwError, 'storyNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await storyService.isSameAuthor(1, 'dummyAuthor1');

    expect(Story.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.storyNotFound).toHaveBeenCalledTimes(0);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(0);
  });

  test('story not found, 404', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findOne').mockImplementation((info) => {
      expect(info.where.id).toBe(1);
      expect(info.raw).toBe(true);
      return null;
    });

    jest.spyOn(throwError, 'storyNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await storyService.isSameAuthor(1, 'dummyAuthor1');

    expect(Story.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.storyNotFound).toHaveBeenCalledTimes(1);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(0);
  });

  test('authors are not same, 403', async () => {
    jest.clearAllMocks();

    jest.spyOn(Story, 'findOne').mockImplementation((info) => {
      expect(info.where.id).toBe(1);
      expect(info.raw).toBe(true);
      return mockResponseStoryFindOne;
    });

    jest.spyOn(throwError, 'storyNotFound').mockImplementation(() => {});

    jest.spyOn(throwError, 'doNotHavePermission').mockImplementation(() => {});

    await storyService.isSameAuthor(1, 'dummyAuthor2');

    expect(Story.findOne).toHaveBeenCalledTimes(1);
    expect(throwError.storyNotFound).toHaveBeenCalledTimes(0);
    expect(throwError.doNotHavePermission).toHaveBeenCalledTimes(1);
  });
});
