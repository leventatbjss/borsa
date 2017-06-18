'use strict';

module.exports = function (Desk) {

  available =function available() {
    return "yes"
  }

  function addSellDrawerToDesk(desk, drawer, price) {
    if (!desk.drawers) {
      desk.drawers[price] = drawer;
    }
  }

  function addSellOfferToDesk(targetDesk, price, now, trader, amount) {
    let drawer = targetDesk.drawers[price];
    if (!drawer) {
      drawer = {
        price: price,
        total: 0,
      };
      addSellDrawerToDesk(desk, drawer, price);

    }

    let newOffer = {
      ts: now,
      trader: trader,
      amount: amount,
    };

    if (!drawer.offers) {
      drawer.offers = [];
      drawer.first = newOffer;
      drawer.last = newOffer
    }

    drawer.offers.push(newOffer);
    let previousLastOffer = drawer.last;
    previousLastOffer.next = newOffer;
    drawer.last = newOffer

  }

  Desk.sellOffer = function (deskId, trader, price, amount, callback) {
    let message = `deskId=${deskId} trader=${trader} minPrice=${price} amount=${amount}`;
    console.log(message);
    if (
      deskId == null ||
      trader == null ||
      price <= 0 ||
      amount <= 0
    ) {
      let error = new Error(`Invalid request to sell. Parameters are:${message}`);
      error.status = 400;
      return callback(error);
    }
    else {
      let now = Date.now();
      let targetDesk = Desk.findById(deskId);
      if (!targetDesk) {
        return callback(new Error(`Desk not found , with Id=${deskId}`))
      }
      targetDesk = {};
      addSellOfferToDesk(targetDesk, price, now, trader, amount);

      return callback(null, targetDesk)
    }
  };

  Desk.remoteMethod(
    'sellOffer',
    {
      http: {path: '/sellOffer', verb: 'post'},
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

  Desk.status = function (cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_HOUR = 6;
    var CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    var response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    }
    cb(null, response);
  };

  Desk.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get'
      },
      returns: {
        arg: 'status',
        type: 'string'
      }
    }
  );

};
