const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

mongoose.Promise = Promise;
const db_uri =
  "mongodb+srv://theAkbarov:(Sniper60)@cluster0.24agn.mongodb.net/Cluster0?retryWrites=true&w=majority";

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const Message = mongoose.model("message", {
  name: String,
  password: String,
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.get("/messages/:user", (req, res) => {
  const user = req.params.user
  Message.find({name: user}, (err, messages) => {
    res.send(messages);
  });
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket);
});

app.post("/message", async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    console.log("saved...");
    const censored = await Message.findOne({ message: "badword" });

    if (censored) await Message.remove({ _id: censored.id });
    else io.emit("message", req.body);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    return console.error(err);
  } finally {
    console.log("message post called");
  }
});

mongoose.connect(
  db_uri,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    console.log("error while connecting database:", err);
  }
);

http.listen(PORT, () => {
  console.log(`server running on ${PORT} port...`);
});
