const express = require("express");
const axios = require("axios");

const path = require("path")
const app = express();

// Security
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const jwt = require("jsonwebtoken");
const cors = require("cors");

// File module
const fs = require("fs");
const db = require('./configPg')

const production = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

let globaldata = require('./globaldata.js');
const { env } = require('process');

app.use(cors());
app.use("/", express.static(__dirname + "/assets"));
app.use(bodyParser.json());app.use(bodyParser.urlencoded({extended: true}))

// API tester
app.get("/api", (req, res) => {
    axios.get("https://jsonplaceholder.typicode.com/albums").then((result) => {
      res.status(200).json({
        status: 200,
        message: "test get api successful",
        data: result.data,
      });
    });
  });

if (production) {
    app.use(express.static(path.join(__dirname, "..", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "index.html"));
    });
}

app.listen(port, () => {
    console.log("env", process.env.NODE_ENV, production);
    console.log("The application is listening on port", port);
  });

  app.get("/", (request, response) => {response.json({info: 'Hello world!'});});
  app.get("/students", db.getStudents);
  app.get("/students/:id", db.getStudentById);
  app.put("/students/:id", db.updateStudent);
  app.post("/students", db.createStudent);
  app.delete("/students/:id", db.deleteStudent);
