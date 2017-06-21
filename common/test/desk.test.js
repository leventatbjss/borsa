const desk = require('../models/desk.js');

let deskService
let theDesk;
let t1;


beforeAll(() => {
// Hacky Initialisation
    deskService = {};
    deskService.remoteMethod = function () {
    }
    desk(deskService);
  }
);

describe("Adding lay offers to a single offer list of price [5]", () => {

  let baseDesk;
  let t2;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1000
      deskService.offerLayToDesk(theDesk, 5, t1, 'A', 100)
      expect(theDesk).toEqual(
        {
          lays: {
            ts: t1,
            trader: 'A',
            amount: 100,
            price: 5,
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerLayToDesk(theDesk, 4, t2, 'B', 200)
    expect(theDesk).toEqual(
      {
        lays: {
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
  })

  test('Adding 5', () => {
      deskService.offerLayToDesk(theDesk, 5, t2, 'B', 200)
      expect(theDesk).toEqual(
        {
          lays: {
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
    }
  );

  test('Adding 6', () => {
      deskService.offerLayToDesk(theDesk, 6, t2, 'C', 150)
      expect(theDesk).toEqual(
        {
          lays: {
            ts: t1,
            trader: 'A',
            amount: 100,
            price: 5,
            next: {
              ts: t2,
              trader: 'C',
              amount: 150,
              price: 6
            }
          }
        })
    }
  )

});

describe("Adding lay offers to an offer list of 2 offers with same price [5,5]", () => {

  let baseDesk;
  let t2, t3;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1000
      t3 = t2 + 1000
      deskService.offerLayToDesk(theDesk, 5, t1, 'A', 100)
      deskService.offerLayToDesk(theDesk, 5, t2, 'AA', 160)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, amount: 100, ts: t1, trader: 'A',
            next: {
              price: 5, amount: 160, ts: t2, trader: 'AA',
            }
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerLayToDesk(theDesk, 4, t3, 'B', 200)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 4, ts: t3, trader: 'B', amount: 200,
          next: {
            price: 5, ts: t1, trader: 'A', amount: 100,
            next: {
              price: 5, ts: t2, trader: 'AA', amount: 160
            }
          }
        }
      }
    )
  })

  test('Adding 5', () => {
      deskService.offerLayToDesk(theDesk, 5, t3, 'B', 200)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, ts: t1, trader: 'A', amount: 100,
            next: {
              price: 5, ts: t2, trader: 'AA', amount: 160,
              next: {
                price: 5, ts: t3, trader: 'B', amount: 200,
              }
            }
          }
        }
      )
    }
  );

  test('Adding 6', () => {
      deskService.offerLayToDesk(theDesk, 6, t3, 'C', 250)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, ts: t1, trader: 'A', amount: 100,
            next: {
              price: 5, ts: t2, trader: 'AA', amount: 160,
              next: {
                price: 6, ts: t3, trader: 'C', amount: 250,
              }
            }
          }
        }
      )
    }
  );

});

describe("Adding lay offers to an offer list of 3 offers with incremental prices [5,6,7]", () => {

  let baseDesk;
  let t2, t3, tx;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1000
      t3 = t2 + 1000
      tx = t3 + 1000
      deskService.offerLayToDesk(theDesk, 5, t1, 'A', 100)
      deskService.offerLayToDesk(theDesk, 6, t2, 'AA', 160)
      deskService.offerLayToDesk(theDesk, 7, t3, 'AAA', 170)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, amount: 100, ts: t1, trader: 'A',
            next: {
              price: 6, amount: 160, ts: t2, trader: 'AA',
              next: {
                price: 7, amount: 170, ts: t3, trader: 'AAA',
              }
            }
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerLayToDesk(theDesk, 4, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 4, amount: 300, ts: tx, trader: 'X',
          next: {
            price: 5, amount: 100, ts: t1, trader: 'A',
            next: {
              price: 6, amount: 160, ts: t2, trader: 'AA',
              next: {
                price: 7, amount: 170, ts: t3, trader: 'AAA',
              }
            }
          }
        }
      }
    )
  })

  test('Adding 5', () => {
    deskService.offerLayToDesk(theDesk, 5, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, amount: 100, ts: t1, trader: 'A',
          next: {
            price: 5, amount: 300, ts: tx, trader: 'X',
            next: {
              price: 6, amount: 160, ts: t2, trader: 'AA',
              next: {
                price: 7, amount: 170, ts: t3, trader: 'AAA',
              }
            }
          }
        }
      }
    )
  })

  test('Adding 6', () => {
    deskService.offerLayToDesk(theDesk, 6, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, amount: 100, ts: t1, trader: 'A',
          next: {
            price: 6, amount: 160, ts: t2, trader: 'AA',
            next: {
              price: 6, amount: 300, ts: tx, trader: 'X',
              next: {
                price: 7, amount: 170, ts: t3, trader: 'AAA',
              }
            }
          }
        }
      }
    )
  })

  test('Adding 7', () => {
    deskService.offerLayToDesk(theDesk, 7, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, amount: 100, ts: t1, trader: 'A',
          next: {
            price: 6, amount: 160, ts: t2, trader: 'AA',
            next: {
              price: 7, amount: 170, ts: t3, trader: 'AAA',
              next: {
                price: 7, amount: 300, ts: tx, trader: 'X',
              }
            }
          }
        }
      }
    )
  })

  test('Adding 8', () => {
    deskService.offerLayToDesk(theDesk, 8, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, amount: 100, ts: t1, trader: 'A',
          next: {
            price: 6, amount: 160, ts: t2, trader: 'AA',
            next: {
              price: 7, amount: 170, ts: t3, trader: 'AAA',
              next: {
                price: 8, amount: 300, ts: tx, trader: 'X',
              }
            }
          }
        }
      }
    )
  })
});

describe("Adding lay offers to a list of repetitions [5,5,6,6,7,7]", () => {

  let baseDesk;
  let t2, t3, t4, t5, t6, tx;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1;
      t3 = t2 + 1;
      t4 = t3 + 1;
      t5 = t4 + 1;
      t6 = t5 + 1;
      tx = t6 + 1;
      deskService.offerLayToDesk(theDesk, 7, t1, 'AAA', 170)
      deskService.offerLayToDesk(theDesk, 7, t2, 'AAA7', 180)
      deskService.offerLayToDesk(theDesk, 5, t3, 'A', 100)
      deskService.offerLayToDesk(theDesk, 5, t4, 'A5', 120)
      deskService.offerLayToDesk(theDesk, 6, t5, 'AA', 140)
      deskService.offerLayToDesk(theDesk, 6, t6, 'AA6', 155)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, ts: t3, trader: 'A', amount: 100,
            next: {
              price: 5, ts: t4, trader: 'A5', amount: 120,
              next: {
                price: 6, ts: t5, trader: 'AA', amount: 140,
                next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155,
                  next: {
                    price: 7, ts: t1, trader: 'AAA', amount: 170,
                    next: {
                      price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    }
                  }
                }
              }
            }
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerLayToDesk(theDesk, 4, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 4, ts: tx, trader: 'X', amount: 300,
          next: {
            price: 5, ts: t3, trader: 'A', amount: 100,
            next: {
              price: 5, ts: t4, trader: 'A5', amount: 120,
              next: {
                price: 6, ts: t5, trader: 'AA', amount: 140,
                next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155,
                  next: {
                    price: 7, ts: t1, trader: 'AAA', amount: 170,
                    next: {
                      price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 5', () => {
    deskService.offerLayToDesk(theDesk, 5, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t3, trader: 'A', amount: 100,
          next: {
            price: 5, ts: t4, trader: 'A5', amount: 120,
            next: {
              price: 5, ts: tx, trader: 'X', amount: 300,
              next: {
                price: 6, ts: t5, trader: 'AA', amount: 140,
                next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155,
                  next: {
                    price: 7, ts: t1, trader: 'AAA', amount: 170,
                    next: {
                      price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 6', () => {
    deskService.offerLayToDesk(theDesk, 6, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t3, trader: 'A', amount: 100,
          next: {
            price: 5, ts: t4, trader: 'A5', amount: 120,
            next: {
              price: 6, ts: t5, trader: 'AA', amount: 140,
              next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155,
                next: {
                  price: 6, ts: tx, trader: 'X', amount: 300,
                  next: {
                    price: 7, ts: t1, trader: 'AAA', amount: 170,
                    next: {
                      price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 7', () => {
    deskService.offerLayToDesk(theDesk, 7, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t3, trader: 'A', amount: 100,
          next: {
            price: 5, ts: t4, trader: 'A5', amount: 120,
            next: {
              price: 6, ts: t5, trader: 'AA', amount: 140,
              next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155,
                next: {
                  price: 7, ts: t1, trader: 'AAA', amount: 170,
                  next: {
                    price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    next: {
                      price: 7, ts: tx, trader: 'X', amount: 300,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 8', () => {
    deskService.offerLayToDesk(theDesk, 8, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t3, trader: 'A', amount: 100,
          next: {
            price: 5, ts: t4, trader: 'A5', amount: 120,
            next: {
              price: 6, ts: t5, trader: 'AA', amount: 140,
              next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155,
                next: {
                  price: 7, ts: t1, trader: 'AAA', amount: 170,
                  next: {
                    price: 7, ts: t2, trader: 'AAA7', amount: 180,
                    next: {
                      price: 8, ts: tx, trader: 'X', amount: 300,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

});

describe("Adding lay offers to a list of offers with a wide price gap [5,7]", () => {

  let baseDesk;
  let t2, tx;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1;
      tx = t2 + 1;
      deskService.offerLayToDesk(theDesk, 7, t1, 'AA', 170)
      deskService.offerLayToDesk(theDesk, 5, t2, 'A', 120)
      expect(theDesk).toEqual(
        {
          lays: {
            price: 5, ts: t2, trader: 'A', amount: 120,
            next: {
              price: 7, ts: t1, trader: 'AA', amount: 170,
            }
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerLayToDesk(theDesk, 4, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 4, ts: tx, trader: 'X', amount: 300,
          next: {
            price: 5, ts: t2, trader: 'A', amount: 120,
            next: {
              price: 7, ts: t1, trader: 'AA', amount: 170,
            }
          }
        }
      }
    )
  })

  test('Adding 5', () => {
    deskService.offerLayToDesk(theDesk, 5, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t2, trader: 'A', amount: 120,
          next: {
            price: 5, ts: tx, trader: 'X', amount: 300,
            next: {
              price: 7, ts: t1, trader: 'AA', amount: 170,
            }
          }
        }
      }
    )
  })

  test('Adding 6', () => {
    deskService.offerLayToDesk(theDesk, 6, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t2, trader: 'A', amount: 120,
          next: {
            price: 6, ts: tx, trader: 'X', amount: 300,
            next: {
              price: 7, ts: t1, trader: 'AA', amount: 170,
            }
          }
        }
      }
    )
  })

  test('Adding 7', () => {
    deskService.offerLayToDesk(theDesk, 7, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t2, trader: 'A', amount: 120,
          next: {
            price: 7, ts: t1, trader: 'AA', amount: 170,
            next: {
              price: 7, ts: tx, trader: 'X', amount: 300,
            }
          }
        }
      }
    )
  })

  test('Adding 8', () => {
    deskService.offerLayToDesk(theDesk, 8, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        lays: {
          price: 5, ts: t2, trader: 'A', amount: 120,
          next: {
            price: 7, ts: t1, trader: 'AA', amount: 170,
            next: {
              price: 8, ts: tx, trader: 'X', amount: 300,
            }
          }
        }
      }
    )
  })

})

describe("Adding back offers to a list of repetitions [5,5,6,6,7,7]", () => {

  let baseDesk;
  let t2, t3, t4, t5, t6, tx;

  beforeEach(() => {
      theDesk = {}
      t1 = Date.now()
      t2 = t1 + 1;
      t3 = t2 + 1;
      t4 = t3 + 1;
      t5 = t4 + 1;
      t6 = t5 + 1;
      tx = t6 + 1;
      deskService.offerBackToDesk(theDesk, 7, t1, 'AAA', 170)
      deskService.offerBackToDesk(theDesk, 7, t2, 'AAA7', 180)
      deskService.offerBackToDesk(theDesk, 5, t3, 'A', 100)
      deskService.offerBackToDesk(theDesk, 5, t4, 'A5', 120)
      deskService.offerBackToDesk(theDesk, 6, t5, 'AA', 140)
      deskService.offerBackToDesk(theDesk, 6, t6, 'AA6', 155)
      expect(theDesk).toEqual(
        {
          backs: {
            price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
              price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
                price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                    price: 5, ts: t3, trader: 'A', amount: 100, next: {
                      price: 5, ts: t4, trader: 'A5', amount: 120,
                    }
                  }
                }
              }
            }
          }
        })
    }
  );

  test('Adding 4', () => {
    deskService.offerBackToDesk(theDesk, 4, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        backs: {
          price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
            price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
              price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                  price: 5, ts: t3, trader: 'A', amount: 100, next: {
                    price: 5, ts: t4, trader: 'A5', amount: 120, next: {
                      price: 4, ts: tx, trader: 'X', amount: 300,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 5', () => {
    deskService.offerBackToDesk(theDesk, 5, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        backs: {
          price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
            price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
              price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                  price: 5, ts: t3, trader: 'A', amount: 100, next: {
                    price: 5, ts: t4, trader: 'A5', amount: 120, next: {
                      price: 5, ts: tx, trader: 'X', amount: 300,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 6', () => {
    deskService.offerBackToDesk(theDesk, 6, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        backs: {
          price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
            price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
              price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                  price: 6, ts: tx, trader: 'X', amount: 300, next: {
                    price: 5, ts: t3, trader: 'A', amount: 100, next: {
                      price: 5, ts: t4, trader: 'A5', amount: 120,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 7', () => {
    deskService.offerBackToDesk(theDesk, 7, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        backs: {
          price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
            price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
              price: 7, ts: tx, trader: 'X', amount: 300, next: {
                price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                    price: 5, ts: t3, trader: 'A', amount: 100, next: {
                      price: 5, ts: t4, trader: 'A5', amount: 120,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })

  test('Adding 8', () => {
    deskService.offerBackToDesk(theDesk, 8, tx, 'X', 300)
    expect(theDesk).toEqual(
      {
        backs: {
          price: 8, ts: tx, trader: 'X', amount: 300, next: {
            price: 7, ts: t1, trader: 'AAA', amount: 170, next: {
              price: 7, ts: t2, trader: 'AAA7', amount: 180, next: {
                price: 6, ts: t5, trader: 'AA', amount: 140, next: {
                  price: 6, ts: t6, trader: 'AA6', amount: 155, next: {
                    price: 5, ts: t3, trader: 'A', amount: 100, next: {
                      price: 5, ts: t4, trader: 'A5', amount: 120,
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  })



});


test('Testing desk available', () => {
    expect(deskService.available()).toBe("yes")
  }
);
