const express = require('express');
const router = express.Router();
const storyController = require('../../controllers/storyController');
const imageUpload = require('../../middlewares/imageUpload');
const verifyJWT = require('../../middlewares/verifyJWT');
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.get('/user/stories/', verifyJWT, storyController.getStoryByUser);
router.get('/user/imagestories', verifyJWT, storyController.getImageStoriesByUser);
router.get('/user/textstories', verifyJWT, storyController.getTextStoriesByUser);
router.post('/generatestory', verifyJWT, storyController.generateStory);
router.post('/imgtostory', verifyJWT, imageUpload(), storyController.imageToStory);
router.post('/imagestory', verifyJWT, storyController.generateImageStory);

module.exports = router;  