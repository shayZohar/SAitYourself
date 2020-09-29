/**
 * message interface
 */
export interface IMessage {
  senderId: string;
  recieverId: string;
  subJect: string;
  messContent: string;
  read: boolean;
  date: string;
  id: string;
}

export const emptyMessage = (): IMessage => ({
  senderId: '',
  recieverId: '',
  subJect: '',
  messContent: '',
  read: false,
  date: '',
  id: ''
});
