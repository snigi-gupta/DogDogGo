from django.shortcuts import render
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
