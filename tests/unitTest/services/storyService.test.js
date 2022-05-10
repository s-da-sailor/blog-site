const storyService = require('../../../services/storyService');
const Story = require('../../../models/storyModel');

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
