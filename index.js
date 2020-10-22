const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const shell = require("shelljs");

const app = express();

app.use(cors());

const db = [
  {
    iNumber: "i02401312",
    brightness: 60,
    temperature: 2700,
    status: "off",
    autoTemp: false,
  },
  {
    iNumber: "i02401311",
    brightness: 40,
    temperature: 6500,
    status: "on",
    autoTemp: true,
  },
  {
    iNumber: "i02401313",
    brightness: 80,
    temperature: 5000,
    status: "on",
    autoTemp: false,
  },
];

const temperature = [
  { warm: 766, cold: 1024 }, // 2700
  { warm: 762, cold: 1144 }, // 3000
  { warm: 722, cold: 1214 }, // 3500
  { warm: 692, cold: 1214 }, // 4000
  { warm: 692, cold: 1244 }, // 5000
  { warm: 512, cold: 1278 }, // 6500
];

const jsonParser = bodyparser.json();
app.use(jsonParser);

app.get("/lamps", async (req, res) => {
  if (req.query.iNumber) {
    res.json(db.filter((lamp) => lamp.iNumber.includes(req.query.iNumber)));
  } else {
    res.json(db);
  }
});

app.put("/lamps/:iNumber", async (req, res) => {
  if (req.params.iNumber) {
    let changed = {};
    db.map((lamp, key) => {
      if (lamp.iNumber === req.params.iNumber) {
        lamp = req.body;
        changed = lamp;
        db[key] = lamp;
      }
    });

    const changedLamp = db.filter(
      (lamp) => lamp.iNumber === req.params.iNumber
    );

    let temperatureIndex = 0;
    if (
      changedLamp[0].temperature <= 2700 &&
      changedLamp[0].temperature < 3000
    ) {
      temperatureIndex = 0;
    } else if (
      changedLamp[0].temperature <= 3000 &&
      changedLamp[0].temperature < 3500
    ) {
      temperatureIndex = 1;
    } else if (
      changedLamp[0].temperature <= 3500 &&
      changedLamp[0].temperature < 4000
    ) {
      temperatureIndex = 2;
    } else if (
      changedLamp[0].temperature <= 4000 &&
      changedLamp[0].temperature < 5000
    ) {
      temperatureIndex = 3;
    } else if (
      changedLamp[0].temperature <= 5000 &&
      changedLamp[0].temperature < 6500
    ) {
      temperatureIndex = 4;
    } else if (changedLamp[0].temperature >= 6500) {
      temperatureIndex = 5;
    }

    temperature[temperatureIndex].warm;

    if (changedLamp[0].status === "on") {
      shell.exec(
        `/home/pi/Documents/mbs.sh 8 4098 ${temperature[temperatureIndex].warm} ${temperature[temperatureIndex].cold}`
      );
    } else {
      shell.exec("/home/pi/Documents/mbs.sh 8 4098 65024");
    }

    res.json(changed);
  } else {
    res.status(404).send();
  }
});

app.listen(8080);
