// ************ Require's ************
const express = require("express");
const router = express.Router();
//const { check } = require("express-validator");
const uploads = require("../../middlewares/uploadMiddleware");

 //************ Validations forms ************
const authMiddleware = require('../../middlewares/authMiddleware');
 const validateForm = require('../../middlewares/validateRegister');

// ************ Controller Require ************
const productsController = require("../controllers/productsController");

/*** GET ALL PRODUCTS ***/
router.get("/", productsController.index);

/*** CREATE ONE PRODUCT ***/
router.get("/create/", authMiddleware, productsController.create);
router.post("/", uploads.any("image"), validateForm.create, productsController.store); //PROBAR ARRAY!!!!

/*** GET ONE PRODUCT ***/
router.get("/detail/:id", productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get("/edit/:id", authMiddleware, productsController.edit);
router.put("/:id", uploads.any("image"), productsController.update);

/*** DELETE ONE PRODUCT ***/
router.delete("/delete/:id", productsController.destroy);

module.exports = router;
