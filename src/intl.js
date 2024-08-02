const path = require('path');
const jsonfile = require('jsonfile');

class IntlUtil {
  constructor() {
    this.translations = {};
    this.locale = this.getSystemLocale();
  }
  getSystemLocale() {
    let envLocale =
      process.env.LC_ALL ||
      process.env.LC_MESSAGES ||
      process.env.LANG ||
      process.env.LANGUAGE;
    envLocale = envLocale
      ? envLocale
      : new Intl.DateTimeFormat().resolvedOptions().locale;
    envLocale = envLocale.split('-')[0];
    return envLocale;
  }
  setLocale(locale) {
    this.locale = locale;
  }
  loadTranslations() {
    const localeFilePath = path.join(
      __dirname,
      `./_locales/${this.locale}/messages.json`
    );
    this.translations[this.locale] = jsonfile.readFileSync(localeFilePath);
  }
  t(key) {
    if (!this.translations[this.locale]) {
      this.loadTranslations();
    }
    return this.translations[this.locale][key] || '';
  }
}

exports.IntlUtil = IntlUtil;
