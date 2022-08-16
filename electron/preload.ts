import ClipboardObserver from './libs/clipboard';
import IndexDB from './libs/indexDB';

const { contextBridge, ipcRenderer } = require('electron');

const indexDB = new IndexDB(window);
indexDB.init();

new ClipboardObserver({
  textChange: (text: string, beforeText: string) => {
    //  处理文本变化的逻辑
    ipcRenderer.send('update-counter', text);
    indexDB.addData([
      {
        createTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        _id: new Date().getTime().toString(),
        type: 'text',
        content: text,
      },
    ]);
  },
  imageChange: (image: Electron.NativeImage, beforeText: Electron.NativeImage) => {
    //  处理图片变化的逻辑
    ipcRenderer.send('update-counter', image);
    indexDB.addData([
      {
        createTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        _id: new Date().getTime().toString(),
        type: 'image',
        content: image.toDataURL(),
      },
    ]);
  },
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string | undefined) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text!;
  };

  ipcRenderer.on('update-counter', (_event, value) => {
    console.log('🚀 ~ file: preload.ts ~ line 26 ~ ipcRenderer.on ~ _event, value', _event, value);
  });

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

function updateCounter(a: any) {
  console.log('🚀 ~ file: preload.ts ~ line 52 ~ updateCounter ~ a', a);

  // ipcRenderer.send('update-counter', a);
  ipcRenderer.send('update-counter', a);
}

/**
 * 发送通知
 * */

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (a: any) => {
    return updateCounter(a);
  },
});
