from rest_framework import serializers
from .models import Query

class QuerySerializer(serializers.Serializer):
    class Meta:
        model = Query
        fields = ('query_text', 'query_time')