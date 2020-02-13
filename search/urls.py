from django.urls import path
from .views import *

urlpatterns = [
    path('', SearchQueryView.as_view(), name='search'),
    path('fetch_tweet_and_replies', FetchRepliesView.as_view(), name='replies'),
    path('fetch_news', FetchNewsView.as_view(), name='news'),
    path('fetch_user_news', FetchUserNewsView.as_view(), name='news'),
    path('fetch_user_tweets', FetchUserTweetsView.as_view(), name='utweets'),
]
