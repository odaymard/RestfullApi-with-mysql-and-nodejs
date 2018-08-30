let express = require('express');
let app = express();
let handlers=require('./models/handlers');
let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

let url = require('url');
let _ = require("lodash");
let port = process.env.PORT || 3000;

app.post('/machines', handlers.createMachinehandler)
app.patch('/machines/:id([0-9]+)',handlers.updateMachineHandler);  //  //[0-9]+ regexp to accept only numbers
app.get('/machines/', handlers.getMachinesHandler);
app.get('/machines/:id([0-9]+)',handlers.getMachineByIdHandler) 
app.delete('/machines/:id([0-9]+)',handlers.deleteMachineHandler)

app.listen(port, function () {
  console.log('listening on port', port);
});