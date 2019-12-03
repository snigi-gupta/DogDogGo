# -*- coding: utf-8 -*-
import os, requests, uuid, json
def translate(text):
    '''
    !!! Please add TRANSLATOR_TEXT_SUBSCRIPTION_KEY and TRANSLATOR_TEXT_ENDPOINT in your
        environment (bash_profile) before starting !!!

    Description: Translates the given text into 4 languages and detects the source language of the text
                 1) English
                 2) Hindi
                 3) Spanish
                 4) Portugese
    Input:
        text : Input string to translate. Can be in any language

    Output:
        translated_data = {
                            "detected language" : "* language of source text *"
                            "en" : "text in english"
                            "hi" : "text in hindi"
                            "pt" : "text in portugese"
                            "es" : "text in spanish"
                          }
    '''


    key_var_name = 'TRANSLATOR_TEXT_SUBSCRIPTION_KEY'
    if not key_var_name in os.environ:
        raise Exception('Please set/export the environment variable: {}'.format(key_var_name))
    subscription_key = os.environ[key_var_name]

    endpoint_var_name = 'TRANSLATOR_TEXT_ENDPOINT'
    if not endpoint_var_name in os.environ:
        raise Exception('Please set/export the environment variable: {}'.format(endpoint_var_name))
    endpoint = os.environ[endpoint_var_name]

    path = '/translate?api-version=3.0'
    params = '&to=en&to=hi&to=es&to=pt'
    constructed_url = endpoint + path + params

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    body = [{
        'text': text
    }]

    request = requests.post(constructed_url, headers=headers, json=body)
    response = request.json()
    translated_text = {}
    translated_text['detected language'] = response[0]['detectedLanguage']['language']
    for i in range(4):
        translated_text[response[0]['translations'][i]['to']] = response[0]['translations'][i]['text']

    return translated_text



output = translate(input("Enter text to translate: "))

print(output)
