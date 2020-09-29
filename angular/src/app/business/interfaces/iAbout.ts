/**
 * interface of business-about page content
 */
export interface IAbout {
  headerText?: string;
  subHeaderText?: string;
  articalText?: string;
  addressText?: string;
}


export const defaultAboutVal = (): IAbout => ({
  headerText: 'Write here your header. You can use line breaks\nhere is the first break.',
  subHeaderText: 'Write your sub-header here',
  articalText: 'Write about your business you would like to see here.\n\n',
  addressText: 'Write your location or any other information.'
});

export const emptyAbout = (): IAbout => ({
  headerText: '',
  subHeaderText: '',
  articalText: '',
  addressText: ''
});
