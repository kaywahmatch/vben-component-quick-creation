import { IAddCategory, ICategory, IIndexDBResponse } from '../../../src/api/clipboard/model';

/**
 * indexDB
 */
const _window = window;
class IndexDB {
  database = {
    // 名称
    name: 'category',
    // 版本
    version: 1,
    // 主键
    keyPath: '_id',
  };

  // 保存数据库变量
  db!: IDBDatabase;

  global: Window | undefined = _window;

  constructor(global?: Window) {
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
      console.log(this.db);
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
        objectStore.createIndex('name', 'type', { unique: false });
        objectStore.createIndex('createTime', 'createTime', { unique: false });
        objectStore.createIndex('sort', 'content', { unique: false });
      }

      console.log('Object store created.');
    };
  }
  /**
   * 添加数据
   */
  addData(data: IAddCategory[]): Promise<IIndexDBResponse> {
    return new Promise((resolve, reject) => {
      /**
       * Create a new object ready for being inserted into the IDB
       */

      console.log(this.db, data);

      /**
       * open a read/write db transaction, ready for adding the data
       */
      const transaction = this.db.transaction([this.database.name], 'readwrite');
      console.log(transaction);

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
        // return {
        //   type: 'success',
        // };
        resolve({
          code: 1,
          data: null,
          msg: '操作成功',
        });
      };

      objectStoreRequest.onerror = function () {
        reject({
          code: 0,
          data: null,
          msg: '操作失败',
        });
      };
      // return {
      //   type: 'success',
      // };
    });
  }
  /**
   * 修改数据
   */
  updateData(data: IAddCategory) {
    console.log(data);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.database.name], 'readwrite');
      const objectStore = transaction.objectStore(this.database.name);

      const request = objectStore.get(data._id!);

      request.onerror = function (event) {
        // 错误处理
        reject({
          code: 0,
          data: null,
          msg: '操作失败',
        });
      };

      request.onsuccess = function (event) {
        console.log(event);
        // 获取我们想要更新的数据
        const getData = event.target.result as IAddCategory;
        // // 更新你想修改的数据
        getData.sort = data.sort;
        getData.name = data.name;

        console.log(getData);

        // 把更新过的对象放回数据库
        const requestUpdate = objectStore.put(getData);

        requestUpdate.onerror = function (event) {
          reject({
            code: 0,
            data: null,
            msg: '操作失败',
          });
          // 错误处理
        };

        requestUpdate.onsuccess = function (event) {
          // 完成，数据已更新！
          resolve({
            code: 1,
            data: null,
            msg: '操作成功',
          });
        };
      };
      // 创建一个事务
    });
  }
  /**
   * 获取数据
   */
  getData(): Promise<ICategory[]> {
    const list: Array<ICategory> = [];

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
  deleteData(id: string | number): Promise<IIndexDBResponse> {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([this.database.name], 'readwrite')
        .objectStore(this.database.name)
        .delete(id);

      request.onsuccess = function () {
        console.log('数据删除成功');
        resolve({
          code: 1,
          data: null,
          msg: '操作成功',
        });
      };

      request.onerror = function () {
        console.log('数据删除失败');
        reject({
          code: 0,
          data: null,
          msg: '操作失败',
        });
      };
    });
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
              return item.name.indexOf(queryData) >= 0 && item;
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
}

export default IndexDB;
