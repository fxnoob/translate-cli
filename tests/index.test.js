const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const subProgram = require('../index');
const pkg = require('../package.json');
const jsonfile = require('jsonfile');
const helper = require('../src/helper');
const prompts = require('@inquirer/prompts');

jest.setTimeout(10000 * 60); // Set timeout to 10 minutes for this test
// Mock dependencies
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));
jest.mock('@inquirer/prompts', () => ({
  select: jest.fn(),
}));
console.log = jest.fn();

// Utility function to run CLI commands
const runCLI = (args) => {
  return execSync(`node ../cmd.js ${args}`, {
    cwd: path.resolve(__dirname),
    encoding: 'utf-8',
  });
};

describe('translate CLI', () => {
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

  it('should display the version and description', () => {
    const output = runCLI('--version');
    expect(output).toContain(pkg.version);

    const helpOutput = runCLI('--help');
    expect(helpOutput).toContain(subProgram._description);
  });

  it('translate init double time throw error that file already exists', async () => {
    const locale = 'hi';
    const buildDir = '.';
    prompts.select.mockResolvedValue(locale);
    inquirer.prompt.mockResolvedValue({ install: true, buildDir });
    await subProgram.parseAsync(['node', 'test', 'init']); // Simulating 'translate init' command
    await subProgram.parseAsync(['node', 'test', 'init']); // Simulating 'translate init' command
    expect(console.log).toHaveBeenCalledWith(
      `config file translate.config.json already exists!`
    );
  });

  it('should initialize a new translator when config file does not exist', async () => {
    const locale = 'hi';
    const buildDir = '.';
    prompts.select.mockResolvedValue(locale);
    inquirer.prompt.mockResolvedValue({ install: true, buildDir });
    await subProgram.parseAsync(['node', 'test', 'init']); // Simulating 'translate init' command
    const generatedTranslateConfig = jsonfile.readFileSync(
      path.join(process.cwd(), 'translate.config.json')
    );
    console.log(
      'validating the generation of the translation configuration file...'
    );
    expect(generatedTranslateConfig).toEqual({
      buildDir,
      defaultLocale: locale,
      locales: helper.locales,
      defaultLocaleFilePth: `${locale}.translate.config.json`,
    });
  });

  it('should sync translation if config file exists', async () => {
    const locale = 'en';
    const buildDir = '.';
    prompts.select.mockResolvedValue(locale);
    inquirer.prompt.mockResolvedValue({ install: true, buildDir });
    await subProgram.parseAsync(['node', 'test', 'init']); // Simulating 'translate init' command
    const defaultLocaleFilePath = path.join(
      process.cwd(),
      buildDir,
      `${locale}.translate.config.json`
    );
    jsonfile.writeFileSync(
      defaultLocaleFilePath,
      { appName: 'test' },
      { flag: 'w' }
    );
    await subProgram.parseAsync(['node', 'test', 'sync']); // Simulating 'translate sync' command
    const generatedTranslateConfig = jsonfile.readFileSync(
      path.join(process.cwd(), 'translate.config.json')
    );
    console.log(
      'validating the generation of the translation configuration file...'
    );
    expect(generatedTranslateConfig).toEqual({
      buildDir,
      defaultLocale: locale,
      locales: helper.locales,
      defaultLocaleFilePth: `${locale}.translate.config.json`,
    });
  });

  it('should not init if translate.config.json file does not exist', async () => {
    await subProgram.parseAsync(['node', 'test', 'sync']); // Simulating 'translate sync' command
    expect(console.log).toHaveBeenCalledWith(
      `config file translate.config.json does not exist!`
    );
  });
});
