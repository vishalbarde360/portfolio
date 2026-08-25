const contactRoute = require("express").Router();
const { createContact } = require("../controllers/contact.controller");

contactRoute.post("/", createContact);

module.exports = contactRoute;
