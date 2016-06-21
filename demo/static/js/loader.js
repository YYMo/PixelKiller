$(document).ready(function (){

  var authKey = getAuthKey();

  var model = new PhotoListModel([]);
  var view = new PhotoListView(model, {
    'list':document.getElementById('photolist'),
    'loadButton':document.getElementById('loadMoreButton'),
  });
  var controller = new PhotoListController(model, view);
  controller.loadData(authKey);
});