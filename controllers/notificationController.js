const Notification = require('../models/Notification');
const Task = require('../models/Task');
const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; 
    const notifications = await Notification.find({ userId }).populate('taskId').sort({ createdAt: -1 });
  
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificações', details: err.message });
  }
}

exports.createNotification = async (req, res) => {
  try {

    const { taskId = null, notificationId = null, title = null, message = null } = req.body;

    const userId = req.user._id; // Assume que o ID do usuário está disponível no token JWT
    
    if (!taskId || !title || !message || !notificationId) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Verifica se a tarefa existe
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const notification = new Notification({
      taskId,
      userId,
      notificationId,
      title,
      message,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notificação', details: err.message });
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { notificationId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    res.json(notification);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao marcar notificação como lida', details: err.message });
  }

}

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({ notificationId });
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    res.status(204).end();

  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar notificação', details: err.message });
  }
}

exports.deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nenhuma notificação encontrada para deletar' });
    }

    res.json({ message: `${result.deletedCount} notificações deletadas com sucesso` });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar notificações', details: err.message });
  }
}