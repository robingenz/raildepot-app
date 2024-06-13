export type File = NativeFile | WebFile;

export interface NativeFile {
  type: 'native';
  path: string;
}

export interface WebFile {
  type: 'web';
  blob: Blob;
}
