export enum StorageTypes {
  ACCESS_TOKEN = "dexa.access-token",
  IS_WELCOME = "dexa.welcome",
  AUTH_USER = "dexa.auth_user",
  REFERRER = "dexa.referrer",
  NEXT_SESSION_TOKEN = "next-auth.session-token",
  DEXA_HIDE_BAL = "dexa.hide.balance",
}

export enum QueryKeys {
  AUTH = "AUTH",
  WALLET = "WALLET",
  PROFILE = "PROFILE",
  STREAM_AUTH = "STREAM_AUTH",
  BOOKMARK = "BOOKMARK",
  BOOKMARKS = "BOOKMARKS",
  COMMENTS = "COMMENTS",
}

export enum BucketVisibilityType {
  Unspecified = 0,
  PublicRead = 1,
  Private,
  Inherit,
}

export enum EventTypes {
  HELLO = "HELLO",
}

export enum ContractError {
  ERROR_INVALID_STRING = "Dexa: 0",
  ERROR_UNAUTHORISED_ACCESS = "Dexa: 1",
  ERROR_DUPLICATE_RESOURCE = "Dexa: 2",
  ERROR_NOT_FOUND = "Dexa: 3",
  ERROR_INVALID_PRICE = "Dexa: 4",
  ERROR_PROCESS_FAILED = "Dexa: 5",
}

export enum Path {
  CREATORS = "creators",
  FEEDS = "feeds",
  METADATA = "metadata",
  TIP = "tips",
}

export enum IngressInput {
  RTMP_INPUT = 0,
  WHIP_INPUT = 1,
  URL_INPUT = 2,
}
