require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const contactsRouter = require("./routes/contacts.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

module.exports = app;
