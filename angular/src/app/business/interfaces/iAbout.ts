export interface IAbout {
  headerText?: string;
  subHeaderText?: string;
  articalText?: string;
  addressText?: string;
}

export const defaultAboutVal = (): IAbout => ({
  headerText: 'write here your About page header. you can use line breaks\nhere the first break',
  subHeaderText: 'enter your sub header here\n\n\n',
  articalText: 'write somethig aboutyour business\n\n',
  addressText: 'Write your business address'
});

export const emptyAbout = (): IAbout => ({
  headerText: '',
  subHeaderText: '',
  articalText: '',
  addressText: ''
});
