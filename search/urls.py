from django.urls import path
from .views import SearchQueryView, FetchRepliesView, FetchNewsView

urlpatterns = [
    path('', SearchQueryView.as_view(), name='search'),
    path('fetch_replies', FetchRepliesView.as_view(), name='replies'),
    patch('fetch_news', FetchNewsview.as_view(), name='news'),
]
