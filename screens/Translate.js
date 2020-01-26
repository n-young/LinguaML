import Environment from '../config/environment';

import uuid from 'uuid/v4';

const endpoint =
  'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

async function Translator(text, lang) {
  let options = {
    method: 'POST',
    baseUrl: endpoint,
    url: 'translate',
    qs: {
      'api-version': '3.0',
      to: [lang],
    },
    headers: {
      'Ocp-Apim-Subscription-Key': Environment.MS_AZURE_TRANSLATION_API_KEY,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuid().toString(),
    },
    body: [
      {
        text: text,
      },
    ],
    json: true,
  };

  let optionsFetch = {
    body: `[{'Text':'${text}'}]`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Ocp-Apim-Subscription-Key': Environment.MS_AZURE_TRANSLATION_API_KEY,
    },
    method: 'POST',
  };

  const output = await fetch(
    endpoint + '&from=en&to=' + lang,
    optionsFetch
  ).then(res => res.json());

  return output;
}

export default Translator;
