/**
 * Created by Beeven on 7/17/2014.
 */

var Q = require("q");


exports.fetch = function (index, count, filter) {
    var deferred = Q.defer();
    setTimeout(function () {
        if(filter == null || typeof(filter) === 'undefined') {
            deferred.resolve([
                {"Id":5,"LPN": "粤ADE077", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02838放行！", "Date": new Date("2014-7-16 11:53:05")},
                {"Id":4,"LPN": "粤P02838", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02838放行！", "Date": new Date("2014-7-16 11:43:05")},
                {"Id":3,"LPN": "粤P02839", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02839放行！", "Date": new Date("2014-7-16 11:33:05")},
                {"Id":2,"LPN": "粤P02890", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02890放行！", "Date": new Date("2014-7-16 11:23:05")},
                {"Id":1,"LPN": "粤P02891", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02891放行！", "Date": new Date("2014-7-16 11:13:05")}
            ]);
        } else {
            deferred.resolve([
                {"Id":6,"LPN": filter, "Mobile": filter, "Status": "请到查验台施、解关锁，车辆粤P02891放行！", "Date": new Date("2014-7-16 11:13:05") }
            ]);
        }

    });

    return deferred.promise;
};

exports.fetchGreater = function (rowId) {
    return Q.Promise(function (resolve, reject, notify) {
        setTimeout(function(){
            resolve([
                {"Id":parseInt(rowId)+1,"LPN": "粤P02891", "Mobile": "18665559889", "Status": "请到查验台施、解关锁，车辆粤P02891放行！", "Date": new Date()}
            ]);
        })
    });
};

