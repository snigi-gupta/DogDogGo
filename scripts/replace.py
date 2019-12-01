import json
from os import listdir
from os.path import isfile, join
import emoji
import re
import pdb

mypath = "D:/UB CSE/IR/Project 4/tweet_data"


onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

# print(onlyfiles)
delete_keys = ['id_str', 'truncated', 'display_text_range', 'entities', 'in_reply_to_status_id_str',
               'in_reply_to_user_id_str', 'user', 'favourites_count', 'utc_offset', 'geo_enabled', 'lang', 'contributors_enabled',
               'is_translator', 'is_translation_enabled', 'profile_background_color', 'profile_background_image_url', 'profile_background_image_url_https',
               'profile_background_tile', 'profile_banner_url', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color',
               'profile_text_color', 'profile_use_background_image', 'has_extended_profile', 'default_profile', 'default_profile_image',
               'can_media_tag', 'followed_by', 'following', 'follow_request_sent', 'notifications', 'translator_type', 'geo', 'coordinates',
               'place', 'contributors', 'is_quote_status', 'favorited', 'retweeted']
for file in onlyfiles[:1]:
    file_path = mypath+"/" + file
    with open(file_path) as f:
        data = json.load(f)
    for d in data:
        fillers = []

        processed_text = d.get('full_text')

        # processing
        d['hashtags'] = [i.get('text') for i in d.get('entities').get('hashtags') ]
        d['hashtags_indices'] = [i.get('indices') for i in d.get('entities').get('hashtags') ]

        d['user_mentions_screen_name'] = [i.get('screen_name') for i in d.get('entities').get('user_mentions') ]
        d['user_mentions_id'] = [i.get('id') for i in d.get('entities').get('user_mentions') ]
        d['user_mentions_name'] = [i.get('name') for i in d.get('entities').get('user_mentions') ]
        d['user_mentions_indices'] = [i.get('indices') for i in d.get('entities').get('user_mentions') ]

        d['urls'] = [i.get('url') for i in d.get('entities').get('urls')]
        d['urls_indices'] = [i.get('indices') for i in d.get('entities').get('urls')]

        d['emoticons'] = [i for i in d.get('full_text') if i in emoji.UNICODE_EMOJI]

        fillers.extend(d.get('emoticons'))
        for filler in fillers:
            d['processed_text'] = re.sub(filler, '', processed_text)

        for x in delete_keys:
            if x in d:
                del d[x]

    new_file_path = mypath + "/processed_data/" + file
    with open(new_file_path, "w") as f:
        json.dump(data, f)
    print(file + " Done!")
