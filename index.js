const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

const db = [
  {
    iNumber: 'i02401312',
    brightness: 60,
    temperature: 2700,
    status: 'off',
    autoTemp: false,
  },
  {
    iNumber: 'i02401311',
    brightness: 40,
    temperature: 6500,
    status: 'on',
    autoTemp: true,
  },
  {
    iNumber: 'i02401313',
    brightness: 80,
    temperature: 5000,
    status: 'on',
    autoTemp: false,
  },
];

const jsonParser = bodyparser.json();
app.use(jsonParser);

app.get('/lamps', async (req, res) => {
  if (req.query.iNumber) {
    res.json(db.filter((lamp) => lamp.iNumber.includes(req.query.iNumber)));
  } else {
    res.json(db);
  }
});

app.put('/lamps/:iNumber', async (req, res) => {
  if (req.params.iNumber) {
    let changed = {};
    db.map((lamp, key) => {
      if (lamp.iNumber === req.params.iNumber) {
        lamp = req.body;
        changed = lamp;
        db[key] = lamp;
      }
    });

    res.json(changed);
  } else {
    res.status(404).send();
  }
});

app.listen(3001);
