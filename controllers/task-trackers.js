const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const TaskTracker = require('../models/Task-tracker');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, CustomAPIError } = require('../errors');
const { exist } = require('joi');

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
    const taskTracker = await TaskTracker.findById(req.params.id);
    return res.status(StatusCodes.OK).json({taskTracker});
}

const updateTaskTracker = async function (req, res) {
    const taskTrackerData = await TaskTracker.findById(req.params.id)
    .populate('projectId');

    const title = req.body.title || taskTrackerData.title;
    const description = req.body.description || taskTrackerData.description;
    const status = req.body.status || taskTrackerData.status;
    const proiority = req.body.proiority || taskTrackerData.proiority;
    const assignedTo = req.body.assignedTo || taskTrackerData.assignedTo;

    if(taskTrackerData.projectId.owner == req.user.userId) { // Will check for owner and then will update
        const taskTracker = await TaskTracker.findByIdAndUpdate(
            {_id: req.params.id}, 
            {status:status, title: title, description: description, proiority:proiority, assignedTo:assignedTo}, 
            { new: true, runValidators: true });

        return res.status(StatusCodes.CREATED).json({status: true, data: taskTracker});  
    }else if (taskTrackerData.assignedTo == req.user.userId) { // will check if the task is assigned to user and only the status will be updated
        const taskTracker = await TaskTracker.findByIdAndUpdate(
            {_id: req.params.id}, 
            {status:status}, 
            { new: true, runValidators: true });

        return res.status(StatusCodes.CREATED).json({status: true, data: taskTracker});
    }else {
        throw new CustomAPIError ('You are not the owner of this task tracker please contact your admin', StatusCodes.BAD_REQUEST);
    }
    
}

const deleteTaskTracker = async function (req, res) {
    const taskTrackerData = await TaskTracker.findById(req.params.id)
    .populate('projectId');
    if(taskTrackerData.projectId.owner == req.user.userId){
        const taskTracker = await TaskTracker.findByIdAndRemove(req.params.id);
        if (!taskTracker) {
            throw new NotFoundError(`No task found`);
          }
          res.status(StatusCodes.OK).json({status: true, msg: "Successfully deleted"});
    }else {
        throw new NotFoundError("You don't have access to delete task, please contact your admin", StatusCodes.BAD_REQUEST);
    }
}



module.exports = {
    createTaskTracker, 
    getAllTaskTracker, 
    getTaskTracker, 
    updateTaskTracker,
    deleteTaskTracker
}


