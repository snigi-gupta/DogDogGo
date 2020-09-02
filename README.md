# DogDogGo - Information Retrieval Project 4
This project is aimed at creating a tweet search engine. The goal of the project is to successfully crawl tweets from twitter, index them and then create a graphic user interface allowing a user to search tweets. Furthermore, the project contributes in analyzing the corpus informing the user about the impact of the tweets in the twitter sphere.</br>

You can find the Demo of this application here https://www.youtube.com/watch?v=hruluDxwTU8

  Platform            | Tech-Stack
-------------         | -------------
Front-End             | ReacJS and Reduc, CSS, HTML
Back-End              | Django, Python
Search Platform       | Solr/Lucene
Translation Platform  | Microsoft Azure
Analytics             | Plotly
News Scraping         | News API Praw
Server Instance       | Amazon EC2

</br>

### _Search Engine Features_ ###
* Search </br>
DogDogGo allows the user to search words, phrases, hashtags etc. It offers a rich, flexible set of features for search.</b4>

* Translation </br>
The search engine allows the user to search in multiple languages. </br>

* Highlighting </br>
Found results are highlighted. </br>

* More Like This </br>
When a user finds a document relevant the user can search similar tweets by clicking on “More like this”. This feature is similar to Google's "More Like This feature in Google News. </br>

* Custom Search </br>
The user can customise its search and use filters. We allow the user to filter its search on the basis of POI, Location, Hashtags, Sentiment, Language, and Source. </br>

* Analytics </br>
We use the SentimentIntensityAnalyser of VadarSentiment library to analyse the sentiment of each tweet as well as for the searched results. Red: Negative, Green: Positive, Orange: Neutral. </br>

* Dynamic Search Result Analysis </br>
On the basis of the search results, a number of analysis is provided.
  * Location Distribution: Location of tweets that match the query term.
  * Sentiment Analysis: Sentiment analysis of the fetched results.
  * Person of Interest Distribution: frequency of query term on the POI’s twitter handle
  * Distribution of Devices: Devices from which the tweets were posted.</br>

* Tweet Corpus Analysis </br>
The user can also visualize the statistics of the tweet corpus.
  * World Twitter Usage: Geo mapping of tweets around the world.
  * Country Time Series: Twitter usage based on country over the time.
  * POI Time Series: Twitter usage based on Person of Interest over the time.
  * Sentiment Time Series: Sentiment of tweets over the time.
  * Location Distribution: Distribution of tweets by location. </br>

* Relevant News Articles </br>
The user can also view articles related to the tweet. The user can also view the original article.</br>

* Tweet Replies </br>
The user can also view the replies for a particular tweet.

* Additional Features </br>
A few additional features are also included to enhance the user experience.
  * Total search count and response time of search engine.
  * Pagination
  * Interactive plots
  * Clean user interface
  * Phrase search
  * Sentiment analysis and display retweet count, reply count and article count for each tweet. </br>
  
  
#### This project was built by four students of University at Buffalo ####
**Front-end**: Anirudh </br>
**Back-end**: Snigdha and Raunaq </br>
**Analytics**: Raunaq and Anirudh </br>
**News Scraping**: Deepesh </br>
**Translation and Solr Querying**: Snigdha, Deepesh and Raunaq </br>
**Documentation**: Snigdha</br>
