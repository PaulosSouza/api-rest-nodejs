const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')

const projectController = require('../controllers/projectController')

const router = express.Router()

router.use(authMiddleware)

router.get('/', projectController.index)

router.get('/:projectId', projectController.show)

router.post('/', projectController.store)

router.put('/:projectId', projectController.update)

router.delete('/:projectId', projectController.delete)

module.exports = router
