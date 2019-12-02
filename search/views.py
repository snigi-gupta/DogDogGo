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
		BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
		SENTIMENTS = ['positive', 'negative', 'neutral']
		f = open(f'{BASE_DIR}/tweets/BarackObama.json')
		data = json.loads(f.read())
		data = data[:25]
		for i in range(0, len(data)):
			data[i]['sentiment'] = random.choice(SENTIMENTS)
			data[i]['topic'] = 'dummy'
			data[i]['impact'] = {'articles': random.randint(0, 50), 'replies': random.randint(0, 50)}
		return JsonResponse(data, safe=False)
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

