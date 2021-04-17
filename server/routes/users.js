const express = require('express')

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users')
const User = require('../models/User')

const router = express.Router({ mergeParams: true })

const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(authorize('admin', createUser))

router
  .route('/:id')
  .get(getUser)
  .put(authorize('admin', updateUser))
  .delete(authorize('admin', deleteUser))

module.exports = router
