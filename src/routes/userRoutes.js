const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

//middlewares
const authMiddleware = require("../../middlewares/authMiddleware");
const guestMiddleware = require("../../middlewares/guestMiddleware");
const upload = require("../../middlewares/uploadMiddleware");
const validateForm = require("../../middlewares/validateRegister");

//form register
router.get("/register", guestMiddleware, userController.register);

//process register
router.post("/register", upload.single("avatar"), validateForm.register, userController.processRegister);

//form login
router.get("/login", guestMiddleware, userController.login);
router.post("/login", userController.loginProcess);

//profile user login, middle de ruta si ya estoy logueado
router.get("/profile", authMiddleware, userController.profile);

// Edit one user
router.get("/edit/:id", authMiddleware, userController.edit);
//router.put("/:id", upload.single("avatar"), userController.update);

//logout
router.get("/logout", userController.logout);

module.exports = router;
