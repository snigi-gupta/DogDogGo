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
import random
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
from urllib.parse import quote
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from django.http import HttpResponse, JsonResponse
import os
import json
import random
import os, requests, uuid
from collections import defaultdict

# Create your views here.
# def index(request):
    # return HttpResponse("Hello, world. You're at the search index.")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class SearchQueryView(APIView):

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
        subscription_key = "463d120dd710483691cedf8d5b4601af"

        endpoint_var_name = 'TRANSLATOR_TEXT_ENDPOINT'
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

    def process_query(self, query):
        """
        This method processed query and returns the processed query
        :param query:
        :return: query
        """
        # removing new line and escaping all ':'
        query = query.replace("\n", " ")
        query = query.replace(":", "\:")

        # ensuring all words are searched in the given language
        query = "(" + query + ")"
        query = quote(query)

        return query

    def process_filter(self, filter):
        filter_string = ""
        for f in filter:
            filter_string += f + " "
        filter_string = filter_string.strip()

        # removing new line and escaping all ':'
        filter_string = filter_string.replace("\n", " ")
        filter_string = filter_string.replace(":", "\:")

        # ensuring all words are searched in the given language
        filter_string = "(" + filter_string + ")"
        filter_string = quote(filter_string)

        return filter_string

    def plot_data(self, response, highlighting, facet):

        hl_text = ""
        docs = response.get('docs', None)
        total = response['numFound']
        facet_fields = facet['facet_fields']
        sentiment_count = defaultdict(int)
        poi_count = defaultdict(int)
        location_count = defaultdict(int)
        source_count = defaultdict(int)
        hashtag_count = defaultdict(int)
        tweets = []
        for doc in docs:
            tweet_hash = {}
            doc_id = doc['id']
            hl = highlighting.get(doc_id, {})
            hl_vals = []
            for x in hl.values():
                hl_vals.extend(x)
            if len(hl_vals) > 0:
                hl_text = hl_vals[0]
            else:
                hl_text = doc['full_text']
            tweet_hash['id'] = doc['id']
            tweet_hash['hl_text'] = hl_text
            tweet_hash['sentiment'] = doc['sentiment'][0]
            tweet_hash['user_name'] = doc['user_name'][0]
            tweet_hash['verified'] = doc['verified'][0]
            tweet_hash['poi_name'] = doc['poi_name'][0]
            tweet_hash['created_at'] = doc['created_at'][0]
            tweet_hash['retweet_count'] = doc['retweet_count'][0]
            # tweet_hash['reply_count'] = doc['reply_count'][0]
            tweet_hash['article_count'] = random.randint(0, 10)

            # sentiment_count[doc['sentiment'][0]] += 1
            # if 'hashtags' in doc:
            #     for hashtag in doc['hashtags']:
            #         hashtag_count[hashtag] += 1
            #
            # location_count[doc['poi_country'][0]] += 1
            # poi_count[doc['poi_name'][0]] += 1

            # source_count[doc['source'][0]] +=1

            tweets.append(tweet_hash)

        sentiment = {}
        poi = {}
        hashtags = {}
        source = {}
        location = {}
        language = {}
        for key in facet_fields.keys():
            temp = {facet_fields[key][i]: facet_fields[key][i + 1] for i in range(0, len(facet_fields[key]), 2)}
            if key == "hashtags": hashtags = temp
            if key == "sentiment": sentiment = temp
            if key == "poi_name": poi = temp
            if key == "poi_country": location = temp
            if key == "lang": language = temp
            if key == "source": source = temp

        results = {
            'tweets': tweets,
            'analysis': {
                'sentiment': sentiment,
                'poi': poi,
                'location': location,
                'source': source,
                'hashtags': hashtags,
                'language': language
            },
            'total': total
        }
        return results


    def get(self, request):

        # pdb.set_trace()
        response = {}
        # contants
        core_name = "DDG"
        select_q = "/select?q="
        localhost = "http://18.191.146.199:8983/solr/" + core_name + select_q
        highlight_search = "&hl=on&hl.simple.pre=%3Cspan%20class%3D%22tweet-hl%22%3E&hl.simple.post=%3C%2Fspan%3E"
        custom_search = "&defType=edismax&pf=processed_text%5E2&ps=5&hl.fragsize=300&hl.fl=full_text,text_*" + \
                        highlight_search
        fl_score = "&fl=*&wt=json&indent=true"
        query_field = "&qf=full_text%5E0.00001%20"
        stopwords = "&stopwords=true"
        facet_search = "&facet.field=hashtags&facet.field=lang&facet.field=poi_name&facet.field=poi_country&" \
                       "facet.field=sentiment&facet.sort=count&facet.limit=10&facet=on&facet.mincount=1"

        # fl_score = "&fl=id%2Cscore%2Cfull_text&wt=json&indent=true&rows=20"
        inurl = ""

        # testing
        # request = {'search': 'family is', 'filters': {'location': ['New York', 'India'], 'poi': ['Trump','Abraham Weintraub'],
        #                                               'hashtags': ['trump','MuitoOrgulho']}}
        query = request.GET.get('search', None)
        filters = request.GET.get('qfilters', None)
        more_like_this = request.GET.get('mlt_flag', False)

        # analytics = request.GET.get('analytics', False)

        start = request.GET.get('start', 0)
        end = request.GET.get('end', 2000000)

        limit = "&rows=" + end + "&start=" + start

        # filters
        hashtags = []
        location = []
        poi = []
        sentiment = []
        if filters:
            filters = json.loads(filters)
            hashtags = filters.get('hashtags', None)
            location = filters.get('location', None)
            poi = filters.get('poi', None)
            sentiment = filters.get('sentiment', None)
            source = filters.get('source', None)

        query_hashtag = self.process_filter(hashtags) if hashtags else None
        query_location = self.process_filter(location) if location else None
        query_poi = self.process_filter(poi) if poi else None
        query_sentiment = self.process_filter(sentiment) if sentiment else None
        query_source = self.process_filter(source) if source else None

        # testing
        # more_like_this = True
        # query = str(1169733819328532480)
        # query = "Liberdade"

        # get query translated
        translated_query = self.translate_query(query)
        query_en = translated_query['en']
        query_hi = translated_query['hi']
        query_pt = translated_query['pt']
        query_es = translated_query['es']

        # import pdb
        # pdb.set_trace()
        lang_detected = translated_query['lang']
        if lang_detected == "en":
            query_field = query_field + "text_en%5E2%20text_es%5E1%20text_hi%5E1%20text_pt%5E1"
        elif lang_detected == "hi":
            query_field = query_field + "text_en%5E1%20text_es%5E1%20text_hi%5E2%20text_pt%5E1"
        elif lang_detected == "pt":
            query_field = query_field + "text_en%5E1%20text_es%5E1%20text_hi%5E1%20text_pt%5E2"
        elif lang_detected == "es":
            query_field = query_field + "text_en%5E1%20text_es%5E2%20text_hi%5E1%20text_pt%5E1"

        # processing query
        if more_like_this:
            inurl = localhost + "%7B!mlt%20q%3Did%7D" + query + highlight_search + facet_search + limit + fl_score
        else:
            query = self.process_query(query)
            query_en = self.process_query(query_en)
            query_hi = self.process_query(query_hi)
            query_pt = self.process_query(query_pt)
            query_es = self.process_query(query_es)

            # seperator variable
            or_seperator = "%20OR%20"
            and_seperator = "%20AND%20"

            temp_array = []
            temp_flag = False

            if hashtags:
                temp_array.append("hashtags:" + query_hashtag)
                temp_flag = True
            if location:
                temp_array.append("poi_country:" + query_location)
                temp_flag = True
            if poi:
                temp_array.append("poi_name:" + query_poi)
                temp_flag = True
            if sentiment:
                temp_array.append("sentiment:" + query_sentiment)
                temp_flag = True
            if source:
                temp_array.append("source:" + query_source)
                temp_flag = True

            if temp_flag:
                inurl = localhost + "processed_text:" + query + and_seperator + and_seperator.join(temp_array) + \
                        highlight_search + facet_search + limit + fl_score

            elif not inurl:
                inurl = localhost + "processed_text:" + query + or_seperator + "text_en:" + query_en + or_seperator + \
                        "text_hi:" + query_hi + or_seperator + "text_pt:" + query_pt + or_seperator + "text_es:" + \
                        query_es + custom_search + query_field + facet_search + limit + stopwords + fl_score
        # pdb.set_trace()
        print(inurl)
        data = urllib.request.urlopen(inurl)
        res = json.load(data)
        response = res['response']
        highlighting = res['highlighting']
        facet = res['facet_counts']
        results = self.plot_data(response, highlighting, facet)
        return Response(results)

# Create your views here.
class ListQueryView(APIView):
    def get(self, request):
        return Response("Hello, world. You're at the search index.")

