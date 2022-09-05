const express = require("express");
//const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../../models/User");
// const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
// const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const controller = {
    register: (req, res) => {
        res.render("users/register");
    },
    processRegister: (req, res) => {
        let errors = validationResult(req);
        if (errors.errors.length > 0) {
            // console.log(" hay errores");
            return res.render("users/register", {
                errors: errors.mapped(), //que pasa si no tiene mapped
                old: req.body,
            });
        }
        let userExists = User.findByField("email", req.body.email); //si el usuario existe no lo guardo
        if (userExists) {
            console.log("el usuario ya existe");
            return res.render("users/register", {
                errors: [
                    {
                        msg: "El usuario ya existe",
                    },
                ],
                old: req.body,
            });
        }
        let userTocreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            avatar: req.file.filename,
        };
        let userCreated = User.create(userTocreate);
        return res.redirect("/users/profile");
    },
    login: (req, res) => {
        // console.log(req);
        res.render("users/login");
    },
    loginProcess: (req, res) => {
        let userToLogin = User.findByField("email", req.body.email);
        if (userToLogin) {
            let isValid = bcryptjs.compareSync(req.body.password, userToLogin.password);
            if (isValid) {
                delete userToLogin.password; //solo para pasar datos sin hash, eliminamos la propiedad
                req.session.userLogged = userToLogin; //save the usser session
                if (req.body.remember_me) {
                    //console.log(req.body.remember_me)
                    res.cookie("userEmail", userToLogin.email, { maxAge: 1000 * 60 }); //save the cookie 1 min
                }
                return res.redirect("/products");
            }
            return res.render("users/login", {
                errors: [
                    {
                        msg: "credenciales invalidasssssss",
                    },
                ],
                // old: req.body,
            });
        }
        return res.render("users/login", {
            errors: [
                {
                    msg: "El usuario no existe",
                },
            ],
            old: req.body,
        });
    },
    edit: (req, res) => {
        let user = User.findByField("email", req.session.userLogged.email);
        // console.log(user.id);
        res.render("users/edit", {
            userToEdit: user,
        });
    },
    profile: (req, res) => {
        //console.log(req.cookies.userEmail);
        res.render("users/profile", { user: req.session.userLogged }); //no tengo este hecho
    },
    logout: (req, res) => {
        res.clearCookie("userEmail");
        req.session.destroy(); //cierra el session del userlogged
        //console.log(req.session);
        res.redirect("/");
    },
};

module.exports = controller;
