const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, CustomAPIError } = require('../errors');
const project = require('../models/Project');


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
   
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const project = await Project.find({ owner: req.user.userId }).skip(skip).limit(limit);
    res.status(StatusCodes.OK).json({status: true, data: project}); 
}

const getProject = async function (req, res) {
    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new NotFoundError(`No project with id ${req.params.id}`)
      }
      res.status(StatusCodes.OK).json({ project })
}

const updateProject = async function (req, res) {
    const projectData = await project.findById(req.params.id);

    const name = req.body.name || projectData.name;
    const description = req.body.description || projectData.description;
    
    if(projectData.owner == req.user.userId) { // Will check for owner and then will update
        const project = await Project.findByIdAndUpdate(
            {_id: req.params.id}, 
            {name: name, description: description}, 
            { new: true, runValidators: true });

        return res.status(StatusCodes.CREATED).json({status: true, data: project});  
    } else {
        throw new CustomAPIError ('You are not the owner of this project please contact its owner', StatusCodes.BAD_REQUEST);
    }
}

const deleteProject = async function(req, res) {
    const projectData = await Project.findById(req.params.id);
    if(projectData.owner == req.user.userId){
        const project = await Project.findByIdAndRemove(req.params.id);
        if (!project) {
            throw new NotFoundError(`No project found`);
          }
          res.status(StatusCodes.OK).json({status: true, msg: "Successfully deleted"});
    }else {
        throw new NotFoundError("You are not the owner of this project, please contact it's owner", StatusCodes.BAD_REQUEST);
    }
}


module.exports = {
    createProject, 
    getAllProjects, 
    deleteProject,
    updateProject,
    getProject,
}


