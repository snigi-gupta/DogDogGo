from os import listdir
import json

##
#  Create a directory new_data, inside new_data:
#                          Create directory Verified *Contains all the data of verified_user*
#                          Create directory Replies +Contains all the reply files+
#                          Create directory Updated_Verified *Empty directory*
#
#                          The updated json file will be in Updated_Verified directory
##


def write_reply_count(reply_tracker, files):

    for file in files:
        print(file)
        new_data = []
        with open ('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/data_tweets/' + file, "r") as f:
            data = json.load(f)
        with open('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/processed_data_tweets/' + file, "w") as f:
            for d in data:
                t = {}
                t['reply_count'] = reply_tracker[d['id']]
                t.update(d)
                new_data.append(t)
            json.dump(new_data, f)



def create_verified_data(files):
    verified_user = {}
    for f in files:
        print(f)
        json_file = open('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/data_tweets/'+f)
        data = json.load(json_file)
        for d in data:
            verified_user[d['id']] = 0
        json_file.close()
    return verified_user


def count_replies(reply_tracker, files):
    for f in files:
        print(f)
        json_file = open('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/data_replies/'+f)
        data = json.load(json_file)
        for d in data:
            reply_tracker[d['in_reply_to_status_id']] += 1
        json_file.close()

    return reply_tracker


files = [f for f in listdir('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/data_tweets/') if 'json' in f]

reply_tracker = create_verified_data(files)

reply_files = [f for f in listdir('D:/UB CSE/IR/Project 4/Crawled_Tweets/DataReplyCount8/data_replies/') if 'json' in f]

reply_tracker = count_replies(reply_tracker, reply_files)

print(reply_tracker[1197831654703869952])
print("\n")

write_reply_count(reply_tracker, files)