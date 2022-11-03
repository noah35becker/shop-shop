export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object){
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('shop-shop', 1);  // open connection to database `shop-shop` w/ a version of 1

    let db, tx, store;  // database, transaction, object store

    request.onupgradeneeded = function(e){  // if version has changed, or if this is the first time using this database, run this method and create the three object stores
      db = request.result;
      db.createObjectStore('products', {keyPath: '_id'});
      db.createObjectStore('categories', {keyPath: '_id'});
      db.createObjectStore('cart', {keyPath: '_id'});
    }

    request.onsuccess = function(e){
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');  // `storeName` must match one of the store names listed above
      store = tx.objectStore(storeName);

      db.onerror = function(e){  // error handling
        console.error(e);
        reject();
      }

      switch (method){
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function(){
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          resolve();
          break;
        default:
          console.log('The method name provided for the IndexedDB transaction is invalid');
      }

      tx.oncomplete = function(){  // close the database connection when the transaction is complete
        db.close();
      }
    }

    request.onerror = function(e){  // error handling
      console.error(e);
      reject();
    }
  });
}