// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract ExeedMeNFT is ERC721, ERC721URIStorage, Ownable 
{ 
    uint256 private _nextTokenId; 
    uint256 public tokenIdCounter;
    address public backendAddress;
    
    event Purchase(address indexed buyer, uint256 amount, string id, string uri);
    event NFTMinted(address indexed to, uint256 tokenId, string uri);
    event Refunded(address indexed to, uint256 amount);
    
    constructor(address initialOwner) ERC721("Exeed Me NFT", "EXE") Ownable(initialOwner) {} 
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) 
    { 
        return super.tokenURI(tokenId); 
    } 
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) 
    { 
        return super.supportsInterface(interfaceId);
    }

    function buy(string memory id, string memory uri) external payable {
        require(msg.value >= 0.01 ether, "wrong price");
        (bool success, ) = backendAddress.call{value: msg.value}("");
        require(success, "transfer failure");
        emit Purchase(msg.sender, msg.value, id, uri);
    }

    function mint(address to, string memory uri) external onlyBackend {
        tokenIdCounter++;
        _safeMint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, uri);
        emit NFTMinted(to, tokenIdCounter, uri);
    }

    function refund(address to, uint256 amount) external onlyBackend {
        require(address(this).balance >= amount, "insufficient balance");
        payable(to).transfer(amount);
        emit Refunded(to, amount);
    }

    function setBackendAddress(address _backend) external onlyOwner {
        backendAddress = _backend;
    }

    modifier onlyBackend() {
        require(msg.sender == backendAddress, "backend exclusive call");
        _;
    }

    receive() external payable {}
}