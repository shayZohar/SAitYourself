/**
 * image files interface
 */

export interface IImageFile {
  id: string;
  fileOwner: string;
  fileName: string;
}
export const emptyImageFile = (): IImageFile => ({
  fileOwner: "",
  fileName: "",
  id: "",
});
