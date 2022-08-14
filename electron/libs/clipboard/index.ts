// const { clipboard, NativeImage } = require('electron');
import { clipboard, NativeImage, ipcRenderer, contextBridge } from 'electron';

interface Options {
  duration?: number;
  textChange?: (text: string, beforeText: string) => void;
  imageChange?: (image: NativeImage, beforeImage: NativeImage) => void;
}

class ClipboardObserver {
  timer: NodeJS.Timeout;
  beforeText: string;
  beforeImage: NativeImage;

  duration = 500;
  textChange: (text: string, beforeText: string) => void;
  imageChange: (image: NativeImage, beforeImage: NativeImage) => void;

  constructor(options: Options) {
    console.log(
      '🚀 ~ file: index.ts ~ line 20 ~ ClipboardObserver ~ constructor ~ options',
      options
    );
    const { duration, textChange, imageChange } = options;

    this.duration = duration;
    this.textChange = textChange;
    this.imageChange = imageChange;

    if (this.textChange || this.imageChange) {
      this.start();
    }
  }

  /**
   * 设置定时器
   */
  setTimer(): void {
    this.timer = setInterval(() => {
      if (this.textChange) {
        const text = clipboard.readText();
        console.log('=====', text, this.beforeText);
        if (this.isDiffText(this.beforeText, text)) {
          console.log('2=====2', text, this.beforeText);
          this.textChange(text, this.beforeText);
          this.beforeText = text;
          ipcRenderer.send('counter-value', text);
        }
      }

      // if (this.textChange) {
      //   console.log('=---');
      //   const text = clipboard.readText();
      //   console.log('=====', text, this.beforeText);
      //   if (this.isDiffText(this.beforeText, text)) {
      //     console.log('=====asdsasdas');
      //     //   contextBridge.exposeInMainWorld('electronAPI', {
      //     //     setTitle: (title) => ipcRenderer.send('set-title', title),
      //     //   });

      //     console.log('=');
      //     console.log(text);
      //     this.textChange(text, this.beforeText);
      //     this.beforeText = text;
      //   }
      // }

      if (this.imageChange) {
        const image = clipboard.readImage();
        if (this.isDiffImage(this.beforeImage, image)) {
          this.imageChange(image, this.beforeImage);
          this.beforeImage = image;
        }
      }
    }, this.duration);
  }

  /**
   * 清除定时器
   */
  clearTimer(): void {
    clearInterval(this.timer);
  }

  /**
   * 设置剪贴板默认内容
   */
  setClipboardDefaultValue(): void {
    console.log(clipboard.readText());
    if (this.textChange) {
      this.beforeText = clipboard.readText();
    }
    if (this.imageChange) {
      this.beforeImage = clipboard.readImage();
    }
  }

  /**
   * 判断内容是否不一致
   * @param beforeText
   * @param afterText
   * @returns
   */
  isDiffText(beforeText: string, afterText: string): boolean {
    return !!(afterText && beforeText !== afterText);
  }

  /**
   * 判断图片是否不一致
   * @param beforeImage
   * @param afterImage
   * @returns
   */
  isDiffImage(beforeImage: NativeImage, afterImage: NativeImage): boolean {
    return (
      afterImage && !afterImage.isEmpty() && beforeImage.toDataURL() !== afterImage.toDataURL()
    );
  }

  /**
   * 开始
   */
  start(): void {
    console.log('ial Vue + Vite star213131231231212=================');

    this.setClipboardDefaultValue();
    this.setTimer();
  }

  /**
   * 暂停
   */
  stop(): void {
    this.clearTimer();
  }
}

export default ClipboardObserver;
