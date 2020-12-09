const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const posts = require("./initialData");
const port = 3000
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here

let curMinCount = 21;
let requestCount = 0;
let timeOutFlag = false;
let timeoutId = null;

function resetFunction(){
    timeOutFlag = false;
    curMinCount = 21;
    requestCount = 0;
    console.log("30s done, clearing..")
    clearTimeout(timeoutId);
}
app.get("/api/posts", (req, res) => {
    let postArr = [];
    requestCount += 1;
    if(!timeOutFlag) {
        timeOutFlag = true;
        //If the timer request has not been initiated yet.
        curMinCount = Number(req.query.max)
        timeoutId = setTimeout(resetFunction, 30000);
    }
    if(requestCount > 5) {
        res.status(429).send({message: "Exceed Number of API Calls"});
    }
    else {
        if(req.query.max !== undefined && Number(req.query.max) <= 20 && Number(req.query.max) > 0 && !isNaN(Number(req.query.max))) {
            curMinCount = Math.min(Number(req.query.max), curMinCount);
            //console.log(curMinCount);
            for(let i = 0; i < curMinCount; i++) {
                postArr.push(posts[i]);
            }
            res.send(postArr);
        }
        else{
            for(let i = 0; i < 10; i++) {
                postArr.push(posts[i]);
            }
            curMinCount = 10;
            res.send(postArr);
        }
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
