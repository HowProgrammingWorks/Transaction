'use strict';

function Transaction() {}

Transaction.start = (data) => {
  console.log('start transaction');
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
    delta: () => delta
  };

  const proxy = new Proxy(data, {
    get(target, key) {
      if (key === Symbol.iterator) {
        const changes = Object.keys(delta);
        const keys = Object.keys(target).concat(changes);
        const props = keys.filter((x, i, a) => a.indexOf(x) === i);
        return props[Symbol.iterator]();
      }
      if (methods.hasOwnProperty(key)) return methods[key];
      if (delta.hasOwnProperty(key)) return delta[key];
      return target[key];
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

const data = { name: 'Marcus Aurelius', city: 'Rome', born: 121 };

const transaction = Transaction.start(data);
console.dir({ data, transaction, delta: transaction.delta() });

transaction.name = 'Mao Zedong';
transaction.born = 1893;
console.dir({ data, transaction, delta: transaction.delta() });

transaction.commit();
console.dir({ data, transaction, delta: transaction.delta() });

transaction.city = 'Shaoshan';
console.dir({ data, transaction, delta: transaction.delta() });

transaction.rollback();
console.dir({ data, transaction, delta: transaction.delta() });
