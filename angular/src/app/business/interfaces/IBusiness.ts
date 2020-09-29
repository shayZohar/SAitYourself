/**
 * interface of business object
 */
import { defaultAboutVal, IAbout, emptyAbout } from "./iAbout";

import { defaultHomeVal, Ihome, emptyHome } from "@/business/interfaces/ihome";

export interface IBusiness {
  id?: string;
  bName: string;
  bMail?: string;
  bOwner?: string[];
  bClient?: string[];
  bGallery?: boolean;
  bAppointment?: boolean;
  bHome?: Ihome;
  bAbout?: IAbout;
  ownerConnected?: boolean;
}
export const emptyBusiness = (): IBusiness => ({
  id: "",
  bName: "",
  bMail: "",
  bOwner: [],
  bClient: [""],
  bGallery: true,
  bAppointment: true,
  bHome: defaultHomeVal(),
  bAbout: defaultAboutVal(),
  ownerConnected: false,
});

export const updateHome = (): IBusiness => ({
  bName: "",

  bHome: emptyHome(),
});

export const updateAbout = (): IBusiness => ({
  bName: "",

  bAbout: emptyAbout(),
});
