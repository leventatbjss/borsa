'use strict';
const deskService = require('./desk-service.js');
module.exports = function (Desk) {

  Desk.offerLay = function (deskId, trader, price, amount, callback) {
    return deskService.offerLay(deskId, trader, price, amount, callback)
  };

  Desk.remoteMethod(
    'offerLay',
    {
      http: {path: '/offerLay', verb: 'post'},
      accepts: [
        {arg: 'id', type: 'String', required: true},
        {arg: 'trader', type: 'String', required: true},
        {arg: 'minPrice', type: 'number', required: true},
        {arg: 'amount', type: 'number', required: true},
      ],
      returns: {arg: 'contract', type: 'object'}
    }
  );

// Desk.buyOffer = function(deskId, trader, maxPrice, amount) {
//
// }
//
// Desk.remoteMethod(
//   'buyOffer',
//   {
//     http: {path: '/buyOffer', verb: 'post'},
//     accepts: [
//       {arg: 'id', type: 'String', required: true},
//       {arg: 'trader', type: 'String', required: true},
//       {arg: 'maxPrice', type: 'number', required: true},
//       {arg: 'amount', type: 'number', required: true},
//     ],
//   }
// );

  Desk.available = function available() {
    return "yes"
  }

}
;
