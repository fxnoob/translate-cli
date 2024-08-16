const jsonfile = require('jsonfile');
const { IntlUtil } = require('../src/intl');

jest.mock('jsonfile', () => ({
  readFileSync: jest.fn(),
}));

describe('Intl class Tests', () => {
  test('should get system locale', async () => {
    const intl = new IntlUtil();
    // setting process.env.LANG to hi
    process.env.LANG = 'hi';
    expect(intl.getSystemLocale()).toBe('hi');
    // setting process.env.LANG to unrecognised locale
    process.env.LANG = 'UTC-ID';
    expect(intl.getSystemLocale()).toBe('en');
  });

  test('load translations from json file', async () => {
    const intl = new IntlUtil();
    intl.loadTranslations();
    expect(jsonfile.readFileSync).toHaveBeenCalledTimes(1);
  });

  test('fetch translations for a given key', async () => {
    const intl = new IntlUtil();
    intl.translations[intl.locale] = {
      appName: 'test',
    };
    expect(intl.t('appName')).toBe('test');
  });
});
