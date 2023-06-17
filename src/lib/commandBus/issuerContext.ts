export type IssuerContext =
  | {
      issuer: 'cron';
      correlationId: string;
      date: string;
    }
  | {
      issuer: 'thing';
      id: string;
      correlationId: string;
      date: string;
    };
