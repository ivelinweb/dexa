import { VisibilityType } from "@bnb-chain/greenfield-js-sdk";

export enum GnfVisibility {
  "VISIBILITY_TYPE_PUBLIC_READ" = "1",
  "VISIBILITY_TYPE_PRIVATE" = "0",
}
// export type GnfVisibility =
//   | "VISIBILITY_TYPE_PUBLIC_READ"
//   | "VISIBILITY_TYPE_UNSPECIFIED"
//   | "VISIBILITY_TYPE_PRIVATE"
//   | "VISIBILITY_TYPE_INHERIT"
//   | "UNRECOGNIZED";

export type GnfRedunancyType =
  | "REDUNDANCY_EC_TYPE"
  | "REDUNDANCY_REPLICA_TYPE"
  | "UNRECOGNIZED";

export interface CreateBucket {
  name: string;
  visibility: VisibilityType;
  creator: string;
  paymentAddress: string;
}

export interface CreateObject {
  bucketName: string;
  fileName: string;
  visibility: GnfVisibility;
  contentType: any;
  redundancyType: GnfRedunancyType;
  contentLength: any;
  expectCheckSums: string[];
}

export interface UploadObject {
  bucketName: string;
  fileName: string;
  file: File;
  txHash: string;
}

export interface StoreBucket {
  name: string;
  address: string;
  isDefault?: boolean;
}
