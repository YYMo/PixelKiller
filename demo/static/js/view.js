/**
 * The View.
 */

function PhotoListView(model, elements){
  this._model = model;
  this._elements = elements;
  this._showedIndex = 0; // last index read from model

  this.showMoreButtonClicked =new Event(this);

  var _this = this;
  var showMoreButton = this._elements['loadButton'];
  showMoreButton.addEventListener('click', function(){
    _this.showMoreButtonClicked.notify();
    _this.showMore();
  })
}

PhotoListView.prototype = {
  //append an photo from model to view
  append: function(index){
    var index = this._showedIndex;
    if(index < this._model.getItems().length){
      this._elements['list'].appendChild(clipCreate(this, this._model.getItems()[index]));
    }
  },

  //show photo with index
  show: function(index){
    if(index > this._showedIndex){
      index = Math.min(this._model._items.length, index)
      list = this._elements.list;
      items = this._model.getItems();
      for(i = this._showedIndex; i < index; i++){
        this.append(i);
        //append item to the list
      }
      this.setShowedIndex(index);
      
    }  
  },

  showMore: function(){
    console.log(this._showedIndex);

    //show 3 more photo eveytime, this value can be changed
    this.show(this._showedIndex + 1);
    this.show(this._showedIndex + 1);
    this.show(this._showedIndex + 1);

    //scroll down
    $('html, body').animate({ scrollTop: $('#loadMoreButton').offset().top }, 1000);

  },

  setShowedIndex: function(index){
    this._showedIndex = Math.min(this._model._items.length, index);
  },

};

//OAuth process view
function OAuthView(elements) {
  this.requestToken = new Event(this);
  var button = elements['OAuthLoginButton'];
  var _this = this;

  button.addEventListener('click', function(){
    _this.requestToken.notify();
  })
}

/* util functions for view */

//create a image, return an "img" element
function imgCreate(src, alt, title) {
	//TODO: add alt title
    var img = document.createElement('img');
    img.src = src;
    if (alt!=null) img.alt= alt;
    if (title!=null) img.title= title;
    return img;
}

//create a photo clip 
function clipCreate(view, img_item){
  /*
   * img_item example:
   * {
   *   "image_url": "https://www.xxxxx"	
   *   ...
   * }
   */

  console.log(img_item);
  var img = imgCreate(img_item['image_url'], "", "");
  img.setAttribute("class", "imgShow");

  var limitDiv = document.createElement('div');
  limitDiv.setAttribute("class", "limit");

  var photoDiv = document.createElement('div');
  photoDiv.setAttribute("class", "col-sm-4 no-margin");
  
  photoDiv.appendChild(limitDiv);
  limitDiv.appendChild(img);
  
  //d.appendChild(likeButton);
  return photoDiv;
}

function showUserInfo(data){
  var d = document.getElementById("userInfo");
  var t = document.createTextNode("User Name: " + data["username"] + ", Email: " + data["email"]);
  var h = document.createElement("h3");
  h.appendChild(t);
  d.appendChild(h);
}