//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//let database = require('../models/database');

//Require the dev-dependencies
const chai = require("chai");

const chaiHttp = require("chai-http");
const server = require("../app");
const expect = chai.expect;
const database = require("../models/database");
const machines = require("../models/machine").machines;

chai.use(chaiHttp);

before(async function() {
  await machines.destroy({
    truncate: true,
    force: true,
    individualHooks: true,
    logging: true
  });
  await machines.create({
    name: "machinetest1",
    description: "machinetest1description",
    individualHooks: true
  });
  await machines.create({
    name: "machinetest2",
    description: "machinetest2description",
    individualHooks: true
  });
  await machines.create({
    name: "machinetest3",
    description: "machinetest3description",
    individualHooks: true
  });
});

describe("GET /machines", done => {
  it("should send an array of machines", done => {
    chai
      .request(server)
      .get("/machines")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        done();
      });
  });
});

describe("GET /machines", done => {
  const machineId = 1;
  it("should send a specific machine if it exists", done => {
    chai
      .request(server)
      .get("/machines/" + machineId)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");

        done();
      });
  });
});

describe("GET /machines", done => {
  it("should not send a machine if it does not exist", done => {
    chai
      .request(server)
      .get("/machines/8")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res).to.be.string;
        expect(res.body).to.be.a("object");
        done();
      });
  });
});

describe("Create a machine", function() {
  it("should create a machine", function(done) {
    chai
      .request(server)

      .post("/machines")
      .send({ name: "createdmachine2", description: "createdmachinedesc" })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        machines
          .findOne({ where: { name: "createdmachine2" } })
          .then(machine => {
            expect(machine.name).equal("createdmachine2");
          })
          .then(done, done);
      });
  });
});

describe("update a machine", function() {
  it("should update a specific machine", function(done) {
    const machineId = 1;

    chai
      .request(server)

      .patch("/machines/" + machineId)
      .send({
        name: "updatedmachinename",
        description: "updatedmachinedescription"
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        machines
          .findOne({ where: { name: "updatedmachinename" } })
          .then(machine => {
            expect(machine.name).equal("updatedmachinename");
          })
          .then(done, done);
      });
  });
});

describe("update a machine", function() {
  it("should delete a specific machine", function(done) {
    const machineId = 1;

    chai
      .request(server)

      .del("/machines/" + machineId)

      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        machines
          .findById(machineId)
          .then(machine => {
            expect(machine).to.be.null;
          })
          .then(done, done);
      });
  });
});
