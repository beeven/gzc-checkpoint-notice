/**
 * Created by Beeven on 7/17/2014.
 */



var dataProvider = require("../dataProvider");

describe("Data Provider",function(){

    var dp = new dataProvider();
    it('should have start, stop, fetch functions',function(){
        (dp.start).should.be.an.Function;
        dp.stop.should.be.a.Function;
        dp.fetch.should.be.a.Function;
    });
    it("should support connection, data, error events",function(){
        dp.events.should.containEql('connection');
        dp.events.should.containEql('data');
        dp.events.should.containEql('error');
    });

    describe("#fetch()",function(){
        it("should have two arguments", function () {
            dp.fetch.should.have.a.lengthOf(2);
        });
        it("should return a promise",function(){
            dp.fetch(0,10).should.have.properties("then","done");
        });
        it("should have some data", function(done){
            dp.fetch(0,10).then(function(data){
                data.should.be.an.Array;
                data.length.should.be.exactly(10);
                done();
            });
        });
    });

    describe("#on()",function(){

        var listener = function(){console.log("hello")};
        before(function(){
            dp.listeners["connection"].splice(0,dp.listeners["connection"].length);
        });
        it("should have two arguments",function(){
            dp.on.should.have.a.lengthOf(2);
        });
        it("should append the function to the event list",function(){

            dp.on("connection",listener);
            dp.listeners["connection"].should.have.a.lengthOf(1);
            dp.on("connection",listener);
            dp.listeners["connection"].should.have.a.lengthOf(1);
        });
    });
    describe("#off()",function(){
        var listener = function(){console.log("hello")};
        before(function(){
            dp.listeners["connection"] = [listener,function(){}];
        });
        it("should remove the listener from the event list",function(){
            dp.off("connection",listener);
            dp.listeners["connection"].should.have.a.lengthOf(1);
            dp.off("connection",listener);
            dp.listeners["connection"].should.have.a.lengthOf(1);
            dp.off("connection");
            dp.listeners["connection"].should.have.a.lengthOf(0);
        });
    });

    describe("#start",function(){
        after(function(){
            dp.stop();
        });
        it.skip("should feed me data after started for a while",function(done){
            dp.on("data",function(data){
                data.should.be.an.Array;
                done();
            });
            dp.start();
        });
    });
});
