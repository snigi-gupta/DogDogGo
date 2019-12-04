from django.urls import path
from .views import SearchQueryView

urlpatterns = [
    path('', SearchQueryView.as_view(), name='search'),
    path('fetch_replies', FetchReplies.as_view(), name='replies'),
]
