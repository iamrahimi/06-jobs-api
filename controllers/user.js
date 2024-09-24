const express = require('express');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { model } = require('mongoose');
const User = require('../models/User');

const getAllUsers = async function (req, res) {
   
    
    const user = await User.find({role:'user'}).select("_id name role");
    console.log(User);
    res.status(StatusCodes.OK).json({status: true, data: user}); 
}



module.exports = {getAllUsers};