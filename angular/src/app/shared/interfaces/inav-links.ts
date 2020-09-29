/**
 * nav bar links interface
 */

export interface INavLinks {
  label: string;
  route: string[];
  icon?: string;
  tip?: string;
}

export const newLink = (): INavLinks => ({
  label: '',
  route: ['']
});
