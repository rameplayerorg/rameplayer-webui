/* jshint -W117, -W030 */

// Test cases

describe('rameplayer.playlists', function() {
    // load module rameplayer
    beforeEach(angular.mock.module('rameplayer'));

    var controller;

    beforeEach(inject(function(_$controller_, _$rootScope_, _logger_, _dataService_,
                               _statusService_, _clusterService_, _listService_,
                               _$uibModal_, _uuid_, _ItemTypes_) {
        var $scope = {};
        controller = _$controller_('PlaylistsController', {
            $rootScope: _$rootScope_,
            $scope: $scope,
            logger: _logger_,
            dataService: _dataService_,
            statusService: _statusService_,
            clusterService: _clusterService_,
            listService: _listService_,
            $uibModal: _$uibModal_,
            uuid: _uuid_,
            ItemTypes: _ItemTypes_
        });
    }));

    describe('Playlists controller', function() {
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });
    });
});
