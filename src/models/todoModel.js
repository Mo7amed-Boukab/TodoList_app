const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Index pour optimiser les recherches par status
todoSchema.index({ status: 1 });

// Index composé pour recherche par status et date de création
todoSchema.index({ status: 1, createdAt: -1 });

// Index texte pour recherche full-text sur title et description
todoSchema.index({ title: 'text', description: 'text' });

// Index pour trier par date de mise à jour
todoSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Todo', todoSchema);
