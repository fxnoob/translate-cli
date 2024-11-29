const https = require('https');
const querystring = require('node:querystring');

module.exports = async function (...args) {
  let text,
    sourceLang = 'auto',
    targetLang,
    callback = () => {};

  // Parse arguments
  if (typeof args[0] === 'object' && args[0] !== null) {
    const opts = args[0];
    text = opts.text;
    sourceLang =
      opts.source || opts.src || opts.sl || opts.sourceLang || sourceLang;
    targetLang = opts.target || opts.tgt || opts.tl || opts.targetLang;
    if (typeof args[1] === 'function') callback = args[1];
  } else if (typeof args[0] === 'string') {
    text = args[0];
    if (typeof args[1] === 'string') {
      if (typeof args[2] === 'string') {
        sourceLang = args[1];
        targetLang = args[2];
        if (typeof args[3] === 'function') callback = args[3];
      } else {
        targetLang = args[1];
        if (typeof args[2] === 'function') callback = args[2];
      }
    }
  } else {
    throw new Error('Invalid arguments');
  }

  if (!text) throw new Error('Need a text to translate');
  if (!targetLang) throw new Error('Need a targetLang to translate to');

  const url = `https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=${targetLang}&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e`;

  const data = querystring.stringify({
    sl: sourceLang,
    tl: targetLang,
    q: text,
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'User-Agent':
        'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
    },
  };

  const makeRequest = () =>
    new Promise((resolve, reject) => {
      const req = https.request(url, requestOptions, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const jsonResponse = JSON.parse(body);
            resolve(jsonResponse);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

  try {
    const jsonResponse = await makeRequest();

    // Build Translation class
    class Translation {
      constructor(json) {
        Object.assign(this, json);
        this.translation = this.sentences.reduce(
          (combined, trans) => combined + (trans.trans || ''),
          ''
        );
      }

      toString() {
        return this.translation;
      }
    }

    const translation = new Translation(jsonResponse);

    callback(translation);
    return translation;
  } catch (error) {
    const newError = new Error(
      "Couldn't retrieve a valid JSON response. Perhaps the API has changed."
    );
    newError.data = data;
    newError.url = url;
    callback(newError);
    // throw newError;
  }
};
