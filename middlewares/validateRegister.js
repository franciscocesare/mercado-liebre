const { body } = require("express-validator");

module.exports = {
    register: [
        body("name")
            .notEmpty()
            .withMessage("El nombre es requerido")
            .bail()
            .isLength({ min: 3, max: 30 })
            .withMessage("Un nombre valido!"),
        body("last_name").notEmpty().withMessage("El apellido es requerido"),
        body("email").notEmpty().withMessage("El email es requerido").isEmail().withMessage("Debe ser un email valido"),
        body("password")
            .isLength({ min: 6, max: 16 })
            .withMessage("un password de al menos 6 caracteres")
            .notEmpty()
            .withMessage("you need a password"),
        body("avatar")
            .custom((value, { req }) => {
                if (req.file) {
                    return true;
                } else {
                    return false;
                }
            })
            .withMessage("La imagen es requerida"),
    ],
    create: [
        body("name")
            .notEmpty().withMessage("El nombre es requerido").bail() //bail corta, ojo si no va a en todos
            .isLength({ min: 3, max: 30}).withMessage("Un nombre valido!"),
        body("price")
            .notEmpty().withMessage("El precio es requerido")
            .isNumeric( { min: 10 }).withMessage("El precio debe ser un numero"),
        body("discount")
            .notEmpty().withMessage("El descuento es requerido")
            .isNumeric().withMessage("El precio es requerido"),
        body("description")
            .isLength({ min: 8, max: 150}).withMessage("una descripcion de al menos 8 caracteres")
            .notEmpty().withMessage("La descripción es requerida"),
        body("image")
            .custom((value, { req }) => {
                if (req.files.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        ).withMessage("La imagen es requerida")
    ]

};
