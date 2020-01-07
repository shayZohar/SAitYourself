import { PersonalZoneComponent } from './../user/components/personal-zone/personal-zone.component';
import { logging } from 'protractor';
import { INavLinks } from '@/shared/interfaces/inav-links';

// change to big letter
export const navLinksList: INavLinks[] = [

    {
      label: 'Home',
      route: ['/home'],
    },

    {
      label: 'Contact',
      route: ['/contact'],
    },
    {
      label: 'Personal Zone',
      route: ['/personal']
    },
    {
      label: 'Login',
      route: ['/registration/login'],
    },


];
