'use strict';

function Transaction() {}

Transaction.start = data => {
  console.log('\nstart transaction');
  const events = {
    commit: [], rollback: [], timeout: [], change: []
  };
  let delta = {};

  const emit = name => {
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

// Dataset `this.log` example: [
//    { id, time: '2018-01-01T12:01:00', operation: 'start' }
//    { id, time: '2018-01-01T12:02:15', operation: 'set', delta }
//    { id, time: '2018-01-01T12:02:32', operation: 'commit', delta }
//    { id, time: '2018-01-01T12:02:37', operation: 'set', delta }
//    { id, time: '2018-01-01T12:03:11', operation: 'rollback', delta }
//    { id, time: '2018-01-01T12:03:18', operation: 'set', delta }
//    { id, time: '2018-01-01T12:04:42', operation: 'timeout' }
//    { id, time: '2018-01-01T12:04:52', operation: 'rollback', delta }
// ]
class DatasetTransaction {
  constructor(dataset) {
    this.dataset = dataset;
    this.log = []; // array of LogRecord { time, operation, delta }
  }

  static start(dataset) {
    // place implementation here
    return new DatasetTransaction(dataset);
  }

  commit() {
    // place implementation here
  }

  rollback(id) {
    // place implementation here
  }

  //  msec <number> timeout, 0 to disable
  //  commit <boolean> true to commit, false to rollback
  //  listener <Function> (optional)
  //    callback <Function>
  //      result <boolean>
  timeout(msec, commit, listener) {
    // place implementation here
  }
}

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
