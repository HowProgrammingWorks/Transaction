'use strict';

// Usage

const data = { name: 'Marcus Aurelius', born: 121, city: 'Rome' };

const cities = {
  'Roman Empire': ['Rome']
};

const [obj, transaction] = Transaction.start(data, {
  age() {
    return (
      new Date().getFullYear() -
      new Date(this.born + '').getFullYear()
    );
  },
  country() {
    // implementation cann access cities index
  }
});

console.dir({ age: obj.age, country: obj.country });
