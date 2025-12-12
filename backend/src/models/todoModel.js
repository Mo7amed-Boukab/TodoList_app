const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'done'],
        message: 'Status must be: todo, in_progress, or done',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be: low, medium, high, or urgent',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index pour optimiser les recherches par status
todoSchema.index({ status: 1 });

// Index pour optimiser les recherches par priority
todoSchema.index({ priority: 1 });

// Index composé pour recherche par status et order (drag & drop)
todoSchema.index({ user: 1, status: 1, order: 1 });

// Index composé pour recherche par status et date de création
todoSchema.index({ status: 1, createdAt: -1 });

// Index texte pour recherche full-text sur title et description
todoSchema.index({ title: 'text', description: 'text' });

// Index pour trier par date de mise à jour
todoSchema.index({ updatedAt: -1 });

// Index pour dueDate (filtrage par échéance)
todoSchema.index({ dueDate: 1 });

// Middleware pour définir l'ordre automatiquement lors de la création
todoSchema.pre('save', async function (next) {
  if (this.isNew && this.order === 0) {
    const Todo = mongoose.model('Todo');
    const lastTodo = await Todo.findOne({
      user: this.user,
      status: this.status,
    }).sort({ order: -1 });
    this.order = lastTodo ? lastTodo.order + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Todo', todoSchema);
