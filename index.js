import express from "express";

import dotenv from "dotenv";
import { Connection } from "./Databse/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/Routes.js";
import LoginRoutes from "./routes/LoginRoute.js";
import adminRoutes from "./routes/adminroutes.js"
import EmployeeRoutes from "./routes/UserRoutes.js";
import createblogs from './routes/blogRoutes.js';
import propertyRouter from "./routes/propertyRoutes.js";

// import blogRoutes from './routes/blogRoutes.js';
import Typecategory from './routes/Typeroute.js';

dotenv.config();
const app = express();


const Port = process.env.PORT || 3000;



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use("/", Routes);
app.use("/api/user/", EmployeeRoutes);
app.use("/api/", Typecategory);
app.use("/api/admin/", adminRoutes);
app.use("/api/", createblogs);
app.use("/api/userLogin/", LoginRoutes);
app.use("/api/project/", propertyRouter);





Connection();

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});

// module.exports = app;
