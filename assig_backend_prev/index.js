const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
// const AgentRouter = require('./Routes/AgentRouter');
const TaskRouter = require('./Routes/TaskRouter');
const cors = require('cors');



require('dotenv').config();
require('./Model/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});


app.use(bodyParser.json());
app.use(cors());
console.log("AuthRouter loaded:", AuthRouter);
app.use('/auth', AuthRouter);
app.use("/tasks", TaskRouter);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})