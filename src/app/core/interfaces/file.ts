export interface File {
  /**
   * The file as a Blob.
   *
   * Only available on Web.
   */
  readonly blob?: Blob;
  /**
   * The unique identifier of the file.
   *
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  readonly id?: string;
  /**
   * Whether or not the file is marked as deleted.
   *
   * @default false
   */
  isDeleted?: boolean;
  /**
   * The name of the file.
   *
   * @example 'my-picture.jpg'
   */
  readonly name: string;
  /**
   * The uri to the file in the local filesystem.
   *
   * Only available on Android and iOS.
   *
   * @example '/var/mobile/Containers/Data/Application/.../tmp/capacitor/path/to/my-picture.jpg'
   */
  readonly path?: string;
}
