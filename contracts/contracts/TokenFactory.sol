// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenFactory {
    event TokenCreated(address indexed tokenAddress, string name, string symbol);

    struct TokenInfo {
        string name;
        string symbol;
        uint256 totalSupply;
        address creator;
    }

    mapping(address => TokenInfo) public tokens;

    function createToken(
        string memory _name, 
        string memory _symbol, 
        uint256 _totalSupply
    ) public returns (address) {
        // In a real implementation, this would deploy a new token contract
        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(_name, _symbol, block.timestamp)))));
        
        tokens[tokenAddress] = TokenInfo({
            name: _name,
            symbol: _symbol,
            totalSupply: _totalSupply,
            creator: msg.sender
        });

        emit TokenCreated(tokenAddress, _name, _symbol);
        return tokenAddress;
    }
}
