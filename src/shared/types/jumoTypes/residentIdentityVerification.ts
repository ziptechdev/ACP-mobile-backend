export interface ResidentIdentityVerificationBody {
  idImages: {
    [key: string]: string;
    front: any;
    back: any;
    face: any;
  };

  username: string;
  userIp: string;
  userState: string;
  consentOptained: 'yes' | 'no' | 'na';
  consentOptainedAt: string;
}
