const fs = require("fs");
const { validationResult } = require("express-validator"); //nos va a traer el resultado de las validaciones
const path = require("path");
//path para eliminar las imagenes del producto que se elimina
const productsImgsPath = path.join(__dirname, "../../public/images/products/");
const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
    // Root - Show all products
    index: (req, res) => {
        res.render("products/products", { products: products });
    },

    // Detail - Detail from one product
    detail: (req, res) => {
        let id = req.params.id;
        let product = products.find((e) => e.id == id);
        let priceDiscounted = (product.price - (product.price * product.discount) / 100).toFixed(2);
        res.render("products/detail", { product, priceDiscounted });
    },

    // Create - Form to create
    create: (req, res) => {
        res.render("products/product-create-form");
    },

    // Create -  Method to store
    store: (req, res) => {
        let errors = validationResult(req); // nos va a traer el resultado de las validacionesz
        if (!errors.isEmpty()) {
            return res.render("products/product-create-form", {
                errors: errors.mapped(), //le pasamos el array de errores, puede ser .array()
                old: req.body,
            });
        }
        let images = req.files;
        let product = {
            id: products.length + 1,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            image: images.map((e) => e.filename),
        };
        // if (images.length > 0) {
        //     //console.log('imagenes');
        //     product.image = images.map((e) => e.filename);
        // } else {
        //     //  console.log('no imagenes');
        //     product.image = "no-image.jpg";
        // }
        products.push(product);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.redirect("/products");
    },

    // Update - Form to edit
    edit: (req, res) => {
        let id = req.params.id;
        let product = products.find((e) => e.id == id);
        res.render("products/product-edit-form", { productToEdit: product });
    },
    // Update - Method to update
    update: (req, res) => {
        let id = req.params.id;
        let index = products.findIndex((e) => e.id == id);
        products[index].name = req.body.name || products[index].name;
        products[index].price = req.body.price || products[index].price;
        products[index].discount = req.body.discount || products[index].discount;
        products[index].category = req.body.category || products[index].category;
        products[index].description = req.body.description || products[index].description;
        //req.files > 0 ? products[index].image = req.files.filename : products[index].image = products[index].image;
        if (req.files.length > 0) {
            products[index].image = req.files.map((e) => e.filename);
        } else {
            products[index].image = products[index].image;
        }
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.render("products/products", { products: products });
    },

    // Delete - Delete one product from DB
    destroy: (req, res) => {
        let id = req.params.id;
        let filtered = products.filter((e) => e.id != id);
        let imgToDelete = products.find((e) => e.id == id).image;
        //console.log(filtered);
        try {
            fs.unlinkSync(`${productsImgsPath}${imgToDelete}`);
        } catch (error) {
            console.log('error al eliminar el archivo ', error);
        }
        fs.writeFileSync(productsFilePath, JSON.stringify(filtered, null, 2));
        res.render("products/products", { products: filtered });
    },
};

module.exports = controller;
