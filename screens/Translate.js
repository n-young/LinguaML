//import * as RNLocalize from "react-native-localize";
import Environment from '../config/environment';

//const request = require('request');
const uuidv4 = require('uuid/v4');

const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

//const locales = RNLocalize.getLocales();


async function Translator(text, lang) {
    let options = {
        method: 'POST',
        baseUrl: endpoint,
        url: 'translate',
        qs: {
            'api-version': '3.0',
            'to': [lang]
        },
        headers: {
            'Ocp-Apim-Subscription-Key': Environment.MS_AZURE_TRANSLATION_API_KEY,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: [{
            'text': text
        }],
        json: true,
    };

    let optionsFetch = {
        body: `[{'Text':'${text}'}]`,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Ocp-Apim-Subscription-Key": Environment.MS_AZURE_TRANSLATION_API_KEY,
        },
        method: "POST"
    };

    console.log(endpoint + "&from=en&to=" + lang);
    const output = await fetch(endpoint + "&from=en&to=" + lang, optionsFetch).then(
        async (result) => { console.log(result.status); return await result.json() });

    return output;
    /*
    request(options, function (err, res, body) {
        return JSON.stringify(body, null, 4);
    });
    */
}

export default Translator;