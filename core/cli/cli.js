#!/usr/bin/env node

// const program = require("commander")
// const makeModel = require("./model.js")
// const makeRequest = require("./request.js")
// const makeResource = require("./resource.js")
// const seeder = require("../../core/seeder/seeder.js")

import { program } from "commander";
import makeModel from "./model.js";
import makeRequest from "./request.js";
import makeResource from "./resource.js";
import seeder from "../../core/seeder/seeder.js";

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

program.command('seed:run')
    .action(() => {
        console.log("Running seeder...")
        try {
            seeder()
        } catch (error) {
            console.log("\x1b[31m", "error", error, "\x1b[0m")
        }
    })

program.parse(process.argv);