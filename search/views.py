from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Query
from .serializers import QuerySerializer
from django.http import HttpResponse


# Create your views here.
class ListQueryView(APIView):
    def get(self, request):
        return Response("Hello, world. You're at the search index.")