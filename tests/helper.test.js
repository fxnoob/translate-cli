const helper = require('../src/helper');
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const nock = require('nock');

console.log = jest.fn();
console.warn = jest.fn();

describe('helpers utility class', () => {
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

  test('helpers it should initialize config file', () => {
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

  test('helpers translate unit english to hindi', async () => {
    const sourceEn = 'en';
    const targetEn = 'hi';
    const text = 'test';
    const translation = await helper.translate(sourceEn, targetEn, text);
    expect(translation).toBe('परीक्षा');
  });

  test('helpers translate unit hindi to english', async () => {
    const sourceEn = 'hi';
    const targetEn = 'en';
    const text = 'परीक्षा';
    const translation = await helper.translate(sourceEn, targetEn, text);
    expect(translation).toBe('Examination');
  });

  test('helpers translate should fail if there is no network connection', async () => {
    nock.disableNetConnect();
    const sourceEn = 'en';
    const targetEn = 'hi';
    const text = 'test';
    try {
      const translation = await helper.translate(sourceEn, targetEn, text);
      expect(translation).toBe(undefined);
    } catch (e) {
      /* empty */
    }
  });

  test('helpers should throw error after calling createFileWithDirs twice', async () => {
    const dirPath = '_locales/en/messages.json';
    await helper.createFileWithDirs(dirPath);
    await helper.createFileWithDirs(dirPath);
    expect(console.log).toHaveBeenCalledWith(`${dirPath} already exists`);
  });

  test('helpers translate should throw error if parameters are wrong', async () => {
    jest.mock('node-google-translate-skidz', () =>
      jest.fn(() => Promise.reject('failed'))
    );
    const sourceEn = null;
    const targetEn = 'hi';
    const text = 'test';
    await expect(helper.translate(sourceEn, targetEn, text)).rejects.toThrow(
      'Translation service returned an invalid response.'
    );
  });

  test('helpers validate command inputs', async () => {
    expect(helper.validateInput('locale')('en')).toBe(true);
    // should return error if value is empty
    expect(helper.validateInput('locale')(null)).toBe(`locale can't be Empty!`);
    // should check for dir if buildDir prop is given
    expect(helper.validateInput('buildDir')('src')).toBe(
      `The directory you provided does not exist. Please provide a different directory name.`
    );
    expect(helper.validateInput('buildDir')('.')).toBe(true);
  });
});
