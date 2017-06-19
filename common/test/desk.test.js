const desk = require('../models/desk.js');

let desks = {};
desks.remoteMethod = function () {
}
desk(desks);

test('Testing desk available', () => {
    expect(desks.available()).toBe("yes")
  }
);

test('Adding offers to empty desk', () => {
    let d = {}
    let now = Date.now();
    desks.addSellOfferToDesk(d, 5, now, 'A', 100)
    expect(d).toEqual(
      {
        sellHead: {
          ts: now,
          trader: 'A',
          amount: 100,
          price: 5
        }
      })
  }
);

