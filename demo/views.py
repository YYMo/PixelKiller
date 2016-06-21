from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

import oauthlib
from oauthlib import oauth1

# main page
def main(request):
    template = 'main.html'
    context = {}
    return render(request, template, context)

# return consumer key
def get_auth_key(request):
    data = {'consumer_key':settings.CONSUMER_KEY}
    return JsonResponse(data)

# Step 1 of OAuth1.0
# http://oauth.net/core/1.0 Section 6.1
# request sent from front end, this is the signing process
def get_auth_request_token(request):
    client = oauthlib.oauth1.Client(settings.CONSUMER_KEY, 
        client_secret=settings.CONSUMER_SECRET,
        callback_uri=settings.CALLBACK_URL)
    url, headers, body = client.sign(settings.OAUTH_REQUEST_TOKEN_URL)

    data = {
        "url":url,
        "header":headers,
    }
    return JsonResponse(data)

# Step 2 of OAuth1.0
# http://oauth.net/core/1.0 Section 6.2-6.3
# request sent from front end, this is the signing process
def get_auth_access_token(request):

    oauthToken = request.GET['oauthToken']
    oauthTokenSecret = request.GET['oauthTokenSecret']
    oauthTokenVerifier = request.GET['oauthVerifier']

    client = oauthlib.oauth1.Client(settings.CONSUMER_KEY, 
        client_secret=settings.CONSUMER_SECRET,
        resource_owner_key=oauthToken, 
        resource_owner_secret=oauthTokenSecret,
        verifier=oauthTokenVerifier,
        callback_uri=settings.CALLBACK_URL)
    uri, headers, body = client.sign(settings.OAUTH_ACCESS_TOKEN_URL)

    data = {
        "url": uri,
        "header": headers,
        "body": body,
    }
    return JsonResponse(data)

# Step 3 of OAuth1.0
# http://oauth.net/core/1.0 Section 7
# request sent from front end, this is the signing process
def get_auth_resource_token(request):
    oauthAccessToken = request.GET['oauthAccessToken']
    oauthAccessTokenSecret = request.GET['oauthAccessTokenSecret']
    url = request.GET['url']

    client = oauthlib.oauth1.Client(settings.CONSUMER_KEY,
     client_secret=settings.CONSUMER_SECRET,
     resource_owner_key=oauthAccessToken, 
     resource_owner_secret=oauthAccessTokenSecret)

    uri, headers, body = client.sign(url)

    data = {
        "url": uri,
        "header": headers,
        "body": body,
    }
    return JsonResponse(data)    