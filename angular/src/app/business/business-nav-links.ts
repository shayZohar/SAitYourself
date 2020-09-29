import { INavLinks } from '@/shared/interfaces/inav-links';


/**
 * nav-bar links of business module
 */
export const businessNavLinksList: INavLinks[] = [

  {
    label: 'Home',
    route: ['/business/home'],
    tip: 'business home',
    icon: 'home',
  },
  {
    label: 'About',
    route: ['/business/about'],
    icon: 'question_answer',
  },
  {
    label: 'Contact',
    route: ['/business/contact'],
    tip: 'contact business',
    icon: 'contact_mail',
  },
  {
    label: 'Appointments',
    route: ['/business/appointment'],
    icon: 'meeting_room',
  },
  {
    label: 'Sign-Up',
    route: ['/business/registration'],
    tip: 'sign-up to business',
    icon: 'how_to_reg',
  },
];
