from django.urls import path
from .views import ListQueryView


urlpatterns = [
    path('', ListQueryView.as_view(), name='index'),
]