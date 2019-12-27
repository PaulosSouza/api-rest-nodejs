const mongoose = require('../../database/index')

const TaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

TaskSchema.pre(/^update/, function (next) {
  this.updatedAt = Date.now()
  console.log('UpdatedAt Task')
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
