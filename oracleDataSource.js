var Q = require("q");
var oracle = require('oracle');

var connectData = {
    hostname: '172.7.1.84',
    port: 1521,
    database: 'YDBG',
    user: 'zgdec',
    password: 'dbwork'
};

exports.fetch = function(index,count, filter) {
    var deferred = Q.defer();
    var from = parseInt(index) + 1;
    var to = parseInt(count) + from;
    if(filter ==null && typeof(filter) === 'undefined') {
        filter = "";
    }
    var filterText = "%"+filter+"%";
    oracle.connect(connectData,function(err,connection){
        if(err) {
            console.log("Error connecting to db:",err);
            deferred.reject(err);
        }
    
        connection.execute('SELECT "Id","LPN","Status","Date","MOBILE" from ( SELECT A.*, ROWNUM RN FROM ( SELECT OID as "Id", RECEIVE_DATE - 8/24 as "Date", INFORMATION as "Status", CAR_NAME as "LPN", PHONE as "MOBILE" from TRANS_ARRIVE_MESSAGE where (CAR_NAME like (:1) or PHONE like (:2)) order by OID desc ) A where ROWNUM < (:3) ) WHERE RN >= (:4) ',[filterText,filterText,to,from],function(err, results){
            if(err) {
                console.log("Error executing query:",err);
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
            //console.log(results);
            connection.close();
        });
    });
    return deferred.promise;
};

exports.fetchGreater = function(rowid) {
    var deferred = Q.defer();
    oracle.connect(connectData,function(err,connection){
        if(err) {
            console.log("Error connecting to db:",err);
            deferred.reject(err);
        }
        connection.execute('SELECT OID as "Id", RECEIVE_DATE - 8/24 as "Date", INFORMATION as "Status", CAR_NAME as "LPN" , PHONE as "MOBILE" from TRANS_ARRIVE_MESSAGE WHERE OID > (:1) order by OID desc ',[rowid],function(err,results){
            if(err) {
                console.log("Error querying:",err);
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
            connection.close();
        });
    });
    return deferred.promise;
};
