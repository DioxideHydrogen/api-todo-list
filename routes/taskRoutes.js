const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/tasks', authMiddleware, taskController.getAllTasks);
router.post('/tasks', authMiddleware, taskController.createTask);
router.patch('/tasks/:id', authMiddleware, taskController.editTask);
router.patch('/tasks/:id/archive', authMiddleware, taskController.archiveTask);
router.patch('/tasks/:id/unarchive', authMiddleware, taskController.unarchiveTask);
router.patch('/tasks/:id/complete', authMiddleware, taskController.completeTask);
router.patch('/tasks/:id/uncomplete', authMiddleware, taskController.uncompleteTask);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);
router.get('/tasks/deleted', authMiddleware, taskController.getDeletedTasks);
router.patch('/tasks/:id/restore', authMiddleware, taskController.restoreTask);

module.exports = router;
