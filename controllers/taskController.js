const Task = require('../models/Task');
const TaskUser = require('../models/TaskUser');

exports.getAllTasks = async (req, res) => {
  try {
    console.log(">>> req.user recebido:", req.user);

    const links = await TaskUser.find({ userId: req.user._id }).populate('taskId');
    console.log(">>> Quantidade de vínculos encontrados:", links.length);

    const tasks = links
      .map(link => link.taskId)
      .filter(task => task && task.deleted !== true);

    console.log(">>> Quantidade de tarefas filtradas:", tasks.length);

    res.json(tasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};


exports.createTask = async (req, res) => {

  if (!req.body) return res.status(400).json({ error: 'Dados não enviados' });

  const { title, description } = req.body;

  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!description) missingFields.push('description');
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Campo(s) obrigatório(s) ausente(s): ${missingFields.join(', ')}`
    });
  }

  try {
    const task = new Task(req.body);
    await task.save();

    const link = new TaskUser({
      userId: req.user._id,
      taskId: task._id
    });
    await link.save();

    res.status(201).json(task);
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(400).json({ error: 'Erro ao criar tarefa' });
  }
};

exports.editTask = async (req, res) => {
  if (!req.body) return res.status(400).json({ error: 'Dados não enviados' });

  const { title, description } = req.body;

  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!description) missingFields.push('description');
  // se quiser obrigar 'date' ou outros, adicione aqui

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Campo(s) obrigatório(s) ausente(s): ${missingFields.join(', ')}`
    });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar tarefa' });
  }
}

exports.archiveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao arquivar tarefa' });
  }
}

exports.unarchiveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { archived: false }, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desarquivar tarefa' });
  }
}

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao completar tarefa' });
  }
}

exports.uncompleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: false }, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desmarcar tarefa' });
  }
}

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { deleted: true },  { new: true });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};

exports.permanentlyDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir tarefa permanentemente' });
  }
}

exports.getDeletedTasks = async (req, res) => {
  try {
    const links = await TaskUser.find({ userId: req.user._id }).populate('taskId');
    console.log(">>> Quantidade de vínculos encontrados:", links.length);

    const tasks = links
      .map(link => link.taskId)
      .filter(task => task && task.deleted === true);

    console.log(">>> Quantidade de tarefas filtradas:", tasks.length);

    res.json(tasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
}

exports.restoreTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao restaurar tarefa' });
  }
}