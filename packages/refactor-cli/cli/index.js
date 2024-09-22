#!/usr/bin/env node

import { Command } from "commander";
import Pkg from '../package.json' assert { type: 'json' };
import { commandSetup } from "../lib/utils/command-setup.js";
import { createScreenshots, takeScreenshotsForAllConfigs } from "../lib/utils/create-screenshots.js";
import {
    cleanupFolder,
    CliSerializer, FileSerializer,
    getConfig,
    getConfigOutputFolder, HtmlSerializer,
    transformAll,
    transformImageToBase64
} from "refactor-core";
import { compare } from "../lib/utils/compare-images.js";
import { cleanup } from "../lib/utils/cleanup.js";
import path from "path";

const program = new Command();

program
    .version(Pkg.version)
    .name('refactor')
    .description('Generates screenshots and compares them to a later run to ensure the refactoring did not change anything unintended')
    .option('-s, --silent', 'be silent')
    .option('-v, --verbose', 'be verbose')

program.command('generate')
    .argument('config', 'Path to your config file')
    .option('--only <id>', 'Only executes the command for a given config id')
    .option('--overwrite', 'Generates a new screenshot even if they already exists.')
    .description('Generates new screenshots and overwrites existing ones')
    .action(async (pagesPath, opts) => {
        commandSetup(program);
        const configs = await getConfig(pagesPath);
        await takeScreenshotsForAllConfigs(configs, opts.overwrite ?? false, 'original');
        // for (const index in configs) {
        //     const config = configs[index];
        //     if (!opts.only || !!opts.only && config.only === opts.id) {
        //         await createScreenshots(config, )
        //     }
        // }
    });

program.command('compare')
    .argument('config', 'Path to the config .js')
    .option('--only <id>', 'Only executes the command for a given config id')
    .option('--out <file>', 'Only executes the command for a given config id')
    .option('--json', 'Only executes the command for a given config id')
    .option('--base64', 'Inline the images as base64 data')
    .option('--html', 'Inline the images as base64 data')
    .description('Takes new screenshots and compares them to the already created ones')
    .action(async (pagesPath, opts) => {
        commandSetup(program);
        const configs = await getConfig(pagesPath);
        const allResults = []
        for (const index in configs) {
            const config = configs[index];
            if (!opts.only || !!opts.only && config.only === opts.id) {
                const compareFolder = path.join(getConfigOutputFolder(config), 'compare', config.id)
                const diffFolder = path.join(getConfigOutputFolder(config), 'diff', config.id)
                // await cleanupFolder(compareFolder);
                // await cleanupFolder(diffFolder);
                await createScreenshots(config, true, 'compare',)
                const result = await compare(config)
                if (opts.base64) {
                    result.addTransformer(transformImageToBase64);
                }
                allResults.push(result);
            }
        }

        const transformed = await transformAll(allResults);

        const cliSerializer = new CliSerializer()
        await cliSerializer.serialize(transformed);

        if (opts.out) {
            const fileSerializer = new FileSerializer(opts.out);
            await fileSerializer.serialize(transformed);
        }

        if (opts.html) {
            const htmlSerializer = new HtmlSerializer('./report.html');
            await htmlSerializer.serialize(transformed);
        }

    });

program.command('cleanup')
    .argument('config', 'Path to the config .js')
    .description('Remove unused screenshots')
    .action(async (pagesPath, opts) => {
        commandSetup(program);
        const configs = await getConfig(pagesPath);
        await cleanup(configs);
    });

program.parse();
