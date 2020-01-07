import { defaultAboutVal, IAbout, emptyAbout } from './iAbout';

import { defaultHomeVal, Ihome, emptyHome } from '@/business/interfaces/ihome';

export interface IBusiness {
  // AMIT ALL ARE PREMISION
  id?: string;
  bName?: string;
  bMail?: string;
  bOwner?: string[];
  bClient?: string[];
  bType?: string;
  // AMIT
  bHome?: Ihome;
  bAbout?: IAbout;
}
export const emptyBusiness = (): IBusiness => ({
  id: '',
  bName: '',
  bMail: '',
  bOwner: [''],
  // AMIT
  bClient: [''],
  bType: '',
  // AMIT
  bHome: defaultHomeVal(),
  bAbout: defaultAboutVal(),
});

// AMIT ASK TANIA not to much work? mybe a class is better
export const updateHome = (): IBusiness => ({
  bMail: '',
  bHome: emptyHome(),
});

export const updateAbout = (): IBusiness => ({
  bMail: '',
  bAbout: emptyAbout(),
});
