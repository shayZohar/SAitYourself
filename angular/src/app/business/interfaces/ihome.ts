export interface Ihome {
  headerText?: string;
  subHeaderText?: string;
  articalText?: string;
}

export const defaultHomeVal = (): Ihome => ({
  headerText: 'write here your header. you can use line breaks\nhere the first break',
  subHeaderText: 'enter your sub header here\n\n\n',
  articalText: 'write a few words on the above header'
});

export const emptyHome = (): Ihome => ({
  headerText: '',
  subHeaderText: '',
  articalText: ''
});
