from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Create your views here.
def index(request):
	f = open(f'{BASE_DIR}/tweets/BarackObama.json')
	data = json.loads(f.read())
	return JsonResponse(data, safe=False)
