'use strict';

const data = { name: 'Marcus' };

const { proxy, revoke } = Proxy.revocable(data, {
  get(target, key) {
    return '[[' + target[key] + ']]';
  }
});

console.log(proxy.name);
revoke();
console.log(proxy.name);
