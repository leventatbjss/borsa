'use strict';

var SortedMap = require("collections/sorted-map");

module.exports = function (Desk) {

  function match(offer, price, amount, trader, ts, comparator) {
    let matched = 0
    while (offer && comparator(offer.price) && amount > 0) {
      let trade;
      if (amount < offer.amount) {
        trade = {offeror: offer.trader, taker: trader, price: price, amount: amount, ts: ts,}
        offer.amount -= amount
        matched += amount
      } else {
        trade = {offeror: offer.trader, taker: trader, price: price, amount: offer.amount, ts: ts,}
        amount -= offer.amount
        matched += offer.amount
        offer = offer.next
      }
    }
    return matched;
  }

  function offerToDesk(offer, head, headSetter, comparator) {
    if (!head) {
      headSetter(offer)
      return
    }
    if (comparator(offer.price, head.price)) {
      offer.next = head
      headSetter(offer)
      return
    }
    let cur = head
    let next = head.next
    while (true) {
      if (!next) {
        cur.next = offer
        return
      }
      if (comparator(offer.price, next.price, cur.price)) {
        cur.next = offer
        offer.next = next
        return
      }
      cur = next;
      next = cur.next
    }
  }

  function back(targetDesk, price, now, trader, amount) {
    return match(targetDesk.backs, price, amount, trader, now, (offerPrice) => offerPrice <= price);
  }

  function lay(targetDesk, price, now, trader, amount) {
    return match(targetDesk.lays, price, amount, trader, now, (offerPrice) => offerPrice >= price);
  }

  Desk.offerLayToDesk = function offerLayToDesk(targetDesk, price, now, trader, amount) {
    amount = amount - back(targetDesk, price, now, trader, amount);
    let offer = {ts: now, trader: trader, amount: amount, price: price,}
    offerToDesk(offer, targetDesk.lays,
      (offer) => targetDesk.lays = offer,
      (price, nextPrice, curPrice) => price < nextPrice || (price < nextPrice && (curPrice && price >= curPrice)));
  }

  Desk.offerBackToDesk = function offerBackToDesk(targetDesk, price, now, trader, amount) {
    amount = amount - lay(targetDesk, price, now, trader, amount);
    let offer = {ts: now, trader: trader, amount: amount, price: price,}
    offerToDesk(offer, targetDesk.backs,
      (offer) => targetDesk.backs = offer,
      (price, nextPrice, curPrice) => price > nextPrice || (price > nextPrice && (curPrice && price <= curPrice)));
  }

  Desk.offerLay = function (deskId, trader, price, amount, callback) {
    let message = `deskId=${deskId} trader=${trader} minPrice=${price} amount=${amount}`;
    console.log(message);
    if (
      deskId == null ||
      trader == null ||
      price <= 0 ||
      amount <= 0
    ) {
      let error = new Error(`Invalid request to offer. Parameters are:${message}`);
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
      Desk.offerLayToDesk(targetDesk, price, now, trader, amount);

      return callback(null, targetDesk)
    }
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

};
