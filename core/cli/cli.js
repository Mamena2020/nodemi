#!/usr/bin/env node

const program = require("commander")
const makeModel = require("./model.js")
const makeRequest = require("./request.js")
const makeResource = require("./resource.js")

// import { program } from "commander";
// import makeModel from "./model.js";
// import makeRequest from "./request.js";
// import makeResource from "./resource.js";


program
    .command('make:model <name>')
    // .option('-n, --media <media>', 'pair with media')
    // // .option('-n, --media <media>', 'pair with media')
    .action((name) => {
        makeModel(name)
    });
program
    .command('make:request <name>')
    .action((name) => {
        makeRequest(name)
    });
program
    .command('make:resource <name>')
    .action((name) => {
        makeResource(name)
    });

program.parse(process.argv);