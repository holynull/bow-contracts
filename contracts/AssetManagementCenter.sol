pragma solidity ^0.6.0;

import "./HRC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract AssetManagementCenter is HRC20, Ownable {
    using SafeMath for uint256;

    constructor() public HRC20("BOW Asset Management Center", "BAMC-V1") {
        transferOwnership(msg.sender);
    }
}
