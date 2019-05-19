'use strict';

function Transaction() {}

Transaction.start = data => {
  console.log('start transaction');
  const events = { commit: [], rollback: [], timeout: [], change: [] };
  let delta = {};

  const methods = {
    commit: () => {
      console.log('commit transaction');
      Object.assign(data, delta);
      delta = {};
    },
    rollback: () => {
      console.log('rollback transaction');
      delta = {};
    },
    clone: () => {
      console.log('clone transaction');
      const cloned = Transaction.start(data);
      Object.assign(cloned.delta, delta);
      return cloned;
    },
    delta: () => delta,
    on: (name, callback) => {
      const event = events[name];
      if (event) event.push(callback);
    }
  };

  const getKeys = () => {
    const changes = Object.keys(delta);
    const keys = Object.keys(data).concat(changes);
    return keys.filter((x, i, a) => a.indexOf(x) === i);
  };

  const proxy = new Proxy(data, {
    get(target, key, proxy) {
      if (key === Symbol.iterator) return getKeys()[key]();
      if (methods.hasOwnProperty(key)) return methods[key];
      if (delta.hasOwnProperty(key)) return delta[key];
      return target[key];
    },
    ownKeys(target) {
      return getKeys();
    },
    getOwnPropertyDescriptor: (target, key) => (
      Object.getOwnPropertyDescriptor(
        delta.hasOwnProperty(key) ? delta : target, key
      )
    ),
    set(target, key, val) {
      console.log('set', key, val);
      if (target[key] === val) delete delta[key];
      else delta[key] = val;
      return true;
    }
  });
  return proxy;
};

// Usage

const data = { name: 'Marcus Aurelius', born: 121 };

const transaction = Transaction.start(data);
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

transaction.name = 'Mao Zedong';
transaction.born = 1893;
transaction.city = 'Shaoshan';

console.log('\noutput with JSON.stringify:');
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

console.log('\noutput with console.dir:');
console.dir({ transaction });

console.log('\noutput with for-in:');
for (const key in transaction) {
  console.log(key, transaction[key]);
}

transaction.commit();
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

transaction.born = 1976;
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

transaction.rollback();
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));
