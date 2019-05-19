'use strict';

const start = data => {
  console.log('\nstart transaction');
  let delta = {};
  const commit = () => {
    console.log('\ncommit transaction');
    Object.assign(data, delta);
    delta = {};
  };
  return new Proxy(data, {
    get(target, key) {
      if (key === 'commit') return commit;
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

const data = { name: 'Marcus Aurelius', born: 121 };

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
