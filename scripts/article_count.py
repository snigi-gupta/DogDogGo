import json
from os import listdir
from os.path import isfile, join
import pdb

with open('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataNewsArticles8/news_articles.json', "r") as f:
    data = json.load(f)
article_dict = {}
for d in data:
    article_dict.update({d['tweet_id']: len(d['articles'])})

# print(len(article_dict))
tweet_article_ids = article_dict.keys()
# print(tweet_article_ids)

mypath = "D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/processed_data_tweets"

onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

for file in onlyfiles:
    print("Processing ", file)
    new_data = []
    file_path = mypath + "/" + file
    with open(file_path) as f:
        data = json.load(f)
    with open('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/processed_data_article_tweets/' + file, "w") as f:
        for d in data:
            t = {}
            if d['id'] in tweet_article_ids:
                print("found", d['poi_name'])
                t['article_count'] = article_dict[d['id']]
            else:
                t['article_count'] = 0
            t.update(d)
            new_data.append(t)
        json.dump(new_data, f)


