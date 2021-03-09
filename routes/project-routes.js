
module.exports = function (io) {

  const express = require('express');
  const router = express.Router();
  const Project = require('../models/project-model');
  const mongoose = require('mongoose');
  const fileUpload = require('../configs/cloudinary');

  //Read
  router.get('/projects', (req, res) => {
    console.log('projects')
    Project.find()
      .then((allProjectsFromDB) => {
        res.status(200).json(allProjectsFromDB);
      }).catch((error) => {
        res.status(500).json(`Error occurred ${error}`);
      });
  });

  //Create
  router.post('/projects', (req, res) => {
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res.status(400).json('Missing fields');
      return;
    }

    Project.create({
      title,
      description,
      imageUrl
    }).then((response) => {
      io.emit('newProject', response);
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    });
  });

  //Delete
  router.delete('/projects/:id', (req, res) => {
    Project.findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(200).json(`Project with id ${req.params.id} was deleted`);
      }).catch((error) => {
        res.status(500).json(`Error occurred ${error}`);
      });
  });

  //Read by Id
  router.get('/projects/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json('Specified id is not valid');
      return;
    }

    Project.findById(req.params.id)
      .then((theProjectFromDB) => {
        res.status(200).json(theProjectFromDB);
      }).catch((error) => {
        res.status(500).json(`Error occurred ${error}`);
      });
  })

  //Update
  router.put('/projects/:id', (req, res) => {
    const { title, description } = req.body;
    console.log(title);
    Project.findByIdAndUpdate(req.params.id, 
      { title: title, description: description })
      .then(() => {
        res.status(200).json(`Project with id ${req.params.id} was updated`);
      }).catch((error) => {
        res.status(500).json(`Error occurred ${error}`);
      });
  });

  //Route to add image to cloudinary
  router.post('/upload', fileUpload.single('file'), (req, res) => {
    try {
      res.status(200).json({ fileUrl: req.file.path});
    } 
    catch(error) {
      res.status(500).json(`Error occurred ${error}`);
    };
  });

  return router;
}
