// 数据库名称
const database = {
  // 名称
  name: 'clipboard',
  // 版本
  version: 1,
  // 主键
  keyPath: '_id',
};

// 定义 数据库
const DBOpenRequest = window.indexedDB.open(database.name, database.version);
// 保存数据库变量
let db: IDBDatabase;

// 当数据库打开出错/成功时，以下两个事件处理程序将分别对 IDBDatabase 对象进行下一步操作
DBOpenRequest.onerror = function () {
  console.log('数据库打开出错');
};

DBOpenRequest.onsuccess = function (event: Event) {
  console.log('🚀 ~ file: indexDB.ts ~ line 10 ~ event', event);
  console.log('数据库打开成功');

  // 将打开数据库的结果存储在 db 变量中，该变量将在后面的代码中被频繁使用
  //   db = event!.target!.result;
  db = DBOpenRequest.result;

  // 运行 displayData() 方法，用 IDB 中已经存在的所有待办事项列表数据填充到任务列表中
  //   displayData();
};

// 使用 IDBDatabase.createObjectStore 方法，可创建一个对象存储区
DBOpenRequest.onupgradeneeded = function () {
  let objectStore;

  if (!db.objectStoreNames.contains(database.name)) {
    // 创建表，主键
    objectStore = db.createObjectStore(database.name, { keyPath: database.keyPath });
    // 创建索引 可以让你搜索任意字段
    // 定义 objectStore 将包含哪些数据项
    objectStore.createIndex('type', 'type', { unique: false });
    objectStore.createIndex('createTime', 'createTime', { unique: false });
    objectStore.createIndex('day', 'day', { unique: false });
    objectStore.createIndex('month', 'month', { unique: false });
    objectStore.createIndex('year', 'year', { unique: false });

    objectStore.createIndex('notified', 'notified', { unique: false });
  }

  console.log('<li>Object store created.</li>');
};

/**
 * 添加数据
 */
function addData(data: any) {
  /**
   * Create a new object ready for being inserted into the IDB
   */

  /**
   * open a read/write db transaction, ready for adding the data
   */
  const transaction = db.transaction([database.name], 'readwrite');

  /**
   * report on the success of opening the transaction
   */
  transaction.oncomplete = function (event) {
    console.log('<li>Transaction completed: database modification finished.</li>');
  };

  transaction.onerror = function (event) {
    console.log('<li>Transaction not opened due to error. Duplicate items not allowed.</li>');
  };

  /**
   * create an object store on the transaction
   */
  const objectStore = transaction.objectStore('toDoList');

  /**
   * add our newItem object to the object store
   */
  const objectStoreRequest = objectStore.add(data[0]);

  objectStoreRequest.onsuccess = function (event) {
    /**
     * report the success of our new item going into the database
     * 成功进入数据库的情况
     */
    console.log('<li>New item added to database.</li>');
  };
}

addData([
  {
    taskTitle: 'Walk dog',
    hours: 19,
    minutes: 30,
    day: 24,
    month: 'December',
    year: 2013,
    notified: 'no',
  },
]);
