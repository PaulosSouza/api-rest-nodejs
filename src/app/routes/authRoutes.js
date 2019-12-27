const express = require('express')

const authController = require('../controllers/authController')

const router = express.Router()

router.post('/register', authController.register)
router.post('/authenticate', authController.authenticate)
router.post('/forgot_password', authController.forgotPassword)
router.post('/reset_password', authController.resetPassword)

module.exports = router
