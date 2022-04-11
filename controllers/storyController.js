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
exports.updateStoryPatch = async (req, res) => {
  try {
    const id = Number(req.params.id);               // convert string to number

    const info = {};
    if(req.body.title) {                            // construct object from partial payload
      info.title = req.body.title;
    }
    if(req.body.description) {
      info.description = req.body.description;
    }

    console.log(info);
                                                    // first returned array element is the number of rows affected in the update
    const [updatedStoriesCount, ] = await Story.update(info, { where: { id: id } }); // find story having the specified ID

    if(updatedStoriesCount) {                       // if it is 1 then the database is updated 
      const updatedStory = await Story.findOne({ where: { id: id } });
                                                    // get the updated story 
      res.status(200).json({      
        status: 'success',                          
        data: {                                     // return the updated story
          story: updatedStory
        }
      });
    } else {                                        // if it is 0 then the database is not updated 
      res.status(404).json({                       
        status: 'failed',
        message: 'Invalid ID'                          
      });
    }
  } catch(err) {
    res.status(500).json({                          // Internal server error
      status: 'fail',
      message: err
    });
  }
};

// controller for updating a story (full payload)
exports.updateStoryPut = async (req, res) => {
  try {
    const id = Number(req.params.id);               // convert string to number

    const info = {};
    info.title = req.body.title;                    // construct object from full payload
    info.description = req.body.description;

    console.log(info);
                                                    // first returned array element is the number of rows affected in the update
    const [updatedStoriesCount, ] = await Story.update(info, { where: { id: id } }); // find story having the specified ID


    if(updatedStoriesCount) {                       // if it is 1 then the database is updated 
      const updatedStory = await Story.findOne({ where: { id: id } });
                                                    // get the updated story 
      res.status(200).json({
        status: 'success',                          
        data: {                                     // return the updated story
          story: updatedStory
        }
      });                                           // if it is 0 then the database is not updated 
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Invalid ID'                          
      });
    }
  } catch(err) {
    res.status(500).json({                          // Internal server error
      status: 'fail',
      message: err
    });
  }
};

// controller for deleting a story
exports.deleteStory = async (req, res) => {
  try {
    const id = Number(req.params.id);                                      // convert string to number
                                                                  // it returns number of deleted rows
    const deletedRowsCount = await Story.destroy({ where: { id: id } });   // delete the entry from DB

    if(deletedRowsCount) {                                                 // if a row is deleted
      res.status(204).json({                                               // no content is returned
        status: 'success',
        data: null
      });
    } else {                                                              // if a row is not deleted
      res.status(400).json({                                              // it is an invalid request
        status: 'Invalid ID',
        data: null
      });
    }
  } catch(err) {
    res.status(500).json({                                                // Internal server error
      status: 'fail',
      message: err
    });
  }
};