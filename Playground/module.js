const Store = (function () {
  let itemCount = 0;
  const items = [];

  return {
    add(name) {
      itemCount++;
      items.push(name);
      return `${name} added in stocks.`;
    },
    count() {
      return itemCount;
    },
    list() {
      return items.slice();
    },
  };
})();

/*
console.log(Store.add("Tea 10 packs"));
console.log(Store.add("Coffee 50 packs"));
console.log(Store.add("Sweets 100 pics"));
console.log(Store.count());
console.log(Store.list());
*/

const AccountBook = (function () {
  const accessLogs = [];
  const records = [];

  function infoLog(action) {
    accessLogs.push(`[${new Date().toISOString()}] - ${action}`);
  }

  function store(item) {
    infoLog(`${item} added to records.`);
    records.push(item);
  }

  function retrieve(index) {
    infoLog(`Record ${index} retrieved.`);
    return records[index] || "Not found";
  }

  function getLogs() {
    return accessLogs.slice();
  }

  function getRecordCount() {
    return records.length;
  }

  return {
    store,
    retrieve,
    count: getRecordCount,
    log: getLogs,
  };
})();

/*
AccountBook.store("10 packs of Tea");
AccountBook.store("25 pics of Chocolate");
AccountBook.store("20 packs of Coffee");

console.log(AccountBook.count());
console.log(AccountBook.retrieve(2));
console.log(AccountBook.log());

console.log(typeof AccountBook.infoLog);
*/
