/**
 * Created by Beeven on 7/19/2014.
 */

'use strict';

describe('MainController',function(){
    var scope;
    beforeEach(module("NoticeControllers"));
    beforeEach(inject(function($rootScope,$controller){
        scope = $rootScope.$new();
        $controller("MainController",{$scope:scope});
    }));

    it("should have a variable named filterText",function(){
        scope.should.have.a.property("filterText");
    });
});