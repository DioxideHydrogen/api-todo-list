require('dotenv').config(); // se estiver usando .env
const mongoose = require('mongoose');
const Task = require('../models/Task'); // ajuste o caminho se necessário

function generateUniqueNumericId() {
  return `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

async function updateTasksWithUniqueIds() {
  await mongoose.connect(process.env.MONGO_URI); // ou URL direto

  const tasks = await Task.find({ uniqueId: { $exists: false } });

  console.log(`Encontradas ${tasks.length} tarefas sem uniqueId.`);

  for (let task of tasks) {
    let newId;
    let exists = true;

    while (exists) {
      newId = generateUniqueNumericId();
      exists = await Task.exists({ uniqueId: newId });
    }

    task.uniqueId = newId;
    await task.save();
    console.log(`Tarefa ${task._id} atualizada com uniqueId: ${newId}`);
  }

  await mongoose.disconnect();
  console.log("✔ Migração concluída!");
}

updateTasksWithUniqueIds().catch(err => {
  console.error("Erro durante a migração:", err);
});
