"use strict";
var oracledb = require('oracledb'),
    Promise = require("bluebird");

oracledb.outFormat = oracledb.OBJECT;


var config = {
    user: 'zgdec',
    password: 'dbwork',
    connectString: "172.7.1.84/JCDEC"
};

var pool;

function DataSource() {

}

DataSource.prototype.init = function(){
    return new Promise(function(resolve,reject){
        oracledb.createPool(config,function(err,_pool){
            if(err){console.log(err); return reject(err);}
            pool = _pool;
            resolve(pool);
        });
    });
};

DataSource.prototype.fetch = function(index,count,filter){
    return new Promise(function(resolve,reject){
        var from = parseInt(index) + 1;
        var to = parseInt(count) + from;
        if(filter ==null && typeof(filter) === 'undefined') {
            filter = "";
        }
        var filterText = "%"+filter+"%";
        pool.getConnection(function(err,connection){
            if(err){
                console.log(err);
                return reject(err);}

        
            connection.execute('SELECT "Id","LPN","Status","Date","MOBILE" from ( SELECT A.*, ROWNUM RN FROM ( SELECT OID as "Id", RECEIVE_DATE - 8/24 as "Date", INFORMATION as "Status", CAR_NAME as "LPN", PHONE as "MOBILE" from TRANS_ARRIVE_MESSAGE where (CAR_NAME like (:1) or PHONE like (:2)) order by OID desc ) A where ROWNUM < (:3) ) WHERE RN >= (:4) ',[filterText,filterText,to,from],function(err, results){
                if(err) {
                    console.log("Error executing query:",err);
                    reject(err);
                } else {
                    console.log(results);
                    resolve(results.rows);
                }
                connection.release(function(err){
                    if(err){console.log(err);}
                });
            });
        });
    });
    
};

DataSource.prototype.fetchGreater = function(rowid) {
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
            if(err) {
                console.log("Error connecting to db:",err);
                reject(err);
            }
            connection.execute('SELECT OID as "Id", RECEIVE_DATE - 8/24 as "Date", INFORMATION as "Status", CAR_NAME as "LPN" , PHONE as "MOBILE" from TRANS_ARRIVE_MESSAGE WHERE OID > (:1) order by OID desc ',[rowid],function(err,results){
                if(err) {
                    console.log("Error querying:",err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
                connection.release(function(err){if(err){console.log(err);}});
            });
        });
    });
    
};

module.exports = DataSource;
