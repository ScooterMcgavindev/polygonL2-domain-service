// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;
import { StringUtils } from './libraries/StringUtils.sol';

import "hardhat/console.sol";

contract Domains {
    // Top-level-domain TLD
    string public tld;

    mapping(string => address) public domains; // map domain string to wallet address to store domain names
    mapping(string => string) public records; // map to store records

    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("THIS IS MY DOMAINS CONTRACT. HELLA.");
    }

    // function gives the price od domain based on length
    function price(string calldata name) public pure returns(uint) {
        uint length = StringUtils.strlen(name);
        require(length > 0);
        if (length == 3) {
            return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic
        } else if (length == 4) {
            return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
        } else {
            return 1 * 10**17;
        }
    }
    //Tado: add function people can hit and register domain name with a place to store names
    // register names to add to mapping, msg.sender's address is that who called the func
    function register(string calldata name) public payable{
        // checks address of domain to register is same as the zero address.
        require(domains[name] == address(0));
        uint _price = price(name);
        // Check if enough Matic was paid in the transaction
        require(msg.value >= _price, "Not enough Matic paid");
        
        domains[name] = msg.sender;
        console.log("%s has registered a domain", msg.sender);
    }
    // returns domain ownders address
    // calldata: indicates the location of where the name arg is stored
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    // set record
    function setRecord(string calldata name, string calldata record) public {
        // checks owner is the tx sender 
        require(domains[name] == msg.sender);
        records[name] = record;
    }
    function getRecord(string calldata name) public view returns(string memory) {
        return records[name];
    }
}