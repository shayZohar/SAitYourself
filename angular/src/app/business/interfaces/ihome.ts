/**
 * interface of business-home page content
 */
export interface Ihome {
  headerText?: string;
  subHeaderText?: string;
  articalText?: string;
}


export const defaultHomeVal = (): Ihome => ({
  headerText: 'Write here your header. You can use line breaks\nhere is the first break.',
  subHeaderText: 'Write your sub-header here.',
  articalText: 'Write any content you would like to see here.'
});

export const emptyHome = (): Ihome => ({
  headerText: '',
  subHeaderText: '',
  articalText: ''
});
