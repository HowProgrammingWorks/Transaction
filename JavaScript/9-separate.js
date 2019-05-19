'use strict';

// Interface definition

class Transaction {
  constructor() {
    // this.delta
  }

  static start(data) {
    // place implementation here
    return [obj, transaction];
  }

  commit() {}
  rollback() {}
  revoke() {}
  timeout(msec) {}
  before(event, listener) {}
  after(event, listener) {}
  // Events: commit, rollback, revoke, set, get, timeout
}

// Usage

const data = { name: 'Marcus Aurelius', born: 121 };

const [obj, transaction] = Transaction.start(data);
console.dir({ data });

obj.name = 'Mao Zedong';
obj.born = 1893;
obj.city = 'Shaoshan';
obj.age = (
  new Date().getFullYear() -
  new Date(transaction.born + '').getFullYear()
);

console.dir({ obj });
console.dir({ delta: transaction.delta });

transaction.commit();
console.dir({ data });
console.dir({ obj });
console.dir({ delta: transaction.delta });

obj.born = 1976;
console.dir({ obj });
console.dir({ delta: transaction.delta });

transaction.rollback();
console.dir({ data });
console.dir({ obj });
console.dir({ delta: transaction.delta });
