/**
 * Created by Levent.Aksu on 22/06/2017.
 */

module.exports.offerLayToDesk = offerLayToDesk;
module.exports.offerBackToDesk = offerBackToDesk;
module.exports.offerLay = offerLay;

match = function match(offer, price, amount, trader, ts, comparator) {
  let matched = 0;
  while (offer && comparator(offer.price) && amount > 0) {
    let trade;
    if (amount < offer.amount) {
      trade = {offeror: offer.trader, taker: trader, price: price, amount: amount, ts: ts,};
      offer.amount -= amount;
      matched += amount
    } else {
      trade = {offeror: offer.trader, taker: trader, price: price, amount: offer.amount, ts: ts,};
      amount -= offer.amount;
      matched += offer.amount;
      offer = offer.next
    }
  }
  return matched;
};

function offerToDesk(offer, head, headSetter, comparator) {
  if (!head) {
    headSetter(offer);
    return
  }
  if (comparator(offer.price, head.price)) {
    offer.next = head;
    headSetter(offer);
    return
  }
  let cur = head;
  let next = head.next;
  while (true) {
    if (!next) {
      cur.next = offer;
      return
    }
    if (comparator(offer.price, next.price, cur.price)) {
      cur.next = offer;
      offer.next = next;
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

function offerLay(deskId, trader, price, amount, callback) {
  let message = `deskId=${deskId} trader=${trader} minPrice=${price} amount=${amount}`;
  console.log(message);
  let now = Date.now();
  try {
    let offer = new Offer(trader, price, amount, now)
  } catch (e) {
    let error = new Error(`Invalid request to offer. Parameters are:${message}`);
    error.status = 400;
    return callback(error);
  }

  Desk.findById(deskId).then(
    (model) => {
      if (model) {
        let targetDesk = model.getData();
        // deskService.queueOffer(new Offer(trader, price, amount, now, Offer.LAY))
        deskService.offerLayToDesk(targetDesk, price, now, trader, amount);
        model.save().then(
          (updated) => {
            return callback(null, updated.getData());
          },
          (reason) => {
            let error = new Error(`Desk cannot be saved back. id=${deskId} reason=${reason}`);
            error.status = 500;
            return callback(error)
          }
        )
      } else {
        let error = new Error(`Desk cannot be found. id=${deskId}`);
        error.status = 404;
        return callback(error)
      }
    },
    (reason) => {
      let error = new Error(`Error when finding desk. id=${deskId} reason=${reason}`);
      error.status = 500;
      return callback(error)
    });
}

function offerLayToDesk(targetDesk, price, now, trader, amount) {
  let remaining = amount - back(targetDesk, price, now, trader, amount);
  let offer = {ts: now, trader: trader, amount: remaining, price: price};
  offerToDesk(offer, targetDesk.lays,
    (offer) => targetDesk.lays = offer,
    (price, nextPrice, curPrice) => price < nextPrice || (price < nextPrice && (curPrice && price >= curPrice)));
}
function offerBackToDesk(targetDesk, price, now, trader, amount) {
  amount = amount - lay(targetDesk, price, now, trader, amount);
  let offer = {ts: now, trader: trader, amount: amount, price: price};
  offerToDesk(offer, targetDesk.backs,
    (offer) => targetDesk.backs = offer,
    (price, nextPrice, curPrice) => price > nextPrice || (price > nextPrice && (curPrice && price <= curPrice)));
}

