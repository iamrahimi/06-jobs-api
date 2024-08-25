const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const TaskTracker = require('../models/Task-tracker');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, CustomAPIError } = require('../errors')

const createTaskTracker = async function (req, res) {
    const taskTracker = await TaskTracker.create(req.body);
    return res.status(StatusCodes.CREATED).json({status: true, data: taskTracker});  
}

const getAllTaskTracker = async function (req, res) {

    const user = await User.findById(req.user.userId);
    let taskTracker; 
    if(user.role == 'admin'){
        const project = await Project.find({owner: req.user.userId}); 
        let projectIds = project.map(a => a._id);
        taskTracker = TaskTracker.find({projectId: {$in: projectIds}});
    }else { 
        taskTracker =  TaskTracker.find({assignedTo: req.user.userId});
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    taskTracker = taskTracker.skip(skip).limit(limit);
    taskTracker = await taskTracker;
    return res.status(StatusCodes.OK).json({status: true, data: taskTracker}); 
}

const getTaskTracker = async function (req, res) {
    const taskTracker = await TaskTracker.find({_id:req.params.id});
    return res.status(StatusCodes.OK).json({status: true, data: taskTracker});
}

const updateTaskTracker = async function (req, res) {
    const {status} = req.body;
    const taskTracker = await TaskTracker.findByIdAndUpdate({_id: req.params.id}, {status:status}, { new: true, runValidators: true });
    return res.status(StatusCodes.CREATED).json({status: true, data: taskTracker});  
}



module.exports = {
    createTaskTracker, 
    getAllTaskTracker, 
    getTaskTracker, 
    updateTaskTracker
}


