/**
 * The Controller
 */

function PhotoListController(model, view) {
  this._model = model;
  this._view = view;
}

PhotoListController.prototype = {
  //get photos data from server 
  loadData: function(auth_key){
    var url = generateRequestUrl(auth_key);
    var _this = this;
    $.ajax({
      url:url,
      dataType:'json',
      async:false,
      success: function(result){
        _this._model.setItems(result['photos']);
        _this._view.showMore();
      },

      //TODO: error
    });
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