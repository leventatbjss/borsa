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
    let blankDesk = {}
    let t1 = Date.now();
    desks.addSellOfferToDesk(blankDesk, 5, t1, 'A', 100)
    expect(blankDesk).toEqual(
      {
        sellHead: {
          ts: t1,
          trader: 'A',
          amount: 100,
          price: 5,
        }
      })

  let t2 = Date.now();
  var baseDesk = Object.assign({},blankDesk)

  desks.addSellOfferToDesk(baseDesk, 4, t2, 'B', 200)
  expect(baseDesk).toEqual(
    {
      sellHead: {
        ts: t2,
        trader: 'B',
        amount: 200,
        price: 4,
        next: {
          ts: t1,
          trader: 'A',
          amount: 100,
          price: 5
        }
      }
    })

  baseDesk = Object.assign({},blankDesk)
  desks.addSellOfferToDesk(baseDesk, 5, t2, 'B', 200)
  expect(baseDesk).toEqual(
    {
      sellHead: {
        ts: t1,
        trader: 'A',
        amount: 100,
        price: 5,
        next: {
          ts: t2,
          trader: 'B',
          amount: 200,
          price: 5
        }
      }
    })

  // baseDesk = Object.assign({},blankDesk)
  // desks.addSellOfferToDesk(baseDesk, 6, t2, 'B', 250)
  // expect(baseDesk).toEqual(
  //   {
  //     sellHead: {
  //       ts: t1,
  //       trader: 'A',
  //       amount: 100,
  //       price: 5,
  //       next: {
  //         ts: t2,
  //         trader: 'B',
  //         amount: 250,
  //         price: 6
  //       }
  //     }
  //   })



  }
);

