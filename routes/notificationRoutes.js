const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para obter todas as notificações de um usuário
router.get('/notifications', authMiddleware, notificationController.getNotifications);
// Rota para criar uma nova notificação
router.post('/notifications', authMiddleware, notificationController.createNotification);
// Rota para marcar uma notificação como lida
router.patch('/notifications/:notificationId/read', authMiddleware, notificationController.markAsRead);
// Rota para deletar uma notificação
router.delete('/notifications/:notificationId', authMiddleware, notificationController.deleteNotification);
// Rota para deletar todas as notificações de um usuário
router.delete('/notifications/all', authMiddleware, notificationController.deleteAllNotifications);

module.exports = router;