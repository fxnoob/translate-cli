const fs = require('fs');
const path = require('path');
const { select } = require('@inquirer/prompts');
const inquirer = require('inquirer').default;
const jsonfile = require('jsonfile');

const { Validator } = require('./validator');
const helper = require('./helper');

class Translator {
  constructor(options = {}) {
    this.options = options || {};
    this.validator = new Validator();
    this.defaultConfig = {
      defaultLang: 'en',
      languages: [
        'ar',
        'am',
        'bg',
        'bn',
        'ca',
        'cs',
        'da',
        'de',
        'el',
        'en',
        'es',
        'et',
        'fa',
        'fi',
        'fil',
        'fr',
        'gu',
        'he',
        'hi',
        'hr',
        'hu',
        'id',
        'it',
        'ja',
        'kn',
        'ko',
        'lt',
        'lv',
        'ml',
        'mr',
        'ms',
        'nl',
        'no',
        'pl',
        'pt',
        'ro',
        'ru',
        'sk',
        'sl',
        'sr',
        'sv',
        'sw',
        'ta',
        'te',
        'th',
        'tr',
        'uk',
        'vi',
        'zh',
      ],
      buildDir: null,
    };
  }

  async init() {
    const validateInput = (propName) => (value) => {
      if (value === '') return `${propName} can't be Empty!`;
      if (propName === 'buildDir' && !fs.existsSync(value)) {
        return `The directory you provided does not exist. Please provide a different directory name.`;
      }
      return true;
    };
    const questions = [];
    const defaultLocale = await select({
      message: 'Select your default language',
      choices: [
        {
          name: 'Arabic',
          value: 'ar',
          description: 'Spoken primarily in the Arab world.',
        },
        {
          name: 'Amharic',
          value: 'am',
          description: 'The official language of Ethiopia.',
        },
        {
          name: 'Bulgarian',
          value: 'bg',
          description: 'The official language of Bulgaria.',
        },
        {
          name: 'Bengali',
          value: 'bn',
          description:
            'The official language of Bangladesh and widely spoken in India.',
        },
        {
          name: 'Catalan',
          value: 'ca',
          description: 'Spoken in Catalonia, Spain, and other regions.',
        },
        {
          name: 'Czech',
          value: 'cs',
          description: 'The official language of the Czech Republic.',
        },
        {
          name: 'Danish',
          value: 'da',
          description: 'The official language of Denmark.',
        },
        {
          name: 'German',
          value: 'de',
          description:
            'The official language of Germany, Austria, and Switzerland.',
        },
        {
          name: 'Greek',
          value: 'el',
          description: 'The official language of Greece and Cyprus.',
        },
        {
          name: 'English',
          value: 'en',
          description:
            'Widely spoken international language, official in many countries.',
        },
        {
          name: 'Spanish',
          value: 'es',
          description:
            'The official language of Spain and many Latin American countries.',
        },
        {
          name: 'Estonian',
          value: 'et',
          description: 'The official language of Estonia.',
        },
        {
          name: 'Persian',
          value: 'fa',
          description: 'The official language of Iran.',
        },
        {
          name: 'Finnish',
          value: 'fi',
          description: 'The official language of Finland.',
        },
        {
          name: 'Filipino',
          value: 'fil',
          description: 'One of the official languages of the Philippines.',
        },
        {
          name: 'French',
          value: 'fr',
          description:
            'The official language of France and many African countries.',
        },
        {
          name: 'Gujarati',
          value: 'gu',
          description:
            'A widely spoken language in the Indian state of Gujarat.',
        },
        {
          name: 'Hebrew',
          value: 'he',
          description: 'The official language of Israel.',
        },
        {
          name: 'Hindi',
          value: 'hi',
          description: 'One of the official languages of India.',
        },
        {
          name: 'Croatian',
          value: 'hr',
          description: 'The official language of Croatia.',
        },
        {
          name: 'Hungarian',
          value: 'hu',
          description: 'The official language of Hungary.',
        },
        {
          name: 'Indonesian',
          value: 'id',
          description: 'The official language of Indonesia.',
        },
        {
          name: 'Italian',
          value: 'it',
          description: 'The official language of Italy.',
        },
        {
          name: 'Japanese',
          value: 'ja',
          description: 'The official language of Japan.',
        },
        {
          name: 'Kannada',
          value: 'kn',
          description:
            'A widely spoken language in the Indian state of Karnataka.',
        },
        {
          name: 'Korean',
          value: 'ko',
          description: 'The official language of South Korea and North Korea.',
        },
        {
          name: 'Lithuanian',
          value: 'lt',
          description: 'The official language of Lithuania.',
        },
        {
          name: 'Latvian',
          value: 'lv',
          description: 'The official language of Latvia.',
        },
        {
          name: 'Malayalam',
          value: 'ml',
          description:
            'A widely spoken language in the Indian state of Kerala.',
        },
        {
          name: 'Marathi',
          value: 'mr',
          description:
            'A widely spoken language in the Indian state of Maharashtra.',
        },
        {
          name: 'Malay',
          value: 'ms',
          description: 'The official language of Malaysia and Brunei.',
        },
        {
          name: 'Dutch',
          value: 'nl',
          description: 'The official language of the Netherlands and Belgium.',
        },
        {
          name: 'Norwegian',
          value: 'no',
          description: 'The official language of Norway.',
        },
        {
          name: 'Polish',
          value: 'pl',
          description: 'The official language of Poland.',
        },
        {
          name: 'Portuguese',
          value: 'pt',
          description: 'The official language of Portugal and Brazil.',
        },
        {
          name: 'Romanian',
          value: 'ro',
          description: 'The official language of Romania.',
        },
        {
          name: 'Russian',
          value: 'ru',
          description: 'The official language of Russia.',
        },
        {
          name: 'Slovak',
          value: 'sk',
          description: 'The official language of Slovakia.',
        },
        {
          name: 'Slovenian',
          value: 'sl',
          description: 'The official language of Slovenia.',
        },
        {
          name: 'Serbian',
          value: 'sr',
          description: 'The official language of Serbia.',
        },
        {
          name: 'Swedish',
          value: 'sv',
          description: 'The official language of Sweden.',
        },
        {
          name: 'Swahili',
          value: 'sw',
          description: 'A widely spoken language in East Africa.',
        },
        {
          name: 'Tamil',
          value: 'ta',
          description:
            'A widely spoken language in the Indian state of Tamil Nadu and Sri Lanka.',
        },
        {
          name: 'Telugu',
          value: 'te',
          description:
            'A widely spoken language in the Indian state of Andhra Pradesh and Telangana.',
        },
        {
          name: 'Thai',
          value: 'th',
          description: 'The official language of Thailand.',
        },
        {
          name: 'Turkish',
          value: 'tr',
          description: 'The official language of Turkey.',
        },
        {
          name: 'Ukrainian',
          value: 'uk',
          description: 'The official language of Ukraine.',
        },
        {
          name: 'Vietnamese',
          value: 'vi',
          description: 'The official language of Vietnam.',
        },
        {
          name: 'Chinese',
          value: 'zh',
          description: 'The official language of China.',
        },
      ],
    });
    questions.push({
      type: 'input',
      name: 'buildDir',
      validate: validateInput('buildDir'),
      message: 'Type relative path for the build directory:',
    });
    questions.push({
      type: 'confirm',
      name: 'install',
      default: false,
      message: 'do you really want to initialize?',
    });
    const answers = await inquirer.prompt(questions);
    if (!answers.install) {
      return;
    }
    // initialize translator config file
    await helper.initializeConfigFile({
      filePath: 'translate.config.json',
      jsonData: {
        buildDir: answers.buildDir,
        defaultLocale: defaultLocale,
        locales: this.defaultConfig.languages,
        defaultLocaleFilePth: `${defaultLocale}.translate.config.json`,
      },
    });
    // create default locale file in current directory
    fs.writeFileSync(`${defaultLocale}.translate.config.json`, '{}');
    // create locale files directories
    for (const locale of this.defaultConfig.languages) {
      const p = path.join(answers.buildDir, `_locales/${locale}/messages.json`);
      await helper.createFileWithDirs(p);
    }
  }

  async sync() {
    const configPath = this.options.configFilePath;
    if (!fs.existsSync(configPath)) {
      console.log('translate.config.json file does not exist.');
      return;
    }
    const config = jsonfile.readFileSync(configPath);
    if (!fs.existsSync(config.defaultLocaleFilePth)) {
      console.log(
        `${config.defaultLocale}.translate.config.json file does not exist.`
      );
      return;
    }
    const defaultLocaleJson = jsonfile.readFileSync(
      config.defaultLocaleFilePth
    );
    try {
      await this.validator.validateLocaleContent(defaultLocaleJson);
    } catch (e) {
      console.log(`Invalid ${config.defaultLocale}.translate.config.json file`);
      return;
    }
    // empty object check
    if (Object.values(defaultLocaleJson).length === 0) {
      return;
    }
    const defaultLocale = config.defaultLocale;
    const newKeys = Object.keys(defaultLocaleJson);
    const targetDirRoot = `${config.buildDir}/_locales`;
    const locales = this.defaultConfig.languages;
    for (let i = 0; i < locales.length; i++) {
      const locale = locales[i];
      const oldJsonFilePath = path.join(
        targetDirRoot,
        `/${locale}/messages.json`
      );
      const oldJsonFile = jsonfile.readFileSync(oldJsonFilePath);
      for (let j = 0; j < newKeys.length; j++) {
        const newKey = newKeys[j];
        if (!oldJsonFile[newKey]) {
          const message =
            typeof defaultLocaleJson[newKey] === 'string'
              ? defaultLocaleJson[newKey]
              : defaultLocaleJson[newKey].message;
          const { translation } = await helper.translate(
            defaultLocale,
            locale,
            message
          );
          oldJsonFile[newKey] =
            typeof defaultLocaleJson[newKey] === 'string'
              ? translation
              : {
                  message: translation,
                  description: defaultLocaleJson[newKey].description,
                };
          console.log('updating key ->', newKey, '  ->  ', oldJsonFile[newKey]);
        }
      }
      await this.clearObsoleteTranslations(defaultLocaleJson, oldJsonFile, locale);
      jsonfile.writeFileSync(oldJsonFilePath, oldJsonFile, { flag: 'w' });
    }
  }
  async clearObsoleteTranslations(currentLocaleJson, targetLocaleJson, locale) {
    for (const key in targetLocaleJson) {
      if (!currentLocaleJson.hasOwnProperty(key)) {
        console.log(`Erasing obsolete key: ${key}, from locale: ${locale}`);
        delete targetLocaleJson[key];
      }
    }
  }
}
exports.Translator = Translator;
