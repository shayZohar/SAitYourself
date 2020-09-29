/**
 * nav-bar for home module
 */
import { INavLinks } from '@/shared/interfaces/inav-links';
export const navLinksList: INavLinks[] = [

  {
    label: 'Home',
    route: ['/home'],
    icon: 'home',
  },

  {
    label: 'Contact',
    route: ['/contact'],
    icon: 'contact_mail',
  },
  {
    label: 'Login',
    route: ['/registration'],
  },

];
