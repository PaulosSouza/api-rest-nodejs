const mongoose = require('./../../database')

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    require: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

ProjectSchema.pre(/^update/, function (next) {
  this.updatedAt = Date.now()
  console.log('UpdatedAt Project')
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project
