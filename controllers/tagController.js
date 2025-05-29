const Tag = require('../models/Tag');

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
}

exports.createTag = async (req, res) => {
  try {

    if(!req.body) {
      return res.status(400).json({ error: 'Dados da tag são obrigatórios' });
    }

    // Validação simples para garantir que o nome da tag seja fornecido
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome da tag é obrigatório' });
    }

    // Verifica se a cor foi fornecida, caso contrário, gera uma cor aleatória
    let { color } = req.body;
    if (!color) {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    const regex = /^#[0-9A-Fa-f]{6}$/;
    if (!regex.test(color)) {
      return res.status(400).json({ error: 'Cor inválida. Deve ser um código hexadecimal no formato #RRGGBB.' });
    }

    // Verifica se a descrição foi fornecida, caso contrário, define como vazia
    const { description } = req.body;


    const tag = new Tag({ name, color, description: description || '' });

    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar tag', details: err.message });
  }
}

exports.editTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da tag é obrigatório' });
    }

    const regex = /^#[0-9A-Fa-f]{6}$/;
    if(color && !regex.test(color)) {
      return res.status(400).json({ error: 'Cor inválida. Deve ser um código hexadecimal no formato #RRGGBB.' });
    }



    const tag = await Tag.findByIdAndUpdate(id, { name, color }, { new: true });
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar tag', details: err.message });
  }
}

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tag', details: err.message });
  }
}

exports.getDeletedTags = async (req, res) => {
  try {
    const tags = await Tag.find({ deleted: true });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tags deletadas' });
  }
}

exports.restoreTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { deleted: false }, { new: true });
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    res.status(204).end();
  }
  catch (err) {
    res.status(500).json({ error: 'Erro ao restaurar tag', details: err.message });
  }
}

exports.permanentlyDeleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tag permanentemente', details: err.message });
  }
}