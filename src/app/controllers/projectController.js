const Project = require('../models/Project')
const Task = require('../models/Task')

module.exports = {
  async index (req, res) {
    try {
      const projects = await Project.find().populate(['user'])

      return res.send({ projects })
    } catch (err) {
      return res.status(500).send({ error: 'Error loading projects' })
    }
  },

  async store (req, res) {
    try {
      const { title, description, tasks } = req.body

      const project = await Project.create({ title, description, user: req.userId })

      await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id })

        await projectTask.save()

        project.tasks.push(projectTask)
      }))

      await project.save()

      return res.send({ project })
    } catch (err) {
      return res.status(500).send({ error: 'Error creating new project' })
    }
  },

  async show (req, res) {
    try {
      const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])

      return res.send({ project })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ error: 'Error loading project' })
    }
  },

  async update (req, res) {
    try {
      const { title, description, tasks } = req.body

      const project = await Project.findByIdAndUpdate(req.params.projectId, {
        title,
        description
      }, { new: true })

      if (!project) {
        return res.status(400).send({ error: 'Project invalid' })
      }

      project.tasks = []
      await Task.deleteMany({ project: project._id })

      await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id })

        await projectTask.save()

        project.tasks.push(projectTask)
      }))

      await project.save()

      project.populate(['user', 'tasks'])

      return res.send({ project })
    } catch (err) {
      return res.status(500).send({ error: 'Error creating new project' })
    }
  },

  async delete (req, res) {
    try {
      await Project.findByIdAndRemove(req.params.projectId)

      return res.send()
    } catch (err) {
      return res.status(500).send({ error: 'Error delete project' })
    }
  }
}
