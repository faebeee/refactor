#!/usr/bin/env node

import {Command} from "commander";
import {commandSetup} from "../lib/utils/command-setup";
import {createScreenshots, takeScreenshotsForAllConfigs} from "../lib/utils/create-screenshots";
import {
  cleanupFolder,
  CliSerializer,
  FileSerializer,
  getConfig,
  getConfigOutputFolder,
  IScreenshotType,
  logger,
  ResultCollector,
  transformAll,
  transformImageToBase64
} from "refaktor-core";
import {compare} from "../lib/utils/compare-images";
import {cleanup} from "../lib/utils/cleanup";
import path from "path";
import server from 'refaktor-ui';

const open = import('open');

const program = new Command();

program
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
    await takeScreenshotsForAllConfigs(configs, opts.overwrite ?? false, IScreenshotType.ORIGINAL);
    // for (const index in configs) {
    //     const config = configs[index];
    //     if (!opts.only || !!opts.only && config.only === opts.id) {
    //         await createScreenshots(config, )
    //     }
    // }
  });

program.command('compare')
  .argument('config', 'Path to the config .js')
  .option('--out <file>', 'Only executes the command for a given config id')
  .option('--cli', 'Prints the result in a table in the CLI')
  .option('--json', 'Only executes the command for a given config id')
  .option('--base64', 'Inline the images as base64 data')
  .option('--open', 'Open the folder with the results after the command finished')
  .option('--ui', 'Inspect the result in browser UI')
  .description('Takes new screenshots and compares them to the already created ones')
  .action(async (pagesPath, opts) => {
    commandSetup(program);
    const configs = await getConfig(pagesPath);
    const allResults: ResultCollector[] = []
    for (const index in configs) {
      const config = configs[index];
      const compareFolder = path.join(getConfigOutputFolder(config), 'compare', config.id)
      const diffFolder = path.join(getConfigOutputFolder(config), 'diff', config.id)
      await cleanupFolder(compareFolder);
      await cleanupFolder(diffFolder);
      await createScreenshots(config, true, IScreenshotType.COMPARE)
      const result = await compare(config)
      if (opts.base64 || opts.ui) {
        result.addTransformer(transformImageToBase64);
      }
      allResults.push(result);
    }

    const transformed = await transformAll(allResults);

    if (opts.cli) {
      const cliSerializer = new CliSerializer()
      await cliSerializer.serialize(transformed);
    }

    if (opts.out) {
      const fileSerializer = new FileSerializer(opts.out);
      await fileSerializer.serialize(transformed);
    }

    if (opts.open) {
      await (await open).default('./')
    }

    if (opts.ui) {
      if (!opts.out) {
        throw new Error('An out file is required. --out ./foo.json');
      }

      server(path.resolve(process.cwd(), opts.out));
      await (await open).default('http://localhost:3000')
      logger.info('Serving UI @ http://localhost:3000')
    }
  });


program.command('inspect')
  .argument('file', 'Path to the config .js')
  .description('Takes new screenshots and compares them to the already created ones')
  .action(async (file) => {
    server(path.resolve(process.cwd(), file));
    logger.info('Serving UI @ http://localhost:3000')
    await (await open).default('http://localhost:3000')
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
