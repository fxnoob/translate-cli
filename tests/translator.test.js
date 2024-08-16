const fs = require('fs');

const { Translator } = require('../src/translator');
jest.mock('fs');

describe('translator class tests', () => {
  it('should create a map file with the correct structure', async () => {
    const translator = new Translator();
    const defaultJson = {
      key1: 'Hello',
      key2: { message: 'World' },
      key3: 'Foo',
    };
    const targetJson = {
      key1: 'Hola',
      key2: { message: 'Mundo' },
      key3: 'Bar',
    };
    const targetLocaleMapPath = 'path/to/target/localeMap.json';
    await translator.createMapFile(
      defaultJson,
      targetJson,
      targetLocaleMapPath
    );
    const expectedJson = {
      key1: {
        origMessage: 'Hello',
        currentMessage: 'Hola',
      },
      key2: {
        origMessage: 'World',
        currentMessage: 'Mundo',
      },
      key3: {
        origMessage: 'Foo',
        currentMessage: 'Bar',
      },
    };
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      targetLocaleMapPath,
      JSON.stringify(expectedJson),
      { flag: 'w' }
    );
  });

  it('should delete keys from targetLocaleJson that are not present in currentLocaleJson and log the action', async () => {
    const translator = new Translator()
    const currentLocaleJson = {
      key1: 'Hello',
      key2: 'Goodbye',
    };

    const targetLocaleJson = {
      key1: 'Hola',
      key2: 'Adiós',
      obsoleteKey: 'Obsolete value',
    };

    const locale = 'es';

    const expectedTargetLocaleJson = {
      key1: 'Hola',
      key2: 'Adiós',
    };

    console.log = jest.fn(); // Mock console.log

    await translator.clearObsoleteTranslations(
      currentLocaleJson,
      targetLocaleJson,
      locale
    );

    // Verify the obsolete key is removed
    expect(targetLocaleJson).toEqual(expectedTargetLocaleJson);

    // Verify console.log was called with the correct message
    expect(console.log).toHaveBeenCalledWith(
      `Erasing obsolete key: obsoleteKey, from locale: ${locale}`
    );
  });
});
