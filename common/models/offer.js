const side = {
  LAY: Symbol(),
  BACK: Symbol()
};

class Offer {
  constructor(trader, price, amount, ts, side) {
    if (!trader) throw `Invalid offer: No trader`;
    if (!price || price <= 0) throw `Invalid offer: price=${price}`;
    if (!amount || amount <= 0) throw `Invalid offer: amount=${amount}`;
    if (!ts || ts <= 0) throw `Invalid offer: ts=${ts}`;
    this.trader = trader;
    this.price = price;
    this.amount = amount;
    this.ts = ts;
    if (side) {
      this.side = side;
    }
  }
}
