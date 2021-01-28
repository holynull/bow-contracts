pragma solidity ^0.6.0;

import "./IHRC20.sol";

// Bow DAO Token Wallet
// All data's decimal is 18.
interface IBowTokenWallet is IHRC20 {
    function approveTokenToProxy(address tokenAddress, uint256 amt) external;
}
