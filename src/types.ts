export interface Message {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  date: number;
  messages: Message[];
}
