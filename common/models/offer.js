class Offer {
  constructor(trader, price, amount, ts) {
    if (!trader) throw `Invalid offer: No trader`
    if (!price || price <= 0) throw `Invalid offer: price=${price}`
    if (!amount || amount <= 0) throw `Invalid offer: amount=${amount}`
    if (!ts || ts <= 0) throw `Invalid offer: ts=${ts}`
    this.trader = trader
    this.price = price
    this.amount = amount
    this.ts = ts
  }
}
