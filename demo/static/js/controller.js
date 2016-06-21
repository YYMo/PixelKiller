/**
 * The Controller
 */

function PhotoListController(model, view) {
  this._model = model;
  this._view = view;

  var _this = this;
  this._view.likeButtonClicked.attach(function(sender, args){
    _this.likeItem(args);
  });
}

PhotoListController.prototype = {
  //get photos data from server 
  //depends on login, the parameters are different
  loadData: function(auth_key, login){
    var url = generateRequestUrl(auth_key);
    var header = {};
    if(login == true){
      var data = getResourceUrlWithToken(url);
      url = data['url'];
      header = data['header'];
    }
    var _this = this;
    $.ajax({
      url:url,
      headers:header,
      dataType:'json',
      async:false,
      success: function(result){
        _this._model.setItems(result['photos']);
        _this._view.showMore();
      },

      //TODO: error
    });
  },

  likeItem: function(args){
    //check if user login
    if(localStorage.hasOwnProperty('oauthAccessToken')){
      var id = args['img']['id'];
      var url = "https://api.500px.com/v1/photos/" + id + "/vote?vote=" + args['like'];
      console.log('post url: ' + url);

      var accessInfo = getResourceUrlWithToken(url);
      var _url = accessInfo['url'];
      var _header = accessInfo['header'];

      //this is not working currently :(
      //will return 401 error
      $.ajax({
        method: 'POST',
        url:_url,
        headers:_header,
        success: function(result){
          console.log(result);
        }
      });
    }
  }
}

//OAuth1.0 logic controller 
//Following: oauth.net/core/1.0 part6 and part7
function OAuthController(view) {
  this._view = view;
  this.oauthVerifier = undefined;
  var _this = this;

  this._view.requestToken.attach(function(){
    _this.getRequestToken();
  });

}

OAuthController.prototype = {
  //Step 1 of OAuth1.0
  //http://oauth.net/core/1.0 Section 6.1
  getRequestToken: function(){

    //call backend to calculate field needed for require token
    $.ajax({
      url: "get_auth_request_token",
      dataType:'json',

      success: function(result){
        var _url = result["url"]
        var _header = result["header"]

        //call 500px API to get request token
        $.ajax({
          url: _url,
          headers: _header,
          success: function(re){
            //change on re to use the util function 
            re = "?" + re

            var oauthToken = getParameterByName('oauth_token', re);
            var oauthTokenSecret = getParameterByName('oauth_token_secret', re);
            
            //store oauthToken in HTML5 Web Storage
            localStorage.setItem("oauthToken", oauthToken)
            localStorage.setItem("oauthTokenSecret", oauthTokenSecret)

            //redirect to 500px
            delete localStorage['oauthAccessToken']
            delete localStorage['oauthAccessTokenSecret']
            window.location = "https://api.500px.com/v1/oauth/authorize?oauth_token=" + oauthToken;
          }
        }) 
      },
      })
  },

  //Step 2 of OAuth1.0
  //http://oauth.net/core/1.0 Section 6.2-6.3
  getAccessToken: function(){
    var oauthToken = localStorage["oauthToken"];
    var oauthTokenSecret = localStorage["oauthTokenSecret"];
    var oauthVerifier = this.oauthVerifier;
    var data = {
        'oauthToken': oauthToken,
        'oauthTokenSecret': oauthTokenSecret,
        'oauthVerifier': oauthVerifier,
      };

    // call backend to calculate filed needed for access token
    $.ajax({
      url:"get_auth_access_token",
      data:data,
      success: function(result){
        console.log(result)
        var _url = result["url"]
        var _header = result["header"]

        //call 500px API to get access token
        $.ajax({
          //server bug? POST not working
          //type: "POST",
          url: _url,
          headers: _header,
          success: function(re){
            //change on re to use the util function 
            re = "?" + re
            var oauthAccessToken = getParameterByName('oauth_token', re);
            var oauthAccessTokenSecret = getParameterByName('oauth_token_secret', re);

            //store oauthToken in HTML5 Web Storage
            localStorage.setItem("oauthAccessToken", oauthAccessToken)
            localStorage.setItem("oauthAccessTokenSecret", oauthAccessTokenSecret)

            //redirect
            window.location = "http://127.0.0.1:8001/";
          }
        })
      }
    })
  },
}


/* util functions for controllers */

//generate the url needed, currently it's hard-coded only for get popular photo purpose
function generateRequestUrl(auth_key){
  return "https://api.500px.com/v1/photos?"
   + "consumer_key=" + auth_key + 
   "&feature=popular&rpp=100&image_size=440&include_store=store_download&include_states=voted";
}


//get auth_key needed (binding to app) needed to fetch photos
function getAuthKey(){
  var key;
  $.ajax({
    url:"get_auth_key/",
    dataType:'json',
    async:false,
    success: function(result){
      key = result;
    }
    //TODO: error
    
    });
  return key['consumer_key'];
}

//pass in a resource access url 
//return the url and header needed to pass OAuth verification
//Step 3 of OAuth1.0
//http://oauth.net/core/1.0 Section 7
function getResourceUrlWithToken(url){
    var oauthAccessToken = localStorage["oauthAccessToken"];
    var oauthAccessTokenSecret = localStorage["oauthAccessTokenSecret"];

    var data = {
      "oauthAccessToken": oauthAccessToken,
      "oauthAccessTokenSecret": oauthAccessTokenSecret,
      "url": url,
    }
    var ret = {}

    $.ajax({
      url:"get_auth_resource_token",
      data: data,
      async:false,
      success: function(result){
        var _url = result["url"]
        var _header = result["header"]

        ret['url'] = _url
        ret['header'] = _header

      }
    })
    return ret;
}

//get parameter from a URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//use oauth token
function getUserInfo(){
  var url = "https://api.500px.com/v1/users";
  var accessInfo = getResourceUrlWithToken(url);

  var _url = accessInfo['url'];
  var _header = accessInfo['header'];
  var data = {};
  $.ajax({
    url:_url,
    headers:_header,
    success: function(result){
      showUserInfo(result["user"]);
    }
  });
}