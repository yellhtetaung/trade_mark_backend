require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const router = require("./src/router");

const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, createParentPath: "public" }));

app.use(router);

app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
