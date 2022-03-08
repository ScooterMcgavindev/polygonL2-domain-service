// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
    // map domain string to wallet address to store domain names
    mapping(string => address) public domains;

    // map to store records
    mapping(string => string) public records;

    constructor() {
        console.log("THIS IS MY DOMAINS CONTRACT. HELLA.");
    }
    //Tado: add function people can hit and register domain name with a place to store names
    // register names to add to mapping, msg.sender's address is that who called the func
    function register(string calldata name) public {
        // checks address of domain to register is same as the zero address.
        require(domains[name] == address(0));
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