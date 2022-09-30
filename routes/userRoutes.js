const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.post('/changeToTeacher', usersController.changeToTeacher);

router.post('/changeToStudent', usersController.changeToStudent);

router.get('/:id', usersController.getStudent);

module.exports = router;
