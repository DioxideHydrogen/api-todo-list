const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/tags', authMiddleware, tagController.getAllTags);
router.post('/tags', authMiddleware, tagController.createTag);
router.patch('/tags/:id', authMiddleware, tagController.editTag);
router.delete('/tags/:id', authMiddleware, tagController.deleteTag);
router.delete('/tags/:id/permanently', authMiddleware, tagController.permanentlyDeleteTag);
router.get('/tags/deleted', authMiddleware, tagController.getDeletedTags);
router.patch('/tags/:id/restore', authMiddleware, tagController.restoreTag);

module.exports = router;