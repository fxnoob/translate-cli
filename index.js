#!/usr/bin/env node
const fs = require('fs');
const { program } = require('commander');
const { Translator } = require('./src/translator');
const { IntlUtil } = require('./src/intl');
const pkg = require('./package.json');

const intl = new IntlUtil();

program.version(pkg.version).description(intl.t('appDesc'));

program
  .command('init')
  .description(intl.t('initCmdDesc'))
  .action(async (options) => {
    try {
      const configFilePath = `${process.cwd()}/translate.config.json`;
      if (fs.existsSync(configFilePath)) {
        console.log(intl.t('configFileExists'));
        return;
      }
      const translator = new Translator({ ...options, configFilePath });
      await translator.init();
    } catch (e) {
      throw new Error(e.message);
    }
  });

program
  .command('sync')
  .description(intl.t('syncCmdDesc'))
  .action(async (options) => {
    try {
      const configFilePath = `${process.cwd()}/translate.config.json`;
      if (!fs.existsSync(configFilePath)) {
        console.log(intl.t('configFileDoesNotExist'));
        return;
      }
      // TODO: validate translate.config.json file
      const translator = new Translator({ ...options, configFilePath });
      await translator.sync();
    } catch (e) {
      throw new Error(e.message);
    }
  });

program.parse(process.argv);
