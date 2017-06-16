const desk = require('../models/desk.js');

test('Sanity check', () => expect(true).toBe(true));

test('Testing intact'
  ,() => {
  let fake = {};
  fake.remoteMethod = function() {}
  desk(fake)

  expect(fake.available()).toBe("yes")
  }
);
