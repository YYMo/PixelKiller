## Synopsis
This is very 'mini' browers of 500px photo libraries that allow user to see the most popular photoes and login with their 500px account.

## Motivation
This project is inspired by the interview code challenge of 500px. See detailed requirement in code_challenge.txt.

## Deploy
Install Django and OAuthlib first.
In command line:\
python manage.py runserver 127.0.0.1:8001



## Test
Basic functions have been manually tested in Chrome, FireFox, Safari on MacOS.

## Known Bug
All POST request sent with OAuth1.0 info seems not working right now.

## Problem met:
### Receive 401 error when request for 'oauth/request_token'.
Somehow use GET instead of POST fix the problem. 
Discusstion at: https://github.com/500px/api-documentation/issues/96

### Receive 401 error code when trying to get access code.
After monitoring every request in Chrome debug tools, I found that the header part of the "oauth/access_token" request doesn not contain an "Authorization" field. Scutinizing the code, I just missed 's' in keyword 'headers'. oops:(

### Receive 401 error code when trying to vote a photo.

I scrutinized both front-end and back-end code for a one hour, did not find anything strange. I then tried another request API with "GET" "https://api.500px.com/v1/users". It returned the correct data. For some reason, it seems GET works and POST don't. People seem to meet the same issue: https://github.com/500px/api-documentation/issues/167

### Where to store OAuth1 access token?
I chose HTML5 Web Local Storage instead of cookie or storing it in backend.
Advantage:
- It is safely implemented in mordern web browser.
- Doesn't have to deal with CSFR or encryption and verification problem when pass/fetch it to/from backend, so it is relatively easier to implement (compared with Cookies or backend).


## Third party library used:

- OAuthLib: A python implementation of OAuth request-signing logic.