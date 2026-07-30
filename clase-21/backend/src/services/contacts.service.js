const { readDB, writeDB } = require("../utils/db");
const { createContact } = require("../models/contacts.model");

const getAll = () => {
  const db = readDB("contacts.json");
  return db.contacts;
};

const create = (fields) => {
  const db = readDB("contacts.json");

  const newContact = createContact(fields);

  db.contacts.push(newContact);

  writeDB("contacts.json", db);

  return newContact;
};

const update = (id, fields) => {
  const db = readDB("contacts.json");

  const index = db.contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Contacto no encontrado" });
  }

  db.contacts[index] = { ...db.contacts[index], ...fields, id };

  writeDB("contacts.json", db);

  return db.contacts[index];
};

const remove = (id) => {
  const db = readDB("contacts.json");

  const index = db.contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Contacto no encontrado" });
  }

  db.contacts.splice(index, 1);
  writeDB("contacts.json", db);
};

module.exports = { getAll, update, create, remove };
