/**
 * Created by Beeven on 7/14/2014.
 */

(function(){
   'use strict';


    function SSEReceiver(url,rootScope) {
        var connection_listeners = [];
        var data_listeners = [];
        var error_listeners = [];
        var connection_once = [];
        var data_once = [];
        var error_once = [];
        this.on = this.addListener = function(event,listener) {
            if(typeof(listener) === 'function') {
                switch(event) {
                    case "connection":
                        connection_listeners.push(listener);
                        break;
                    case "data":
                        data_listeners.push(listener);
                        break;
                    case "error":
                        error_listeners.push(listener);
                        break;
                }
            }
        };

        this.once = function(event,listener) {
            if(typeof(listener) === 'function') {
                switch(event) {
                    case "connection":
                        connection_once.push(listener);
                        break;
                    case "data":
                        data_once.push(listener);
                        break;
                    case "error":
                        error_once.push(listener);
                        break;
                }
            }
        };

        this.off = this.removeListener = function(event,listener) {
            if(typeof(listener) === 'function') {
                var index = -1;
                switch(event) {
                    case "connection":
                        index = connection_listeners.indexOf(listener);
                        if(index != -1) {
                            connection_listeners.splice(index,1);
                            break;
                        } else {
                            index = connection_once.indexOf(listener);
                            if(index != -1) {
                                connection_once.splice(index,1);
                            }
                        }
                        break;
                    case "data":
                        index = data_listeners.indexOf(listener);
                        if(index != -1) {
                            data_listeners.splice(index,1);
                            break;
                        } else {
                            index = data_once.indexOf(listener);
                            if(index != -1) {
                                data_once.splice(index,1);
                                break;
                            }
                        }
                        break;
                    case "error":
                        index = error_listeners.indexOf(listener);
                        if(index != -1) {
                            error_listeners.splice(index,1);
                            break;
                        } else {
                            index = error_once.indexOf(listener);
                            if(index != -1) {
                                error_once.splice(index,1);
                                break;
                            }
                        }
                        break;
                }
            }
        };

        this.removeAllListeners = function(event) {
            if(event == null || typeof(event) === 'undefined') {
                connection_listeners = [];
                data_listeners = [];
                error_listeners = [];
                connection_once = [];
                data_once = [];
                error_once = [];
            } else {
                switch(event) {
                    case 'connection' :
                        connection_listeners = [];
                        connection_once = [];
                        break;
                    case 'data':
                        data_listeners = [];
                        data_once = [];
                        break;
                    case 'error':
                        error_listeners = [];
                        error_once = [];
                        break;
                }
            }
        };

        var source = new EventSource(url);
        source.onopen = function(event) {
            rootScope.$evalAsync(function(){
                while(connection_once.length > 0) {
                    var callback = connection_once.pop();
                    callback.apply(callback,[event.data]);
                }
                for(var index = 0;index < connection_listeners.length; index++) {
                    connection_listeners[index].apply(callback,[event.data]);
                }
            });

        };

        source.onmessage = function(event) {
            var data = JSON.parse(event.data);
            rootScope.$evalAsync(function() {
                while (data_once.length > 0) {
                    var callback = data_once.pop();
                    callback.apply(callback, [data]);
                }
                for (var index = 0; index < data_listeners.length; index++) {
                    data_listeners[index].apply(callback, [data]);
                }
            });
        };

        source.onerror = function(event) {
            rootScope.$evalAsync(function() {
                while (error_once.length > 0) {
                    var callback = error_once.pop();
                    callback.apply(callback, [event.data]);
                }
                for (var index = 0; index < error_listeners.length; index++) {
                    error_listeners[index].apply(callback, [event.data]);
                }
            });
        };
    }

    var angularSSE = angular.module("ngSSE",[]);

    angularSSE.provider('sseReceiver',function(){

        this.url = "/notifyme";
        this.setUrl = function(url) {
            this.url = url;
        };
        var that = this;

        this.$get = ['$rootScope',function($rootScope){
            return new SSEReceiver(that.url,$rootScope);
        }];
    });

})();