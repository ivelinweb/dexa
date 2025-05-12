export const findAllCreatorsABI = [
  {
    inputs: [],
    name: "findAllCreators",
    outputs: [
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
            internalType: "address payable",
            name: "wallet",
            type: "address",
          },
          {
            internalType: "string",
            name: "pfp",
            type: "string",
          },
          {
            internalType: "string",
            name: "banner",
            type: "string",
          },
          {
            internalType: "string",
            name: "bio",
            type: "string",
          },
          {
            internalType: "string",
            name: "website",
            type: "string",
          },
          {
            internalType: "string",
            name: "dexaURI",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedAt",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "friends",
            type: "address[]",
          },
        ],
        internalType: "struct Creator[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];