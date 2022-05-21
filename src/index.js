const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes/route");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", route);
 //27017- monogoDb Default port number
//mongoose.connect("mongodb://localhost:27017/project3")
mongoose.connect("mongodb+srv://sumit1997:47R9ZsJHzXLDslLR@cluster0.zgrvw.mongodb.net/group28Database", { useNewUrlParser: true } )
    .then(() => console.log("MongoDB is connected to 27017"))
    .catch((error) => console.log(error));

app.listen(port, function() {
    console.log(`Express app running on port ${port}`);
});