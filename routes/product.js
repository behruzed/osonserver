const express = require("express");
const router = express.Router();

const { 
    create, productById, read, remove, update, list, listChosenCategory,
    listRelated, listCategories, listBySearch, photo, photo1, photo2, listSearch, listProducts, getButtons 
} = require("../controllers/product");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get('/product/:productId', read);
router.get('/all-products', listProducts);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/category', listChosenCategory);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);
router.get('/product/photo1/:productId', photo1);
router.get('/product/photo2/:productId', photo2);
router.get('/products/getbuttons', getButtons)

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
