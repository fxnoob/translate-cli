#  @fxnoob/translate

## Description
The Translate CLI Tool is a command-line interface for initializing and synchronizing translation configurations in your project. 

## Installation
To install the Translate CLI Tool, you need to have Node.js installed on your machine. You can install the tool globally using npm:

```bash
npm install -g @fxnoob/translate
```

## Usage

### Initialization
The `init` command initializes the translation configuration file (`translate.config.json`) in the current working directory.

```bash
translate init
```

#### Example
```bash
translate init
```

Upon running, if `translate.config.json` already exists in the directory, you will see:
```
Configuration file already exists.
```

Otherwise, it will create a new `translate.config.json` file.

### Synchronization
The `sync` command synchronizes the translation files based on the existing configuration.

```bash
translate sync
```

#### Example
```bash
translate sync
```

If `translate.config.json` does not exist, you will see:
```
Configuration file does not exist.
```

Otherwise, it will synchronize the translation files as per the configurations specified.

## Command Descriptions

- `init`: Initializes the translation configuration file.
  - **Usage**: `translate init`

- `sync`: Synchronizes the translation files based on the configuration.
  - **Usage**: `translate sync`

## Example Configuration (`translate.config.json`)
The following is an example of what the `translate.config.json` might look like:

```json
{
  "buildDir": "src",
  "defaultLocale": "en",
  "locales": ["en", "es"],
  "defaultLocaleFilePth": "en.translate.config.json"
}
```

## Internationalization (i18n)
This tool uses the `IntlUtil` class for handling internationalization. Ensure the messages and descriptions for commands are defined appropriately in your `IntlUtil` implementation.

## Development
To extend or modify the functionality, you can update the `translator.js` and `intl.js` files located in the `src` directory. These files contain the core logic for translation initialization and synchronization as well as internationalization utility functions.

## License
MIT

## Support
For any questions or issues, please open an issue on the repository or contact the maintainers.
