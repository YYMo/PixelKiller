/**
 * Event is simple implementation of Observer pattern
 */

function Event(sender) {
  this._sender = sender;
  this._listeners = [];
}

Event.prototype = {
  attach: function(listener) {
    this._listeners.push(listener);
  },
  notify: function(args){
    var i;
    for(i = 0; i < this._listeners.length; i += 1){
      this._listeners[i](this._sender, args);
    }  
  }
}