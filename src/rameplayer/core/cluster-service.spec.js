/* jshint -W117, -W030 */

// Test cases

describe('rameplayer.clusterService', function() {
    // load module rameplayer
    beforeEach(angular.mock.module('rameplayer'));

    var clusterService;

    beforeEach(function() {
        inject(function(_clusterService_) {
            clusterService = _clusterService_;
        });
    });

    describe('ClusterService', function() {
        it('should be created successfully', function() {
            expect(clusterService).to.be.defined;
        });

        it('should create a unit', function() {
            var address = '192.168.0.100';
            var port = 8000;
            var delay = 1;
            var unitId = clusterService.addUnit(address, port, delay);
            expect(clusterService.units).to.have.length(1);
            expect(unitId).to.be.a('string').with.length.of.at.least(5);
        });

        it('should find correct unit', function() {
            var address = '192.168.0.101';
            var port = 8000;
            var delay = 1;

            // add 3 units
            clusterService.addUnit('192.168.0.100', 8001, 0);
            var unitId = clusterService.addUnit(address, port, delay);
            clusterService.addUnit('192.168.0.102', 8002, 3);
            expect(clusterService.units).to.have.length(3);
            
            var unit = clusterService.getUnit(unitId);
            // For debugging show contents of unit object
            // console.log('Unit: ', unit);
            expect(unit).to.be.a('object');
            expect(unit.host).to.equal(address);
            expect(unit.port).to.equal(port);
            expect(unit.delay).to.equal(delay);
            expect(unit).to.have.property('color');
        });
    });
});
