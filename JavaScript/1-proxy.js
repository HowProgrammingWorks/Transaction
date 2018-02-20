'use strict';

const start = (data) => {
  console.log('start transaction');
  let delta = {};
  return new Proxy(data, {
    get(target, key) {
      if (key === 'commit') {
        return () => {
          console.log('commit transaction');
          Object.assign(data, delta);
          delta = {};
        };
      }
      if (delta.hasOwnProperty(key)) return delta[key];
      return target[key];
    },
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

console.log('data.name', data.name);
console.log('data.born', data.born);

const transaction = start(data);

transaction.name = 'Mao Zedong';
transaction.born = 1893;

console.log('data.name', data.name);
console.log('data.born', data.born);

console.log('transaction.name', transaction.name);
console.log('transaction.born', transaction.born);

transaction.commit();

console.log('data.name', data.name);
console.log('data.born', data.born);

console.log('transaction.name', transaction.name);
console.log('transaction.born', transaction.born);
