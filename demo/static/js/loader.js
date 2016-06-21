$(document).ready(function (){

  var authKey = getAuthKey();

  var model = new PhotoListModel([]);
  var view = new PhotoListView(model, {
    'list':document.getElementById('photolist'),
    'loadButton':document.getElementById('loadMoreButton'),
  });
  var controller = new PhotoListController(model, view);

  var oauthView = new OAuthView({
    'OAuthLoginButton': document.getElementById('authButton'),
  });
  var oauthController = new OAuthController(oauthView);

  var login = false;

  //check local storage if already have oauthAccessToken (access token), in Step 3 of OAuth1.0
  if(localStorage.hasOwnProperty("oauthAccessToken")){
    //console.log("already has oauthAccessToken");
    //console.log(localStorage["oauthAccessToken"]);
    login = true;
  }
  //check LocalStorage if already have OAuthToken (request token), in Step 2 of OAuth1.0
  else if (localStorage.hasOwnProperty("oauthToken")){
    //console.log("alread has oauthToken");
    //console.log(localStorage["oauthToken"]);
    //console.log(localStorage["oauthTokenSecret"]);

    oauthController.oauthVerifier = getParameterByName("oauth_verifier", window.location.href)
    //console.log(oauthController.oauthVerifier);
    oauthController.getAccessToken();
  }

  if(login){
    controller.loadData(authKey, true);
    getUserInfo();
  }
  else{
    controller.loadData(authKey, false);
  }

});