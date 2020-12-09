const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const myData = require("./initialData"); 
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here
let max = 21;
let count = 0;
let interval = true;
app.get("/api/posts", (req, res) => {
    count++;
    if(interval) {
        const id = setInterval(() => {
            count = 0;
            interval = true;
            max = 21;
            clearInterval(id);
            // console.log("Interval ended");
        }, 30 * 1000);
    }
    interval = false;
    if(count <= 5) {
        const data = [];
        const currMax = (req.query.max > 0 && req.query.max <= 20 && !isNaN(Number(req.query.max))) ? Number(req.query.max) : 10;
        const min = Math.min(max, currMax);
        for(let i = 0; i < min; i++) {
            data.push(myData[i]);
        }
        if(max > 20) {
            max = currMax;
        }
        res.send(data);
    } else {
        res.status(429).send({message: "Exceed Number of API Calls"});
    }
});
app.listen(port, () => console.log(`App listening on port ${port}!`))
module.exports = app;
