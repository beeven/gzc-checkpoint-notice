/*
 * Created by Beeven Yip
 * 7/17/2014
 */

describe("oracleDataSource",function(){
    var oracleDS = require("../oracleDataSource");

    it("should have two functions: fetch, fetchGreater",function(){
        oracleDS.fetch.should.be.a.Function.with.lengthOf(2);
        oracleDS.fetchGreater.should.be.a.Function.with.lengthOf(1);
    });

    describe("#fetch()",function(){
        it("should return a promise with some data",function(done){
            var ret = oracleDS.fetch(0,10);
            ret.should.have.properties("then","done");
            var retData;
            ret.then(function(data){
                retData = data;
            retData.should.be.an.Array;
            retData.length.should.be.exactly(10);
            (retData[0]).should.have.properties(["id","Date","Status","LPN"]);
                done();
            });
        });
    });
    
    describe("#fetchGreater()",function(){
        it("should return a promise with some data", function(done){
            var ret = oracleDS.fetchGreater(12191);
            ret.should.have.properties("then","done");
            ret.then(function(data){
                data.should.be.an.Array;
                data.length.should.be.above(0);
                (data[0]).should.have.properties(["id","Date","Status","LPN"]);
                done();
            });
        });
    });
});
