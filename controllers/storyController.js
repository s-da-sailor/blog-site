/*
* Title: Story Controller
* Description: This application contains controllers for handling requests on story routes
* Author: Akash Lanard
* Date: 7 April 2022
*/

// DEPENDENCIES
const Story = require('./../models/storyModel');

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

// Upto this point we assume that request validation has been done
// So in case of any error in the try catch blocks it has to be in the server side

// controller for getting all the stories
exports.getAllStories = async (req, res) => {   
  try {                                         
    let stories = await Story.findAll({});
    res.status(200).json({                     // Send all stories as response (or empty array if not found)
      status: 'success',
      results: stories.length,
      data: {
        stories
      }
    });              
  } catch(err) {
    res.status(500).json({                    // Internal server error
      status: 'fail',
      message: err
    });                      
  }
};

// controller for getting a specific story
exports.getStory = async (req, res) => {
  try {
    const id = Number(req.params.id);                         // convert string to number
    const story = await Story.findOne({ where: { id: id } }); // find story having the specified ID

    if(!story) {                                              // if the story is not found return 404
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    res.status(200).json({                                   // return the story as JSON 
      status: 'success',
      data: {                                             
        story
      }
    });
  } catch(err) {
    res.status(500).json({                                   // Internal server error
      status: 'fail',
      message: err
    }); 
  }
};

// controller for creating a story
exports.createStory = async (req, res) => {
  try {
    const info = {                              // get info from request body
      title: req.body.title,
      description: req.body.description,
      author: req.body.author
    };

    const newStory = await Story.create(info);  // create new story in DB 
    res.status(201).json({            
      status: 'success',
      data: {
        story: newStory                         // return newly created story
      }
    });
  } catch(err) {
    res.status(500).json({                      // Internal server error
      status: 'fail',
      message: err
    }); 
  }
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