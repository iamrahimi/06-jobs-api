const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, CustomAPIError } = require('../errors')


const createProject = async function (req, res) {
    req.body.owner = req.user.userId;
    const user = await User.findById(req.user.userId);
    if(user.role == 'admin'){
        const project = await Project.create(req.body);
       return res.status(StatusCodes.CREATED).json({status: true, data: project});  
    }

    throw new CustomAPIError('Please contact your supervisor to create a project.', StatusCodes.METHOD_NOT_ALLOWED)
}

const getAllProjects = async function (req, res) {
   
    const project = await Project.find({ owner: req.user.userId });
    res.status(StatusCodes.CREATED).json({status: true, data: project}); 
}

const getProject = async function (req, res) {
    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ project })
}


module.exports = {
    createProject, 
    getAllProjects, 
    getProject,
}


