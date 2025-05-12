export const getAllFeedsABI = [
  {
    inputs: [],
    name: "listAllPosts",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "address payable",
            name: "author",
            type: "address",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "remintPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "remintCount",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "remintedBy",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "remintToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tipCount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "string",
                name: "url",
                type: "string",
              },
              {
                internalType: "string",
                name: "mimetype",
                type: "string",
              },
            ],
            internalType: "struct Media[]",
            name: "media",
            type: "tuple[]",
          },
          {
            internalType: "string",
            name: "metadataURI",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "username",
                type: "string",
              },
              {
                internalType: "string",
                name: "pfp",
                type: "string",
              },
            ],
            internalType: "struct PostCreator",
            name: "creator",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "isReminted",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "remintedPost",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "likedBy",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "parentId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "commentCount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isMintable",
            type: "bool",
          },
        ],
        internalType: "struct Post[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];