// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./DexaCreator.sol";

contract DexaMessenger is AccessControl, Initializable {
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

    DexaCreator public dexaCreator;

    constructor(address payable _dexaCreator) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        dexaCreator = DexaCreator(_dexaCreator);
    }
}
