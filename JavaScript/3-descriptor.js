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
    }
  };

  return new Proxy(data, {
    get(target, key) {
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
};

// Usage

const data = { name: 'Marcus Aurelius', city: 'Rome', born: 121 };

const transaction = Transaction.start(data);
console.log(JSON.stringify(data), JSON.stringify(transaction));
console.dir({ data, transaction });

transaction.name = 'Mao Zedong';
transaction.born = 1893;
console.log('JSON:', JSON.stringify(data), JSON.stringify(transaction));
console.dir({ data, transaction });

transaction.commit();
console.log('JSON:', JSON.stringify(data), JSON.stringify(transaction));
console.dir({ data, transaction });

transaction.city = 'Shaoshan';
console.log('JSON:', JSON.stringify(data), JSON.stringify(transaction));
console.dir({ data, transaction });

transaction.rollback();
console.log('JSON:', JSON.stringify(data), JSON.stringify(transaction));
console.dir({ data, transaction });
