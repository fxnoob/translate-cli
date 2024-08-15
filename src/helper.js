const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const translateNG = require('node-google-translate-skidz');

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

async function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  try {
    await fs.mkdir(dirname, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory: ${err}`);
  }
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

async function translate(sourceEn, targetEn, text) {
  return new Promise((resolve, reject) => {
    try {
      translateNG(
        {
          text: text,
          source: sourceEn,
          target: targetEn,
        },
        (res) => {
          resolve(res);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

function getSystemLocale() {
  const envLocale =
    process.env.LC_ALL ||
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    process.env.LANGUAGE;
  return envLocale
    ? envLocale
    : new Intl.DateTimeFormat().resolvedOptions().locale;
}

exports.createFileWithDirs = createFileWithDirs;
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.initializeConfigFile = initializeConfigFile;
exports.translate = translate;
exports.getSystemLocale = getSystemLocale;
exports.locales = locales;
