/**
 * The Model.
 */

function PhotoListModel(items){
  this._items = items;
}

PhotoListModel.prototype = {
  
  getItems: function(){
    return [].concat(this._items);
  },

  setItems: function(items){
    this._items = items;
  },
};