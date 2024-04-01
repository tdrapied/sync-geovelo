export interface IGeoveloUser {
  id: string;
  username: string;
  email: string;
}

export interface IStravaRefreshTokenResponse {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
}

export interface IStravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date: string;
  start_latlng: Array<number>;
}

export type StravaActivityStreamList = Array<IStravaStreamLatlngItem>;

export type LatLng = [number, number];

export interface IStravaStreamLatlngItem {
  type: "latlng";
  data: LatLng[];
}
