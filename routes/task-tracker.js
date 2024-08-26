const express = require('express');
const router = express.Router();
const {
    createTaskTracker, 
    getAllTaskTracker, 
    updateTaskTracker,
    deleteTaskTracker,
    getTaskTracker
} = require('../controllers/task-trackers');


router.route('/').post(createTaskTracker).get(getAllTaskTracker);
router.route('/:id').get(getTaskTracker).delete(deleteTaskTracker).patch(updateTaskTracker);


module.exports = router;

