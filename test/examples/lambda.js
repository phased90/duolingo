const should = require('chai').should(),
	streakMaintenance = require('../../examples/lambda');

describe('Streak Maintenance', function () {
	describe('isEquipped()', function () {
		it('running test on real life data', function () {
			let items = {
				"shopItems": [
				{
					"wagerDay": 4,
					"purchaseDate": 1520451683,
					"purchasePrice": 5,
					"purchaseId": "1ecb452271da99c0b04b6128d5981b67",
					"itemName": "rupee_wager",
					"id": "rupee_wager"
				},
				{
					"purchaseId": "8b722aa35c014ccc413f388bab762c11",
					"purchaseDate": 1520852026,
					"itemName": "streak_freeze",
					"id": "streak_freeze",
					"purchasePrice": 10
				}
				]
			}
			streakMaintenance.isEquipped(items, 'streak_freeze').should.equal(true);
			streakMaintenance.isEquipped(items, 'rupee_wager').should.equal(true);
			streakMaintenance.isEquipped(items, 'rupee_wager_3').should.equal(false);
			streakMaintenance.isEquipped(items, 'timed_practice').should.equal(false);
		})
		it('running test on object with empty shop items', function () {
			let items = {
				"shopItems": []
			}
			streakMaintenance.isEquipped(items, 'streak_freeze').should.equal(false);
			streakMaintenance.isEquipped(items, 'rupee_wager').should.equal(false);
			streakMaintenance.isEquipped(items, 'rupee_wager_3').should.equal(false);
		})
	})
})
