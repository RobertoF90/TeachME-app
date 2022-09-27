const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.get('/becomeTeacher', usersController.becomeTeacher);

router.post('/promoteToTeacher', usersController.promoteToTeacher);

router.post('/promoteToStudent', usersController.promoteToStudent);

router.get('/:id', usersController.getStudent);

module.exports = router;
