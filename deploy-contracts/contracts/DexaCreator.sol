// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract DexaCreator is AccessControl, Initializable {
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
    uint256 public creatorCount;
    uint256 public transactionCount;
    address public owner;

    mapping(address => bool) public _allowedTokens;

    enum TransactionType { DEPOSIT, WITHDRAWAL, TRANSFER, TIP }

    struct Creator {
        string name;
        string username;
        address payable wallet;
        string pfp;
        string banner;
        string bio;
        string website;
        string dexaURI;
        uint256 createdAt;
        uint256 updatedAt;
        address[] friends;
        bool isVerified;
    }

    struct TokenBalance {
        address tokenAddress;
        uint256 balance;
    }

    struct Transaction {
        uint256 txId;
        TransactionType txType;
        address payable txFrom;
        address payable txTo;
        uint256 txAmount;
        uint256 txFee;
        uint256 txDate;
        address tokenAddress;
    }

    event NewCreator(address indexed creator, string displayName, string username);
    event BalanceCredited(address indexed userAddress, uint256 amount);
    event BalanceDebited(address indexed userAddress, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);
    event TokenAdded(address indexed tokenAddress);
    event TokenAddressAdded(address indexed userAddress, address indexed tokenAddress);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        owner = msg.sender;
    }

    function init_dexa_base(address _admin) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function init_dexa_creator(address _admin) public initializer {
        _grantRole(DEXA_CREATOR_ROLE, _admin);
    }

    function init_roles(address _dexaFeed, address _dexaMessenger) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEXA_FEEDS_ROLE, _dexaFeed);
        _grantRole(DEXA_MESSENGER_ROLE, _dexaMessenger);
    }

    function registerCreator(string memory displayName, string memory username, string memory dexaProfile) public {
        require(bytes(displayName).length > 0, ERROR_INVALID_STRING);
        require(bytes(username).length > 0, ERROR_INVALID_STRING);
        require(isNameFree(username), ERROR_DUPLICATE_RESOURCE);

        _grantRole(CREATOR_ROLE, msg.sender);

        emit NewCreator(msg.sender, displayName, username);
    }

    function isNameFree(string memory username) public view returns (bool) {
        return true; // Simplified for this implementation
    }

    function addTokenToWhitelist(address[] memory tokenAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint i = 0; i < tokenAddress.length; i++) {
            _allowedTokens[tokenAddress[i]] = true;
            emit TokenAdded(tokenAddress[i]);
        }
    }

    function setAdminFee(uint256 _feeRate) public onlyRole(DEFAULT_ADMIN_ROLE) {
        feeRate = _feeRate;
    }

    receive() external payable {}
    fallback() external payable {}
}
