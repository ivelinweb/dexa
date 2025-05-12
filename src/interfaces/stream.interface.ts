import { FriendListInterface } from "./user.interface";

export interface IStreamCredentials {
  ingressId: string;
  serverUrl: string;
  streamKey: string;
}

export interface IStreamViewerCredentials {
  name: string;
  token: string;
  identity: string;
}

export interface LiveUser {
  creator: string;
  isLive: boolean;
}
