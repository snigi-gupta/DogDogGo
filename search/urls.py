from django.urls import path
from .views import ListQueryView
from . import views

urlpatterns = [
    path('', ListQueryView.as_view(), name='index'),
    path('search', views.search, name='search')
    # path('', views.index, name='index'),
]