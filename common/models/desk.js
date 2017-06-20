'use strict';

var SortedMap = require("collections/sorted-map");

module.exports = function (Desk) {

  Desk.available = function available() {
    return "yes"
  }

  function match(offer, price, amount, trader, now, comparator) {
    let matched = 0
    while (offer && comparator(offer.price) && amount > 0) {
      let transaction;
      if (amount < offer.amount) {
        transaction = {
          offeror: offer.trader,
          taker: trader,
          amount: amount,
          ts: now,
        }
        offer.amount -= amount
        matched += amount
      } else {
        transaction = {
          offeror: offer.trader,
          taker: trader,
          amount: offer.amount,
          ts: now,
        }
        amount -= offer.amount
        matched += offer.amount
        offer = offer.next
      }
    }
    return matched;
  }

  function back(targetDesk, price, now, trader, amount) {
    return match(targetDesk.backs, price, amount, trader, now, (offerPrice) => offerPrice <= price);
  }

  function lay(targetDesk, price, now, trader, amount) {
    return match(targetDesk.lays, price, amount, trader, now, (offerPrice) => offerPrice >= price);
  }

  // Lay
  Desk.offerLayToDesk = function offerLayToDesk(targetDesk, price, now, trader, amount) {
    let backed = back(targetDesk, price, now, trader, amount)
    amount = amount - backed;

    let offer = {
      ts: now,
      trader: trader,
      amount: amount,
      price: price,
    }

    if (!targetDesk.lays) {
      targetDesk.lays = offer
    } else {
      let cur
      let next = targetDesk.lays

      if (price < next.price) {
        offer.next = targetDesk.lays
        targetDesk.lays = offer
        return
      }
      cur = next
      next = cur.next
      while (true) {
        if (!next) {
          cur.next = offer
          return
        }
        if (price >= cur.price && price < next.price) {
          cur.next = offer
          offer.next = next
          return
        }
        cur = next
        next = cur.next
      }
    }
  }

  Desk.layOffer = function (deskId, trader, price, amount, callback) {
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
      offerLayToDesk(targetDesk, price, now, trader, amount);

      return callback(null, targetDesk)
    }
  };

  Desk.remoteMethod(
    'layOffer',
    {
      http: {path: '/layOffer', verb: 'post'},
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
