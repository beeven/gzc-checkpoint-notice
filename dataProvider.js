/**
 * Created by Beeven on 7/16/2014.
 */

var dataSource = require("./dummyDataSource");

function dataProvider(pageSize, loopInterval) {

    var lastRecordId;
    var loopHandler;
    var started = false;
    if(loopInterval == null || typeof(loopInterval)==='undefined') {
        loopInterval = 5000;
    }
    if(pageSize == null || typeof(pageSize) === 'undefined') {
        pageSize = 10;
    }

    var listeners = {};

    var events = ["connection","data","error"];
    this.events = events;
    this.listeners = listeners;
    var that = this;
    for(var index=0;index<events.length;index++) {
        listeners[events[index]] = [];
    }

    var loopFunction = function(){
        dataSource.fetchGreater(lastRecordId)
            .then(function(data){
                if(data) {
                    lastRecordId = data[0].id;
                    ondata(data);
                }
            },function(err){
                onerror(err);
            });
    };


    this.start = function(){
        if(!started) {
            that.fetch(0,1).then(function(data){
                lastRecordId = data[0].id;
                loopHandler = setInterval(loopFunction,loopInterval);
                started = true;
            });
        }
    };
    this.stop = function(){
        if(started) {
            clearInterval(loopHandler);
            started = !started;
        }
    };
    this.fetch = function(index,filter){

        return dataSource.fetch(index,pageSize,filter);
    };
    this.fetchGreater = function(index) {
        return dataSource.fetchGreater(index);
    };

    this.addListener = function(event,listener){
        if(events.indexOf(event) != -1) {
            listeners[event].push(listener);
        }
        return this;
    };

    this.on = function(event,listener) {
        if(events.indexOf(event) != -1) {
            if(listeners[event].indexOf(listener) == -1) {
                listeners[event].push(listener);
            }
        }
        return this;
    };

    this.removeListener = function(event,listener) {
        if(events.indexOf(event) != -1) {
            var index = listeners[event].indexOf(listener);
            if(index != -1) {
                listeners[event].splice(index,1);
            }
        }
        return this;
    };

    this.off = function(event,listener) {
        if(events.indexOf(event) != -1) {
            if(listener == null || typeof(listener) === 'undefined' ) {
                listeners[event] = [];
            }
            else {
                var index = listeners[event].indexOf(listener);
                if (index != -1) {
                    listeners[event].splice(index, 1);
                }
            }
        }
        return this;
    };

    var ondata = function(data){
        for(var index=0; index < listeners["data"].length; index++) {
            listeners["data"][index].apply(this,[data]);
        }
    };

    var onconnection = function() {

    };

    var onerror = function(err){
        console.log(err);
    };
}

module.exports = dataProvider;
