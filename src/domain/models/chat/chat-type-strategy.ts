import { ChatType } from './chat-type';

export interface ChatTypeStrategy {
  strategyForType(): ChatType;
}
