import ClipboardObserver from './libs/clipboard';

const { contextBridge, ipcRenderer, clipboard } = require('electron');

const clipboardObserver = new ClipboardObserver({
  textChange: (text: string, beforeText: string) => {
    //  处理文本变化的逻辑
    console.log('inquire', text, beforeText, ipcRenderer.on, ipcRenderer.send);
    ipcRenderer.send('update-counter', text);
  },
  imageChange: (image: Electron.NativeImage, beforeText: Electron.NativeImage) => {
    //  处理图片变化的逻辑
  },
});
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  ipcRenderer.on('update-counter', (_event, value) => {
    console.log('🚀 ~ file: preload.ts ~ line 26 ~ ipcRenderer.on ~ _event, value', _event, value);
  });

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

/**
 * 写入文件
 * */
function handleWriteLoginInfo() {
  const text = clipboard.readText();
  console.log(text);
  console.log(ClipboardObserver);
  clipboardObserver.start();

  return ClipboardObserver;
}

function updateCounter(a) {
  console.log('🚀 ~ file: preload.ts ~ line 52 ~ updateCounter ~ a', a);

  // ipcRenderer.send('update-counter', a);
  ipcRenderer.send('update-counter', a);
}

/**
 * 发送通知
 * */

contextBridge.exposeInMainWorld('electronAPI', {
  writeLogin: () => {
    return handleWriteLoginInfo();
  },
  // onUpdateCounter: (callback: any) => ipcRenderer.on('update-counter', callback),
  onUpdateCounter: (a) => {
    return updateCounter(a);
  },
});
