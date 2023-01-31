#!/usr/bin/env node

import { program } from "commander";
import makeModel from "./model.js";


program
    .command('make:model <name>')
    // .option('-n, --media <media>', 'pair with media')
    // // .option('-n, --media <media>', 'pair with media')
    .action((name) => {
        makeModel(name)
    });

program.parse(process.argv);