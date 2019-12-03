import json
from os import listdir
from os.path import isfile, join
import emoji
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pdb

mypath = "D:/UB CSE/IR/Project 4/Crawled_Tweets/Data7"


onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

# print(onlyfiles)
# delete_keys = ['id_str', 'truncated', 'display_text_range', 'entities', 'in_reply_to_status_id_str',
#                'in_reply_to_user_id_str', 'user', 'favourites_count', 'utc_offset', 'geo_enabled', 'lang', 'contributors_enabled',
#                'is_translator', 'is_translation_enabled', 'profile_background_color', 'profile_background_image_url', 'profile_background_image_url_https',
#                'profile_background_tile', 'profile_banner_url', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color',
#                'profile_text_color', 'profile_use_background_image', 'has_extended_profile', 'default_profile', 'default_profile_image',
#                'can_media_tag', 'followed_by', 'following', 'follow_request_sent', 'notifications', 'translator_type', 'geo', 'coordinates',
#                'place', 'contributors', 'is_quote_status', 'favorited', 'retweeted']


def sentiment_analysis(tweet):
    analyser = SentimentIntensityAnalyzer()
    text = tweet['full_text']
    sentiment = analyser.polarity_scores(text)
    if sentiment['compound'] < -0.1:
        # tweet['sentiment'] = -1
        return "negative"
    elif sentiment['compound'] > 0.2:
        # tweet['sentiment'] = 1
        return "positive"
    else:
        # tweet['sentiment'] = 0
        return "neutral"
    # return tweet


for file in onlyfiles:
    if "replies" in file:
        continue
    # print(file)
    file_path = mypath + "/" + file
    with open(file_path) as f:
        data = json.load(f)
    new_data = []
    for d in data:

        if d.get('retweeted_status'):
            # skipping since a retweet and no new opinion
            continue
        t = {}
        fillers = []

        processed_text = d.get('full_text')

        # copying full_text to processed_text
        t['processed_text'] = processed_text

        # orginal keys
        t['created_at'] = d.get('created_at')
        t['id'] = d.get('id')
        t['full_text'] = d.get('full_text')
        t['source'] = d.get('source')
        t['in_reply_to_status_id'] = d.get('in_reply_to_status_id')
        t['in_reply_to_user_id'] = d.get('in_reply_to_user_id')
        t['in_reply_to_screen_name'] = d.get('in_reply_to_screen_name')
        t['retweet_count'] = d.get('retweet_count')
        # number of likes of the tweet
        t['favorite_count'] = d.get('favorite_count')
        t['possibly_sensitive'] = d.get('possibly_sensitive')
        t['lang'] = d.get('lang')
        t['poi_name'] = d.get('poi_name')
        t['poi_id'] = d.get('poi_id')
        t['verified'] = d.get('verified')
        t['poi_country'] = d.get('country')

        # language detection
        if t.get('lang') == "en":
            t.update({"text_en": processed_text})
        elif t.get('lang') == "hi":
            t.update({"text_hi": processed_text})
        elif t.get('lang') == "pt":
            t.update({"text_pt": processed_text})
        elif t.get('lang') == "es":
            t.update({"text_es": processed_text})
        else:
            if t.get('poi_country') == 'India':
                t.update({"text_hi": processed_text})
            elif t.get('poi_country') == 'USA':
                t.update({"text_en": processed_text})
            elif t.get('poi_country') == 'Brazil':
                t.update({"text_pt": processed_text})
                # t.update({"text_es": processed_text})
            elif t.get('poi_country') == 'Columbia':
                t.update({"text_es": processed_text})
            elif t.get('poi_country') == 'Hong Kong':
                t.update({"text_en": processed_text})
            elif t.get('poi_country') == 'Spain':
                t.update({"text_es": processed_text})
            elif t.get('poi_country') == 'Vatican City':
                t.update({"text_es": processed_text})

        # nested keys

        # entities
        # hashtags
        t['hashtags'] = [i.get('text') for i in d.get('entities').get('hashtags')]
        t['hashtags_indices'] = [i.get('indices') for i in d.get('entities').get('hashtags')]

        # user_mentions
        t['user_mentions_screen_name'] = [i.get('screen_name') for i in d.get('entities').get('user_mentions')]
        t['user_mentions_id'] = [i.get('id') for i in d.get('entities').get('user_mentions')]
        t['user_mentions_name'] = [i.get('name') for i in d.get('entities').get('user_mentions')]
        t['user_mentions_indices'] = [i.get('indices') for i in d.get('entities').get('user_mentions')]

        # urls
        t['urls'] = [i.get('url') for i in d.get('entities').get('urls')]
        t['urls_indices'] = [i.get('indices') for i in d.get('entities').get('urls')]

        # extended_entities
        t['media_thumbnail_urls'] = []
        t['media_shortened_url'] = []
        t['media_type'] = []
        t['media_video_aspect_ratio'] = []
        t['media_video_urls'] = []

        try:
            for i in d.get('extended_entities').get('media'):
                t['media_thumbnail_urls'].append(i.get('media_url'))
                t['media_shortened_url'].append(i.get('url'))
                t['media_type'].append(i.get('type'))

                if i.get('type') == 'video':
                    t['media_video_aspect_ratio'].append((i.get('video_info').get('aspect_ratio')))
                    t['media_video_urls'].append(i.get('video_info').get('variants')[0].get('url'))
        except Exception as e:
            pass

        # user
        t['user_id'] = d.get('user').get('id')
        t['user_name'] = d.get('user').get('name')
        t['user_screen_name'] = d.get('user').get('screen_name')
        t['user_location'] = d.get('user').get('location')
        t['user_description'] = d.get('user').get('description')
        t['user_url'] = d.get('user').get('url')

        t['user_followers_count'] = d.get('user').get('followers_count')
        t['user_friends_count'] = d.get('user').get('friends_count')
        t['user_listed_count'] = d.get('user').get('listed_count')
        t['user_created_at'] = d.get('user').get('created_at')
        # number of likes user has (static)
        t['user_favourites_count'] = d.get('user').get('favourites_count')
        t['user_time_zone'] = d.get('user').get('time_zone')
        t['user_statuses_count'] = d.get('user').get('statuses_count')
        t['user_profile_image_url'] = d.get('user').get('profile_image_url')
        t['user_profile_image_url_https'] = d.get('user').get('profile_image_url_https')

        # place
        if d.get('place'):
            t['place_city'] = d.get('place').get('name')
            t['place_country'] = d.get('place').get('country')

        # emoticons
        t['emoticons'] = [i for i in d.get('full_text') if i in emoji.UNICODE_EMOJI]

        # sentiment
        t['sentiment'] = sentiment_analysis(d)

        # scraping
        fillers.extend(t.get('emoticons'))
        # urls mentioned in text
        fillers.extend(t.get('urls'))
        # urls mentioned in text as images or videos
        fillers.extend(t.get('media_shortened_url'))

        for filler in fillers:
            t['processed_text'] = re.sub(filler, '', processed_text)

        t['processed_text'] = t['processed_text'].replace("\n", " ").strip()

        source = d.get('source').lower()
        if 'android' in source:
            t['source'] = 'android'
        elif 'ios' in source or 'iphone' in source or 'mac' in source:
            t['source'] = 'iphone'
        else:
            t['source'] = 'web'

        # for x in delete_keys:
        #     if x in d:
        #         del d[x]

        new_data.append(t)

    new_file_path = mypath + "/processed_data/" + file
    with open(new_file_path, "w") as f:
        json.dump(new_data, f)
    print(file + " Done!")
