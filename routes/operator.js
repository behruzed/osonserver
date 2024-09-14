const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { operatorById, read, update, list, remove, create } = require('../controllers/operator');
const { userById } = require('../controllers/user');

router.get('/secret/:operator', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({ operator: req.profile });
});

router.get('/operator/:operatorId', read);
router.post('/operator/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/operator/:operatorId', requireSignin, isAuth, update);
router.delete('/operator/:operatorId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/operators', list);

router.param('operatorId', operatorById);
router.param('userId', userById);


module.exports = router;