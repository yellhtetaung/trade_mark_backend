import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./src/router.mjs";

const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(router);

app.listen(port, () => console.log(`Server is listening on port ${port}`));

export default app;
