/**
 * interface of business-appointment object
 */
export interface IAppointment {
  id: number;
  bName: string;
  appointmentList: object[];
  counter: number;
  days: number[];
  start: number;
  end: number;

}

export const emptyAppointment = (): IAppointment => ({
  id: null,
  bName: '',
  appointmentList: [],
  counter: 0,
  days: [],
  start: 0,
  end: 0
});
