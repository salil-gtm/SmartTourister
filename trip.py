import tweepy
from textblob import TextBlob
from calendar import month_name
import re
import json
import demjson
import requests
import pprint
import pandas as pd
import csv
consumer_key = ''
consumer_secret = ''

access_token = ''
access_token_secret = ''

types = ['discovering', 'eating', 'going_out', 'hiking', 'playing', 'relaxing', 'shopping', 'sightseeing', 'sleeping', 'doing_sports', 'traveling']

all_locations = pd.read_csv('api-cities.csv')
locations = all_locations['name']

from flask import request
from flask import Flask
app = Flask(__name__)

@app.route("/salil")
def main():
	auth = tweepy.OAuthHandler(consumer_key,consumer_secret)
	auth.set_access_token(access_token,access_token_secret)


	api = tweepy.API(auth)

	public_tweets = api.search('SmartTourister')

	json_list = []

	for tweet in public_tweets:
	    print(tweet.text)
	    for loc in locations:
		loc = unicode(loc, 'utf-8')
		if loc in tweet.text:
		    print('Source :: ',loc)
		    source = loc
	    for ty in types:
		if ty in tweet.text.lower():
		    print('Type :: ',ty)
		    api_type = ty            
	    mail = re.search(r'[\w\.-]+@[\w\.-]+', tweet.text.lower())
	    print('Email :: ',mail)
	    data = [ { 'Source' : source, 'Email' : mail,'Types' : api_type } ]
	    js = demjson.encode(data)
	    json_list.append(js)
	    json_string = json.dumps(json_list)
	print json_string
	print "*********"
	return json_string

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=7890)
