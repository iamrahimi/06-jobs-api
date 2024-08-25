const express = require('express');
const router = express.Router();
const {
    createTaskTracker, 
    getAllTaskTracker, 
    updateTaskTracker,
    getTaskTracker
} = require('../controllers/task-trackers');


router.route('/').post(createTaskTracker).get(getAllTaskTracker);
router.route('/:id').get(getTaskTracker).patch(updateTaskTracker);


module.exports = router;

