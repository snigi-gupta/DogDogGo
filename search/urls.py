from django.urls import path
from .views import SearchQueryView

urlpatterns = [
    path('', SearchQueryView.as_view(), name='search'),
]
