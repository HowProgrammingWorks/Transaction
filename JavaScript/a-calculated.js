'use strict';

const { Transaction } = require('./9-separate.js');

// Usage

const data = { name: 'Marcus Aurelius', born: 121, city: 'Rome' };

const cities = {
  'Roman Empire': ['Rome'],
};

const [obj, transaction] = Transaction.start(data, {
  age() {
    const currentYear = new Date().getFullYear();
    const bornYear = new Date(this.born.toString()).getFullYear();
    return currentYear - bornYear;
  },
  country() {
    // implementation cann access cities index
  },
});

console.dir({ age: obj.age, country: obj.country });
