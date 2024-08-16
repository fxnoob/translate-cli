const helper = require('../src/helper');
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

describe('helper utility class', () => {
  let tempDir;

  beforeEach(() => {
    // Create a temporary directory
    tempDir = fs.mkdtempSync(path.join(__dirname, 'temp-data'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    // Change back to the original working directory
    process.chdir(__dirname);
    // Remove the temporary directory and its contents
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('it should initialize config file', () => {
    const buildDir = '.';
    const defaultLocale = 'en';
    const jsonData = {
      buildDir,
      defaultLocale,
      locales: helper.locales,
      defaultLocaleFilePth: `${defaultLocale}.translate.config.json`,
    };
    helper.initializeConfigFile({
      filePath: 'translate.config.json',
      jsonData,
    });
    expect(fs.existsSync('translate.config.json')).toEqual(true);
    const savedJsonData = jsonfile.readFileSync('translate.config.json');
    expect(jsonData).toEqual(savedJsonData);
  });

  test('translate unit english to hindi', async () => {
    const sourceEn = 'en';
    const targetEn = 'hi';
    const text = 'test';
    const { translation } = await helper.translate(sourceEn, targetEn, text);
    expect(translation).toBe('परीक्षा')
  });

  test('translate unit hindi to english', async () => {
    const sourceEn = 'hi';
    const targetEn = 'en';
    const text = 'परीक्षा';
    const { translation } = await helper.translate(sourceEn, targetEn, text);
    expect(translation).toBe('Examination')
  });
});
