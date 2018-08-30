let moment = require("moment");
let database = require("./database");

function createMachinehandler(req, res) {
  let machine = req.body;
  console.log(req.body);
  database.db.query("INSERT INTO machines SET ?", machine, function (err, rows) {
    if (err) {
      res.status(500).json({
        status_code: 500,
        status_message: "internal server error"
      });
    } else {
      res.send("succesfully created", rows);
    }
  });
}

function getMachinesHandler(req, res) {
  let page = parseInt(req.query.page, 10);
  let sqlquery;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }
  let offset = (page - 1) * limit;

  let orderby;
  if (req.query.orderby) {
    orderby = database.db.escapeId(req.query.orderby);
  } else {
    orderby = `id`;
  }
  let direction;
  if (req.query.direction) {
    direction = req.query.direction;
  } else {
    direction = "asc";
  }
  let sorter = orderby + ' ' + direction;
  let filter = " ";
  if (req.query.name) {
    filter += "AND name=" + (req.query.name);
  }
  if (req.query.type) {
    filter += "AND type=" + (req.query.type);
  }
  sqlquery = "SELECT * FROM machines WHERE isdeleted IS  ?  " + filter + " ORDER BY " + sorter + "   LIMIT ? OFFSET ?"

  console.log(sqlquery);
  database.db.query(
    sqlquery, [false, limit, offset],
    function (err, rows, fields) {
      if (err) {
        res.status(500).json({
          status_code: 500,
          status_message: "internal server error"
        });
      } else {
        if (rows.length) {
          let machines = [];
          // Loop check on each row
          for (let i = 0; i < rows.length; i++) {
            // Create an object to save current row's data
            let machine = {
              id: rows[i].id,
              name: rows[i].name,
              type: rows[i].type,
              description: rows[i].description
            };
            machines.push(machine);
          }
          console.log(machines);
          res.status(200).json(machines);
        } else {
          res.status(404).end("the resource is not found");
        }
      }
    }
  );
}

function getMachineByIdHandler(req, res) {

  let id = req.params.id;
  database.db.query("SELECT * FROM machines WHERE id =?", id, function (
    err,
    rows,
    fields
  ) {
    //using placeholder to protect ourselves from sql inections

    if (err) {
      res.status(500).json({
        status_code: 500,
        status_message: "internal server error"
      });
    } else {
      // Check if the result is found or not
      if (rows.length == 1) {
        // Create the object to save the data.
        let machine = {
          name: rows[0].name,
          type: rows[0].type,
          description: rows[0].description,
          id: rows[0].id
        };
        // render the details.plug page.
        res.send(machine);
      } else {
        // render not found page
        console.log(rows);
        res.status(404).json({
          status_code: 404,
          status_message: "Not found"
        });
      }
    }
  });
}

function updateMachineHandler(req, res) {
  // return new Promise(async function (resolve, reject) {
  let machineId = req.params.id;
  let newMachineEntry = req.body;
  newMachineEntry["updated_at"] = moment().format();

  database.db.query(
    "UPDATE machines SET ? WHERE id=? AND isdeleted IS ?", [newMachineEntry, machineId, false],
    function (err, result) {

      if (err) {
        res.status(500).json({
          status_code: 500,
          status_message: "internal server error"
        });
      }
      console.log({
        err,
        result
      });
      console.log(result);
      if (result.affectedRows == 0) {
        res.send("Not found");
      } else {
        res.send(result);
      }
    })
}

function deleteMachineHandler(req, res) {
  let id = req.params.id;

  database.db.query(
    "UPDATE machines SET ? WHERE id=?", [{
      deleted_at: moment().format(),
      isdeleted: true
    }, id],
    function (err, rows) {
      if (err) console.log("Error deleting : %s ", err);
      //rows[0].deletedat=currentDate();
      console.log("deleted", rows);
      res.send(rows);
    }
  );
}

module.exports = {
  createMachinehandler,
  getMachinesHandler,
  getMachineByIdHandler,
  updateMachineHandler,
  deleteMachineHandler
};