// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title Waren ERC20
/// @author cd33
contract WarenERC20 is ERC20Burnable, Ownable {
    // address private constant marketing = 0xdB4D6160532835f8Be98f3682eD165D5Ce02ECf9; // cd33
    address private constant marketing =
        0x90F79bf6EB2c4f870365E785982E1f101E93b906; // address[3] de getSigners de Hardhat
    address private constant teams = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65; // address[4] de getSigners de Hardhat
    address private constant reserves =
        0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc; // address[5] de getSigners de Hardhat

    bool public alreadyDistributedReserves;
    uint256 public alreadyDistributedTeams;

    /// @notice Reference date for the different stages of the project.
    uint256 public initialTime = block.timestamp;

    uint256 public constant lockedSupplyTeam = 3e7 * 10**18;
    uint256 public constant lockedSupplyReserves = 4e7 * 10**18;

    /**
     * @notice Constructor of the contract ERC20.
     * @param _vesting Address of the Vesting contract.
     */
    constructor(address _vesting) ERC20("WarenErc20", "WRN") {
        _mint(_vesting, 1e8 * (10**18));
        _mint(marketing, 3e7 * (10**18));
        _mint(address(this), 7e7 * (10**18));
    }

    /**
     * @notice Allows distribution of future supplies, locked in time.
     */
    function distributeLockedSupplyTeams() external onlyOwner {
        require(
            block.timestamp >= initialTime + 274 days,
            "Distribution is not available"
        );
        require(
            alreadyDistributedTeams < lockedSupplyTeam,
            "Already distributed"
        );
        uint256 period;
        uint256 percentage;
        uint256 rewards;
        uint256 amountToDistribute;
        period = (block.timestamp - (initialTime + 244 days)) / 30 days;
        if (period < 7) {
            percentage = 15 * period;
        } else {
            percentage = 100;
        }
        rewards = 3e7 * 10**16 * percentage;
        require(
            rewards - alreadyDistributedTeams > 0,
            "Not enough time has passed for a new distribution"
        );
        amountToDistribute = rewards - alreadyDistributedTeams;
        alreadyDistributedTeams += amountToDistribute;
        _transfer(address(this), teams, amountToDistribute);
    }

    /**
     * @notice Allows distribution of future supplies, locked in time.
     */
    function distributeLockedSupplyReserves() external onlyOwner {
        require(
            block.timestamp >= initialTime + 457 days,
            "Distribution is not available"
        );
        require(!alreadyDistributedReserves, "Already distributed");
        alreadyDistributedReserves = true;
        _transfer(address(this), reserves, lockedSupplyReserves);
    }
}
