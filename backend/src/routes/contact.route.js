const contactRoute = require("express").Router();
const { createContact, getAllContacts } = require("../controllers/contact.controller");

contactRoute.post("/", createContact);
contactRoute.get("/", getAllContacts)

module.exports = contactRoute;
