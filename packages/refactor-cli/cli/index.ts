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
  HtmlSerializer,
  IScreenshotType,
  ResultCollector,
  transformAll,
  transformImageToBase64
} from "refaktor-core";
import {compare} from "../lib/utils/compare-images";
import {cleanup} from "../lib/utils/cleanup";
import path from "path";
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
  .option('--only <id>', 'Only executes the command for a given config id')
  .option('--out <file>', 'Only executes the command for a given config id')
  .option('--json', 'Only executes the command for a given config id')
  .option('--base64', 'Inline the images as base64 data')
  .option('--html', 'Inline the images as base64 data')
  .option('--open', 'Open the folder with the results after the command finished')
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
      if (opts.base64) {
        result.addTransformer(transformImageToBase64);
      }
      allResults.push(result);
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
    
    if (opts.open) {
      await (await open).default('./')
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
