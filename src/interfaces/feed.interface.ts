import { VisibilityType } from "@bnb-chain/greenfield-js-sdk";
import { UserInterface } from "./user.interface";

export interface MediaType {
  url: string;
  type: string;
}

export interface Post {
  id: string;
  author: string;
  tokenId: string;
  creator: UserInterface;
  content: string;
  createdAt: string;
  updatedAt: string;
  remintPrice: string;
  remintCount: string;
  tipCount: string;
  remintToken: string;
  media: MediaType[];
  isReminted: boolean;
  remintedPost: string;
  remintedBy: string[];
  likedBy: string[];
  parentId: number;
  commentCount: number;
  isMintable: boolean;
}

export interface CreatePost {
  content: string;
  visibility: VisibilityType;
  bucketName: string;
}

type Props = {
  width?: string;
  height?: string;
};

export interface Coin {
  id: string;
  symbol: string;
  icon: ({ width, height }: Props) => React.JSX.Element;
  address: string;
  name: string;
}
