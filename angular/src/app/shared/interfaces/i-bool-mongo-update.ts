/**
 * boolean fileds interface
 */

export interface IBoolMongoUpdate {
  valueToUpdate: boolean;
  keyToUpdate: string;
  mongoField: string;
}

export const newBoolUpdate = (value= false , key= '' , field= ''): IBoolMongoUpdate => ({
  valueToUpdate: value,
  keyToUpdate: key,
  mongoField: field
});
