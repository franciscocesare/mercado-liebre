// ************ Require's ************
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override"); // Pasar poder usar los métodos PUT y DELETE
const userLoggedMiddleware = require("../middlewares/userLoggedMiddleware");

const app = express();
const PORT = process.env.PORT || 8888;

//**************Middleware ************/
app.use(cookieParser()); //OJO QUE ACA IBA EL OTRO COOKIES
app.use(session({ secret: "Secretssss", resave: false, saveUninitialized: false }));
app.use(userLoggedMiddleware)   //va despues de iniciar sesion!!! por eso despues del session
app.use(methodOverride("_method")); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(express.static(path.join(__dirname, "../public"))); // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());

// ************ Template Engine - (don't touch) ************
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // Define la ubicación de la carpeta de las Vistas


// ************ Route System require and use() ************
const mainRouter = require("./routes/mainRoutes"); // Rutas main
const productsRouter = require("./routes/productsRoutes"); // Rutas /products
const usersRouter = require("./routes/userRoutes"); // Rutas /users

app.use("/", mainRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);

// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => next(createError(404)));

// ************ error handler ************
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.path = req.path;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));