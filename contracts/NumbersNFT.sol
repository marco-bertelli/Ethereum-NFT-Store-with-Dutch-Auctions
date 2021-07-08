pragma solidity ^0.4.23;

import "./tokens/NFTokenMetadata.sol";
import "./tokens/NFTokenEnumerable.sol";
import "../node_modules/@0xcert/ethereum-utils/contracts/ownership/Ownable.sol";

contract NumbersNFT is NFTokenMetadata, NFTokenEnumerable, Ownable {
    event MintEvent(uint256 _value);

    constructor(string _name, string _symbol) public {
        nftName = _name;
        nftSymbol = _symbol;
    }

    function mint(address _owner, uint256 _id) public {
        emit MintEvent(_id);
        super._mint(_owner, _id);
    }

    function burn(address _owner, uint256 _tokenId) external onlyOwner {
        super._burn(_owner, _tokenId);
    }
}
