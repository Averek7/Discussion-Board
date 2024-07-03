const express = require("express");
const connectToMongo = require("./connection");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const discussions = require("./routes/discussions");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectToMongo();

app.use("/api/users", users);
app.use("/api/discussions", discussions);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
