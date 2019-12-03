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
# Create your views here.
# def index(request):
    # return HttpResponse("Hello, world. You're at the search index.")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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
	
	def get(self, request):
		inurl = "http://18.191.146.199:8983/solr/DogDogGo/select?&defType=edismax&fl=*&hl.fl=full_text&hl.simple.post=%3C%2Fspan%3E&hl.simple.pre=%3Cspan%20class%3D%27tweet-hl%27%3E&hl=on&pf=processed_text%5E2&ps=5&q=processed_text%3A(family)%20OR%20text_en%3A(family)%20OR%20text_pt%3A(fam%C3%ADlia)%20OR%20text_es%3A(familia)%20full_text%3A%20(family)%20full_text%3A%20(fam%C3%ADlia)%20full_text%3A%20(familia)&qf=full_text%5E0.000001%20text_en%5E2%20text_pt%5E1%20text_hi%5E1%20text_es%5E1&stopwords=true"

		#data = urllib.request.urlopen(inurl)
		#res = json.loads(data.read().decode())
		
		
		f = open(f'{BASE_DIR}/select.json')
		res = json.loads(f.read())
		response = res['response']
		highlighting = res['highlighting']
		docs = response['docs']
		total = response['numFound']

		sentiments = {-1: 0, 0: 0, 1: 0}
		pois = {}
		locations = {}
		sources = {'iphone': 0, 'android': 0, 'web': 0}
		hashtags = {}

		for doc in docs:
			doc_id = doc['id']
			hl = highlighting[doc_id]
			hl_vals = []
			for x in hl.values():
				hl_vals.extend(x)
			if len(hl_vals) > 0:
				hl_text = hl_vals[0]
			else:
				hl_text = doc['full_text']
			doc['hl_text'] = hl_text
			sentiments[doc['sentiment']] += 1
			if 'hashtags' in doc:
				for hashtag in doc['hashtags']:
					if hashtag not in hashtags:
						hashtags[hashtag] = 0
					hashtag[hashtag] += 1
			if doc['poi_country'] not in locations: 
				locations[doc['poi_country']] = 0
			locations[doc['poi_country']] += 1
			if doc['poi_name'] not in pois: 
				pois[doc['poi_name']] = 0
			pois[doc['poi_name']] += 1
			if doc['source'].find('android') > 0:
				sources['android'] += 1
			elif doc['source'].find('iphone') > 0:
				sources['iphone'] += 1
			else:
				sources['web'] += 1
		
		results = {
				'tweets': docs,
				'analysis': {
					'sentiments': sentiments,
					'pois': pois,
					'locations': locations,
					'sources': sources
				},
				'total': total
		}

		return JsonResponse(results, safe=False)
		core_name = "DogDogGo"
		localhost = "http://3.19.188.244:8983/solr/"
		select_q = "/select?q="
		fl_score = "&fl=id%2Cscore&wt=json&indent=true&rows=20"
		inurl = ""
		# query = request.GET.get('q', None)
		query = "Liberdade"
		# removing newline character and escaping all ':'
		query = query.replace("\n", "")
		query = query.replace(":", "\:")

		# ensuring all words are searched in the given language
		q_en = "(" + query + ")"
		q_en = quote(query)

		or_seperator = "%20OR%20"
		if query:
			# inurl = 'http://localhost:8983/solr/corename/select?q=*%3A*&fl=id%2Cscore&wt=json&indent=true&rows=1000'
			inurl = localhost + core_name + select_q + "full_text:" + q_en + fl_score
			# inurl = localhost + core_name + select_q + "text_txt_en" + q_en + or_seperator + "text_en" + query + fl_score
			# return HttpResponse(inurl)

			data = urllib.request.urlopen(inurl)
			docs = json.load(data)['response']['docs']
			return Response(docs)
		else:
			message = "Please enter a query for us to search!"
			return Response(message)

		def index(request):
			f = open(f'{BASE_DIR}/tweets/BarackObama.json')
			data = json.loads(f.read())
			data = data[:25]
			for i in range(0, len(data)):
							data[i]['sentiment'] = random.choice(SENTIMENTS)
							data[i]['topic'] = 'dummy'
							data[i]['impact'] = {'articles': random.randint(0, 50), 'replies': random.randint(0, 50)}
			return JsonResponse(data, safe=False)

# Create your views here.
class ListQueryView(APIView):
	def get(self, request):
		return Response("Hello, world. You're at the search index.")

