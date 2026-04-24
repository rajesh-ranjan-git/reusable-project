export type OAuthPayloadType = {
  status: string;
  message: string;
  data: {
    user: any;
    accessToken: string;
    expiresIn: number;
  };
};

export type OptionsType = {
  redirectTo?: string;
  onSuccess?: (data: OAuthPayloadType) => void;
  onError?: (error: any) => void;
};
