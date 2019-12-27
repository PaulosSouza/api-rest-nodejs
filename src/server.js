const express = require('express')

const authRoutes = require('./app/routes/authRoutes')
const projectRoutes = require('./app/routes/projectRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)
app.use('/projects', projectRoutes)

app.listen(3001)
