'use strict';

function Transaction() {}

Transaction.start = (data) => {
  console.log('\nstart transaction');
  const events = {
    commit: [], rollback: [], timeout: [], change: []
  };
  let delta = {};

  const emit = (name) => {
    const event = events[name];
    for (const listener of event) listener(data);
  };

  const methods = {
    commit: () => {
      Object.assign(data, delta);
      delta = {};
      emit('commit');
    },
    rollback: () => {
      delta = {};
      emit('rollback');
    },
    clone: () => {
      const cloned = Transaction.start(data);
      Object.assign(cloned.delta, delta);
      return cloned;
    },
    on: (name, callback) => {
      const event = events[name];
      if (event) event.push(callback);
    }
  };

  return new Proxy(data, {
    get(target, key) {
      if (key === 'delta') return delta;
      if (methods.hasOwnProperty(key)) return methods[key];
      if (delta.hasOwnProperty(key)) return delta[key];
      return target[key];
    },
    getOwnPropertyDescriptor: (target, key) => (
      Object.getOwnPropertyDescriptor(
        delta.hasOwnProperty(key) ? delta : target, key
      )
    ),
    ownKeys() {
      const changes = Object.keys(delta);
      const keys = Object.keys(data).concat(changes);
      return keys.filter((x, i, a) => a.indexOf(x) === i);
    },
    set(target, key, val) {
      console.log('set', key, val);
      if (target[key] === val) delete delta[key];
      else delta[key] = val;
      return true;
    }
  });
};

function DatasetTransaction(dataset) {
  this.dataset = dataset;
}

DatasetTransaction.start = function(dataset) {
  // place implementation here
  return new DatasetTransaction(dataset);
};

DatasetTransaction.prototype.commit = function() {
  // place implementation here
};

DatasetTransaction.prototype.rollback = function() {
  // place implementation here
};

// Usage

const data = [
  { name: 'Marcus Aurelius', born: 121 },
  { name: 'Marcus Aurelius', born: 121 },
  { name: 'Marcus Aurelius', born: 121 },
];

const transaction = DatasetTransaction.start(data);

for (const person of transaction.dataset) {
  person.city = 'Shaoshan';
}

transaction.commit();

console.dir({ data });
