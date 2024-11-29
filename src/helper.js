const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const translateNG = require('./google-translate');

const locales = [
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
];

async function initializeConfigFile(props) {
  jsonfile.writeFileSync(props.filePath, props.jsonData, { flag: 'w' });
}

async function createFileWithDirs(filePath, jsonData = {}) {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // Create the necessary directories
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create the JSON file with empty content
    fs.writeFileSync(filePath, JSON.stringify(jsonData));
    console.log(`Created ${filePath}`);
  } else {
    console.log(`${filePath} already exists`);
  }
}

async function translate(sourceLanguage, targetLanguage, text) {
  try {
    const translationResult = await new Promise((resolve, reject) => {
      translateNG(
        {
          text,
          source: sourceLanguage,
          target: targetLanguage,
        },
        (response) => {
          if (response && response.translation) {
            return resolve(response.translation);
          } else {
            return reject(
              new Error('Translation service returned an invalid response.')
            );
          }
        }
      );
    });
    return translationResult;
  } catch (error) {
    return undefined
  }
}
const validateInput = (propName) => (value) => {
  if (!value || value === '') return `${propName} can't be Empty!`;
  if (propName === 'buildDir' && !fs.existsSync(value)) {
    return `The directory you provided does not exist. Please provide a different directory name.`;
  }
  return true;
};

exports.createFileWithDirs = createFileWithDirs;
exports.initializeConfigFile = initializeConfigFile;
exports.translate = translate;
exports.locales = locales;
exports.validateInput = validateInput;
