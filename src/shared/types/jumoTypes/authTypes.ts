export interface jumioAuthPayload {
  grant_type: 'client_credentials';
}

export interface jumioAuthSuccessResponse {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
}
