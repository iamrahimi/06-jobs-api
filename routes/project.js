const express = require('express');
const router = express.Router();
const {
    createProject, 
    getAllProjects, 
    getProject
} = require('../controllers/projects');


router.route('/').post(createProject).get(getAllProjects);
router.route('/:id').get(getProject);


module.exports = router;

