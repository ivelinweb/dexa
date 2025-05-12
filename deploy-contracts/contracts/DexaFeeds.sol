// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./DexaCreator.sol";
import "./FeedsToken.sol";

contract DexaFeeds is AccessControl, Initializable {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant DEXA_CREATOR_ROLE = keccak256("DEXA_CREATOR_ROLE");
    bytes32 public constant DEXA_FEEDS_ROLE = keccak256("DEXA_FEEDS_ROLE");
    bytes32 public constant DEXA_MESSENGER_ROLE = keccak256("DEXA_MESSENGER_ROLE");
    bytes32 public constant DEXA_STORAGE_ROLE = keccak256("DEXA_STORAGE_ROLE");

    string public constant ERROR_DUPLICATE_RESOURCE = "Resource already exists";
    string public constant ERROR_INVALID_PRICE = "Invalid price";
    string public constant ERROR_INVALID_STRING = "Invalid string";
    string public constant ERROR_NOT_FOUND = "Resource not found";
    string public constant ERROR_PROCESS_FAILED = "Process failed";
    string public constant ERROR_UNAUTHORISED_ACCESS = "Unauthorised access";

    uint256 public feeRate;
    DexaCreator public dexaCreator;
    FeedsToken public feedsToken;

    mapping(address => bool) public _allowedTokens;

    event PostMinted(address indexed creator, uint256 indexed postId, string gnfdId, address remintToken, uint256 remintPrice);
    event Tipped(address indexed from, address indexed to, uint256 amount, uint256 indexed postId, string offChainId, string message, address tippedToken, uint256 tipId);
    event TokenAdded(address indexed tokenAddress);

    constructor(address payable _dexaCreator, address _feedsToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        dexaCreator = DexaCreator(_dexaCreator);
        feedsToken = FeedsToken(_feedsToken);
    }

    function addTokenToWhitelist(address[] memory tokenAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint i = 0; i < tokenAddress.length; i++) {
            _allowedTokens[tokenAddress[i]] = true;
            emit TokenAdded(tokenAddress[i]);
        }
    }

    function commentOnPost(uint256 postId, string memory commentId, string memory content) public {
        require(bytes(commentId).length > 0, ERROR_INVALID_STRING);
        require(bytes(content).length > 0, ERROR_INVALID_STRING);
        // Implementation simplified
    }
}
