/*
* Title: Story Controller
* Description: This application contains controllers for handling requests on story routes
* Author: Akash Lanard
* Date: 7 April 2022
*/

//dummy data for stories (@TODO serve from db later)
const stories  = [
  {
    id: 0,
    title: "Dummy Title 1",
    description: "Dummy Description 1",
    author: "Dummy author 1",
    createdAt: Date.now()
  },
  {
    id: 1,
    title: "Dummy Title 2",
    description: "Dummy Description 2",
    author: "Dummy author 2",
    createdAt: Date.now()
  },
  {
    id: 2,
    title: "Dummy Title 3",
    description: "Dummy Description 3",
    author: "Dummy author 3",
    createdAt: Date.now()
  }
];

// controller for getting all the stories
exports.getAllStories = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: {                                     // serve dummy stories array
      stories
    }
  });
};

// controller for getting a specific story
exports.getStory = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',
    data: {                                     // serve from dummy data
      story
    }
  });
};

// controller for creating a story
exports.createStory = (req, res) => {
  const newId = stories[stories.length - 1].id + 1;         // get newID 
  const newStory = Object.assign({ id: newId }, req.body);  // dummy story object
  stories.push(newStory);                                   // pushed in the dummy array
  res.status(201).json({
    status: 'success',
    data: {                                     // create in db and return (to be done later)
      story: newStory
    }
  });
};

// controller for updating a story (partial payload)
exports.updateStoryPatch = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',                          
    data: {                                     // update in db and return (to be done later)
      story: '<Updated story here..>'
    }
  });
};

// controller for updating a story (full payload)
exports.updateStoryPut = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({                        // return the story as JSON 
    status: 'success',                          
    data: {                                     // update in db and return (to be done later)
      story: '<Updated story here..>'
    }
  });
};

// controller for deleting a story
exports.deleteStory = (req, res) => {
  const id = Number(req.params.id);             // convert string to number
  const story = stories.find(s => s.id === id); // find story having the specified ID

  if(!story) {                                  // if the story is not found return 404
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({                        // body is empty (no content)
    status: 'success',                          
    data: null                                  // delete from db (to be done later)
  });
};