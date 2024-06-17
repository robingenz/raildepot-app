export interface File {
  /**
   * The uri to the file in the local filesystem.
   *
   * Only available on Android and iOS.
   *
   * @example '/var/mobile/Containers/Data/Application/.../tmp/capacitor/path/to/my-picture.jpg'
   */
  readonly uri?: string;
  /**
   * The file as a Blob.
   *
   * Only available on Web.
   */
  readonly blob?: Blob;
}
