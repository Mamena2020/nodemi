#!/usr/bin/env node

import { program } from "commander";
import makeModel from "./model.js";
import makeRequest from "./request.js";
import makeResource from "./resource.js";
import makeRule from "./rule.js";
import makeMail from "./mail.js";
import Seeder from "../../core/seeder/Seeder.js";

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
program
    .command('make:mail <name>')
    .action((name) => {
        makeMail(name)
    });
program
    .command('make:rule <name>')
    .action((name) => {
        makeRule(name)
    });

program.command('seed:run')
    .action(() => {
        console.log("Running seeder...")
        try {
            Seeder()
        } catch (error) {
            console.log("\x1b[31m", "error", error, "\x1b[0m")
        }
    })

program.parse(process.argv);