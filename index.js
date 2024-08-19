const fs = require('fs');
const { Command } = require('commander');
const { Translator } = require('./src/translator');
const { IntlUtil } = require('./src/intl');
const pkg = require('./package.json');

const intl = new IntlUtil();

const subProgram = new Command('translate');

subProgram.version(pkg.version).description(intl.t('appDesc'));

subProgram
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
    } catch (e) { /* empty */ }
  });

subProgram
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
    } catch (e) { /* empty */ }
  });

module.exports = subProgram;
