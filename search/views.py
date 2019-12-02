from django.shortcuts import render
'''
from django.http import HttpResponse, JsonResponse
import os
import json
import random

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SENTIMENTS = ['positive', 'negative', 'neutral']

# Create your views here.
def index(request):
	f = open(f'{BASE_DIR}/tweets/BarackObama.json')
	data = json.loads(f.read())
	data = data[:25]
	for i in range(0, len(data)):
		data[i]['sentiment'] = random.choice(SENTIMENTS)
		data[i]['topic'] = 'dummy'
		data[i]['impact'] = {'articles': random.randint(0, 50), 'replies': random.randint(0, 50)}
	return JsonResponse(data, safe=False)
'''
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Query
from .serializers import QuerySerializer
from django.http import HttpResponse, JsonResponse
from urllib.parse import quote
import pdb
import json
import urllib.request
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os, requests, uuid

# Create your views here.
# def index(request):
    # return HttpResponse("Hello, world. You're at the search index.")

class SearchQueryView(APIView):

    def sentiment_analysis(self, docs):
        analyser = SentimentIntensityAnalyzer()
        for tweet in docs:
            text = tweet['full_text']
            sentiment = analyser.polarity_scores(text)
            if sentiment['compound'] < -0.1:
                tweet['sentiment'] = -1
            elif sentiment['compound'] > 0.2:
                tweet['sentiment'] = 1
            else:
                tweet['sentiment'] = 0
        return docs

    def translate_query(self, text):
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
                                "lang" : "* language of source text *"
                                "en" : "text in english"
                                "hi" : "text in hindi"
                                "pt" : "text in portugese"
                                "es" : "text in spanish"
                              }
        '''

        key_var_name = 'TRANSLATOR_TEXT_SUBSCRIPTION_KEY'
        if not key_var_name in os.environ:
            raise Exception('Please set/export the environment variable: {}'.format(key_var_name))
        subscription_key = "463d120dd710483691cedf8d5b4601af"

        endpoint_var_name = 'TRANSLATOR_TEXT_ENDPOINT'
        if not endpoint_var_name in os.environ:
            raise Exception('Please set/export the environment variable: {}'.format(endpoint_var_name))
        endpoint = "https://api.cognitive.microsofttranslator.com/"

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
        translated_text['lang'] = response[0]['detectedLanguage']['language']
        for i in range(4):
            translated_text[response[0]['translations'][i]['to']] = response[0]['translations'][i]['text']
        return translated_text

    def get(self, request):

        pdb.set_trace()
        # contants
        core_name = "DogDogGo"
        localhost = "http://18.191.146.199:8983/solr/"
        select_q = "/select?q="
        fl_score = "&fl=id%2Cscore%2Cfull_text&wt=json&indent=true&rows=20"
        inurl = ""

        query = request.GET.get('search', None)
        # query = "Liberdade"

        # get query translated

        translated_query = self.translate_query(query)
        query_en = translated_query['en']
        query_hi = translated_query['hi']
        query_pt = translated_query['pt']
        query_es = translated_query['es']

        # escaping all ':'
        query = query.replace(":", "\:")
        query_en = query_en.replace(":", "\:")
        query_hi = query_hi.replace(":", "\:")
        query_pt = query_pt.replace(":", "\:")
        query_es = query_es.replace(":", "\:")

        # return Response(query_en, query_es, query_hi, query_pt,query)
        # ensuring all words are searched in the given language
        q_en = "(" + query + ")"
        q_en = quote(q_en)

        # seperator variable
        or_seperator = "%20OR%20"
        if query:
            inurl = localhost + core_name + select_q + "processed_text:" + q_en + fl_score
            # inurl = localhost + core_name + select_q + "text_txt_en" + q_en + or_seperator + "text_en" + query + fl_score
            # return HttpResponse(inurl)
            data = urllib.request.urlopen(inurl)
            docs = json.load(data)['response']['docs']
            return Response(inurl)
        else:
            message = "Please enter a query for us to search!"
            return Response(message)

# Create your views here.
class ListQueryView(APIView):
    def get(self, request):
        return Response("Hello, world. You're at the search index.")

