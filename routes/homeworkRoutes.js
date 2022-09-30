const express = require('express');
const homeworkController = require('../controllers/homeworkController');
const router = express.Router();

router.get('/', homeworkController.getAllHomework);

router.post('/create', homeworkController.createHomework);

router.post('/:id/deliver', homeworkController.deliverHomework);

router.post('/:id/check', homeworkController.checkHomework);

router.get('/:id', homeworkController.getOneHomework);

router.delete('/deleteHomework',homeworkController.deleteHomework)

module.exports = router;
