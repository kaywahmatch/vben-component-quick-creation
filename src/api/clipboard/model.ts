export interface IClipboardList {
  type?: 'text' | 'image';
  createTime?: string;
  _id?: string;
  content?: string;
  category?: string;
}

export interface ICategory extends IClipboardList {
  categoryId: string;
}

export interface IAddCategory {
  createTime?: string;
  _id?: string;
  name?: string;
  sort?: string;
}

export interface IIndexDBResponse {
  code: number;
  msg: string;
  data: any | unknown;
}
