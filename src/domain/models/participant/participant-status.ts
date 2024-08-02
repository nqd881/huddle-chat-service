import { Enum, EnumBase } from 'ddd-node';

export class ParticipantStatus extends EnumBase {
  @Enum()
  static Pending: ParticipantStatus;

  @Enum()
  static Active: ParticipantStatus;

  @Enum()
  static Inactive: ParticipantStatus;

  isPending() {
    return this === ParticipantStatus.Pending;
  }

  isActive() {
    return this === ParticipantStatus.Active;
  }

  isInactive() {
    return this === ParticipantStatus.Inactive;
  }
}
