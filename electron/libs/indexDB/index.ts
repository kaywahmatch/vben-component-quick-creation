import { IClipboardList } from '../../../src/api/clipboard/model';

/**
 * indexDB
 */
const _window = window;
class IndexDB {
  database = {
    // 名称
    name: 'clipboard',
    // 版本
    version: 1,
    // 主键
    keyPath: '_id',
  };

  // 保存数据库变量
  db!: IDBDatabase;

  global: Window | undefined = _window;

  constructor(global?: Window) {
    console.log(
      '🚀 ~ file: index.ts ~ line 20 ~ ClipboardObserver ~ constructor ~ options',
      this.database
    );
    this.global = global;
  }

  init() {
    // 定义 数据库
    const DBOpenRequest = _window.indexedDB.open(this.database.name, this.database.version);
    console.log('🚀 ~ file: index.ts ~ line 31 ~ IndexDB ~ init ~ init 初始化', DBOpenRequest);
    // 保存数据库变量

    // 当数据库打开出错/成功时，以下两个事件处理程序将分别对 IDBDatabase 对象进行下一步操作
    DBOpenRequest.onerror = function () {
      console.log('数据库打开出错');
    };

    DBOpenRequest.onsuccess = (event: Event) => {
      console.log('数据库打开成功');
      // 将打开数据库的结果存储在 db 变量中，该变量将在后面的代码中被频繁使用
      this.db = DBOpenRequest.result;
      // 运行 displayData() 方法，用 IDB 中已经存在的所有待办事项列表数据填充到任务列表中
      //   displayData();
    };

    // 使用 IDBDatabase.createObjectStore 方法，可创建一个对象存储区
    // 当试图打开一个尚未被创建的数据库，或者试图连接一个数据库还没被创立的版本时，onupgradeneeded 事件会被触发
    DBOpenRequest.onupgradeneeded = (event) => {
      this.db = DBOpenRequest.result;
      let objectStore;

      if (this.db && !this.db?.objectStoreNames.contains(this.database.name)) {
        // 创建表，主键
        console.log(
          '🚀 ~ file: index.ts ~ line 62 ~ IndexDB ~ init ~ 创建表，主键',
          '创建表，主键'
        );
        objectStore = this.db.createObjectStore(this.database.name, {
          keyPath: this.database.keyPath,
        });
        // 创建索引 可以让你搜索任意字段
        // 定义 objectStore 将包含哪些数据项
        objectStore.createIndex('type', 'type', { unique: false });
        objectStore.createIndex('createTime', 'createTime', { unique: false });
        objectStore.createIndex('content', 'content', { unique: false });
      }

      console.log('Object store created.');
    };
  }
  /**
   * 添加数据
   */
  addData(data: IClipboardList[]) {
    /**
     * Create a new object ready for being inserted into the IDB
     */

    /**
     * open a read/write db transaction, ready for adding the data
     */
    const transaction = this.db.transaction([this.database.name], 'readwrite');

    /**
     * report on the success of opening the transaction
     */
    transaction.oncomplete = function (event) {
      console.log('Transaction completed: database modification finished.');
    };

    transaction.onerror = function (event) {
      console.log('Transaction not opened due to error. Duplicate items not allowed.');
    };

    /**
     * create an object store on the transaction
     */
    const objectStore = transaction.objectStore(this.database.name);

    /**
     * add our newItem object to the object store
     */
    const objectStoreRequest = objectStore.add(data[0]);

    objectStoreRequest.onsuccess = function (event) {
      /**
       * report the success of our new item going into the database
       * 成功进入数据库的情况
       */
      console.log('New item added to this.database.');
    };
  }
  /**
   * 获取数据
   */
  getData() {
    const list: Array<any> = [];

    const store = this.db
      .transaction(this.database.name, 'readwrite') // 事务
      .objectStore(this.database.name); // 仓库对象

    // 指针对象，倒序返回
    const request = store.openCursor(IDBKeyRange.upperBound(this.database.keyPath, true), 'prev');
    return new Promise((resolve, reject) => {
      request.onsuccess = function (e: any) {
        const cursor = e.target!.result;
        if (cursor) {
          // 必须要检查
          list.push(cursor.value);
          cursor.continue(); // 遍历了存储对象中的所有内容
        } else {
          resolve(list);
        }
      };
      request.onerror = function (err: any) {
        reject(err);
      };
    });
  }
  /**
   * 删除数据
   */
  deleteData(id: string | number) {
    const request = this.db
      .transaction([this.database.name], 'readwrite')
      .objectStore(this.database.name)
      .delete(id);

    request.onsuccess = function () {
      console.log('数据删除成功');
    };

    request.onerror = function () {
      console.log('数据删除失败');
    };
  }
  /**
   * 查询数据
   */
  queryData(queryData: string) {
    const storeName = this.database.name;
    let list: Array<any> = [];

    const store = this.db
      .transaction(storeName, 'readwrite') // 事务
      .objectStore(storeName); // 仓库对象

    // 指针对象，倒序返回
    const request = store.openCursor(IDBKeyRange.upperBound(this.database.keyPath, true), 'prev');
    return new Promise((resolve, reject) => {
      request.onsuccess = function (e: any) {
        const cursor = e.target!.result;
        if (cursor) {
          // 必须要检查
          list.push(cursor.value);
          cursor.continue(); // 遍历了存储对象中的所有内容
        } else {
          list = list
            .map((item) => {
              return item.content.indexOf(queryData) >= 0 && item;
            })
            .filter(Boolean);
          resolve(list);
        }
      };
      request.onerror = function (err: any) {
        reject(err);
      };
    });
  }
  // queryData(queryData: string) {
  //   const storeName = this.database.name;
  //   const db = this.db;
  //   console.log('🚀 ~ file: index.ts ~ line 165 ~ IndexDB ~ queryData ~ queryData', queryData);
  //   const transaction = db.transaction([storeName], 'readwrite'); // 事务

  //   const objectStore = transaction.objectStore(storeName).index('content'); // 仓库对象
  //   const request = objectStore.get(queryData);

  //   return new Promise((resolve, reject) => {
  //     request.onerror = function (event) {
  //       console.log('事务失败');
  //       reject(event);
  //     };

  //     request.onsuccess = function (event) {
  //       console.log('主键查询结果: ', [request.result]);
  //       resolve(request.result ? [request.result] : []);
  //     };
  //   });

  //   return request.result;
  // }
}

export default IndexDB;
