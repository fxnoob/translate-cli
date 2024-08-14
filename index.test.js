const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const subProgram = require('./index');

// Mock the console.log to test outputs
console.log = jest.fn();

// Utility function to run CLI commands
const runCLI = (args) => {
  return execSync(`node cmd.js ${args}`, {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf-8',
  });
};

describe('translate CLI', () => {
  const configFilePath = path.resolve(process.cwd(), 'translate.config.json');

  afterEach(() => {
    if (fs.existsSync(configFilePath)) {
      fs.unlinkSync(configFilePath);
    }
  });

  it('should display the version and description', () => {
    const output = runCLI('--version');
    expect(output).toContain(subProgram._version);

    const helpOutput = runCLI('--help');
    expect(helpOutput).toContain(subProgram._description);
  });

  it('should initialize the translation config file if not exists', () => {
    runCLI('init');
    expect(fs.existsSync(configFilePath)).toBe(true);
  });

  it('should not overwrite existing translation config file on init', () => {
    fs.writeFileSync(configFilePath, JSON.stringify({}));
    runCLI('init');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('configFileExists')
    );
  });

  it('should sync translation if config file exists', () => {
    fs.writeFileSync(configFilePath, JSON.stringify({}));
    runCLI('sync');
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('configFileDoesNotExist')
    );
  });

  it('should log an error if sync is called without a config file', () => {
    runCLI('sync');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('configFileDoesNotExist')
    );
  });

  it('should handle invalid commands gracefully', () => {
    const output = runCLI('invalidcommand');
    expect(output).toContain('error: unknown command');
  });
});
