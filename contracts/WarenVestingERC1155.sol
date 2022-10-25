// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./Waren.sol";
import "./WarenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Waren Vesting ERC1155
/// @author cd33
contract WarenVestingERC1155 is Ownable, ERC1155Holder, ReentrancyGuard {
    using SafeERC20 for WarenERC20;

    Waren public warenERC1155;
    WarenERC20 public warenERC20;

    struct ItemInfo {
        uint16 amount;
        uint256 timestamp;
        uint256 alreadyClaimed;
    }

    struct Staker {
        mapping(uint256 => ItemInfo[]) multiToken;
        uint8[] ownedMultiTokens;
    }

    uint16 public constant maxRewardsPreSales = 40000;
    uint16 public constant maxRewardsWhitelist = 1200;
    uint16 public constant maxRewardsPublicSale1 = 5714;
    uint16 public constant maxRewardsPublicSale2 = 750;

    uint8[] private typePercentage = [10, 15];

    uint256 public constant stakingPeriod = 30 days;
    uint256 public stakingMinimalUnlock = 1 days;

    /// @dev calcul: (30 * nombreDeMois) - 1, pour laisser quasiment un mois aux users de staker et d'avoir la récompense totale sans dépasser la stakingPeriod.
    uint256 public endVestingPreSalesWhitelist = block.timestamp + 359 days;
    uint256 public endVestingPublicSale1 = block.timestamp + 299 days;
    uint256 public endVestingPublicSale2 = block.timestamp + 239 days;

    bool public notPaused;

    mapping(address => Staker) private stakers;

    /// @notice event emitted when a user has staked a nft.
    event Staked1155(address owner, uint8 id, uint16 amount);

    /// @notice event emitted when a user has unstaked a nft.
    event Unstaked1155(address owner, uint8 id, uint16 amount);

    /// @notice event emitted when a user has claimed his rewards.
    event RewardClaimed(address owner, uint256 rewards);

    /**
     * @notice Constructor of the contract Vesting.
     * @param _warenERC1155 Address of the ERC1155 contract.
     */
    constructor(Waren _warenERC1155) {
        warenERC1155 = _warenERC1155; /// @todo à supprimer lors du déploiement, en faire une constante plus haut
    }

    /**
     * @notice Enables only externally owned accounts.
     */
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Caller is a contract");
        _;
    }

    /**
     * @notice Performs all safety checks before stake.
     * @param _tokenId Id of the token to stake to check.
     * @param _tokenAmount Amount of tokens to stake to check.
     */
    modifier stakeModifier(uint8 _tokenId, uint16 _tokenAmount) {
        require(notPaused, "Staking unavailable for the moment");
        require(_tokenAmount > 0, "Limit min 1");
        require(_tokenId > 0 && _tokenId < 5, "NFT doesn't exists");
        if (_tokenId == 1 || _tokenId == 2) {
            require(
                block.timestamp < endVestingPreSalesWhitelist,
                "Vesting Gold and Whitelist is finished"
            );
        } else if (_tokenId == 3) {
            require(
                block.timestamp < endVestingPublicSale1,
                "Vesting Public Sale 1 is finished"
            );
        } else {
            require(
                block.timestamp < endVestingPublicSale2,
                "Vesting Public Sale 2 is finished"
            );
        }
        require(warenERC1155.balanceOf(msg.sender, _tokenId) > 0, "Not owner");
        _;
    }

    /**
     * @notice Performs all safety checks before unstake or claim rewards.
     * @param _tokenId Id of the token to check.
     * @param _tokenIndex Index of the token in the mapping to check.
     */
    modifier unstakeAndRewardsModifier(uint8 _tokenId, uint16 _tokenIndex) {
        require(_tokenId > 0 && _tokenId < 5, "NFT doesn't exists");
        require(
            stakers[msg.sender].multiToken[_tokenId].length != 0,
            "No NFT staked"
        );
        require(
            _tokenIndex < stakers[msg.sender].multiToken[_tokenId].length,
            "Out of bounds token index"
        );

        uint256 elapsedTime = block.timestamp -
            stakers[msg.sender].multiToken[_tokenId][_tokenIndex].timestamp;
        require(
            elapsedTime > stakingMinimalUnlock,
            "Unable to unstake or get rewards before the minimum period"
        );
        _;
    }

    /**
     * @notice Connects Vesting to ERC20 for rewards.
     * @param _warenERC20 Address of the ERC20 contract.
     */
    function setWarenERC20(WarenERC20 _warenERC20) external onlyOwner {
        warenERC20 = _warenERC20;
    }

    /**
     * @notice Changes the variable notPaused to allow or not the staking.
     */
    function setPause() external onlyOwner {
        notPaused = !notPaused;
    }

    /**
     * @notice Changes the minimum period before it's possible to unstake.
     * @param _period New minimum period before being able to unstake.
     */
    function setUnlockPeriod(uint256 _period) external onlyOwner {
        stakingMinimalUnlock = _period;
    }

    /**
     * @notice Allows to stake an NFT in the desired quantity.
     * @param tokenId Id of the token to stake.
     * @param tokenAmount Amount of tokens to stake.
     */
    function stakeERC1155(uint8 tokenId, uint16 tokenAmount)
        external
        callerIsUser
    {
        _stakeERC1155(tokenId, tokenAmount);
    }

    /**
     * @notice Allows to stake several NFT.
     * @param tokenIds Ids of the tokens to stake.
     * @param tokenAmounts Amount of tokens to stake.
     */
    function batchStakeERC1155(
        uint8[] memory tokenIds,
        uint16[] memory tokenAmounts
    ) external callerIsUser {
        require(
            tokenIds.length == tokenAmounts.length,
            "Ids and amounts length mismatch"
        );
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stakeERC1155(tokenIds[i], tokenAmounts[i]);
        }
    }

    /**
     * @notice Private function used in stakeERC1155 and batchStakeERC1155.
     * @param _tokenId Id of the token to stake.
     * @param _tokenAmount Amount of tokens to stake.
     */
    function _stakeERC1155(uint8 _tokenId, uint16 _tokenAmount)
        private
        nonReentrant
        stakeModifier(_tokenId, _tokenAmount)
    {
        warenERC1155.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _tokenAmount,
            ""
        );
        Staker storage staker = stakers[msg.sender];
        ItemInfo memory info = ItemInfo(
            _tokenAmount,
            block.timestamp,
            0
        );
        if (staker.multiToken[_tokenId].length == 0) {
            staker.ownedMultiTokens.push(_tokenId);
        }
        staker.multiToken[_tokenId].push(info);
        emit Staked1155(msg.sender, _tokenId, _tokenAmount);
    }

    /**
     * @notice Allows to withdraw rewards available without unstake.
     * @param tokenId Id of the token.
     * @param tokenIndex Index of the token in the mapping.
     */
    function claimRewards(uint8 tokenId, uint16 tokenIndex)
        external
        callerIsUser
    {
        _claimRewards(tokenId, tokenIndex);
    }

    /**
     * @notice Private function used in claimRewards.
     * @param _tokenId Id of the token.
     * @param _tokenIndex Index of the token in the mapping.
     */
    function _claimRewards(uint8 _tokenId, uint16 _tokenIndex)
        private
        nonReentrant
        unstakeAndRewardsModifier(_tokenId, _tokenIndex)
    {
        uint256 rewards = getRewards(msg.sender, _tokenId, _tokenIndex);

        if (rewards == 0) return;

        stakers[msg.sender]
        .multiToken[_tokenId][_tokenIndex].alreadyClaimed += rewards;

        warenERC20.safeTransfer(msg.sender, rewards * 10**16);
        emit RewardClaimed(msg.sender, rewards);
    }

    /**
     * @notice Allows to unstake an NFT staked.
     * @param tokenId Id of the token to unstake.
     * @param tokenIndex Index of the token to unstake in the mapping.
     */
    function unstakeERC1155(uint8 tokenId, uint16 tokenIndex)
        external
        callerIsUser
    {
        _unstakeERC1155(tokenId, tokenIndex);
    }

    /**
     * @notice Allows to unstake several NFT staked.
     * @param tokenIds Ids of the tokens to unstake.
     * @param tokenIndexes Indexes of the tokens to unstake in the mapping.
     */
    function batchUnstakeERC1155(
        uint8[] memory tokenIds,
        uint16[] memory tokenIndexes
    ) external callerIsUser {
        require(
            tokenIds.length == tokenIndexes.length,
            "Ids and indexes length mismatch"
        );
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _unstakeERC1155(tokenIds[i], tokenIndexes[i]);
        }
    }

    /**
     * @notice Private function used in unstakeERC1155 and batchUnstakeERC1155.
     * @param _tokenId Id of the token to unstake.
     * @param _tokenIndex Index of the token to unstake in the mapping.
     */
    function _unstakeERC1155(uint8 _tokenId, uint16 _tokenIndex)
        private
        nonReentrant
        unstakeAndRewardsModifier(_tokenId, _tokenIndex)
    {
        Staker storage staker = stakers[msg.sender];
        ItemInfo memory item = staker.multiToken[_tokenId][_tokenIndex];

        uint256 rewards = getRewards(msg.sender, _tokenId, _tokenIndex);

        staker.multiToken[_tokenId][_tokenIndex] = staker.multiToken[_tokenId][
            staker.multiToken[_tokenId].length - 1
        ];
        staker.multiToken[_tokenId].pop();

        if (staker.multiToken[_tokenId].length == 0) {
            for (uint256 _j = 0; _j < staker.ownedMultiTokens.length; _j++) {
                if (staker.ownedMultiTokens[_j] == _tokenId) {
                    staker.ownedMultiTokens[_j] = staker.ownedMultiTokens[
                        staker.ownedMultiTokens.length - 1
                    ];
                    staker.ownedMultiTokens.pop();
                    break;
                }
            }
        }

        if (rewards > 0) {
            warenERC20.safeTransfer(msg.sender, rewards * 10**16);
            emit RewardClaimed(msg.sender, rewards);
        }

        warenERC1155.safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId,
            item.amount,
            ""
        );
        emit Unstaked1155(msg.sender, _tokenId, item.amount);
    }

    /**
     * @notice Allows the entire undistributed supply to be burnt at the end of the vesting.
     * @dev Extreme Warning! Destroys all WRN tokens on the contract, irrevocable action!
     */
    function burnExcededSupplyERC20() external onlyOwner {
        require(
            block.timestamp >= endVestingPreSalesWhitelist,
            "Vesting is not yet finished"
        );
        warenERC20.burn(warenERC20.balanceOf(address(this)));
    }

    /**
     * @notice Returns the ItemInfo[] of a specific NFT staked.
     * @param user Address of the user.
     * @param tokenId Id of the token.
     * @return ItemInfo[] Details of tokenId.
     */
    function getStakedERC1155(address user, uint8 tokenId)
        external
        view
        returns (ItemInfo[] memory)
    {
        return stakers[user].multiToken[tokenId];
    }

    /**
     * @notice Returns the list of NFT staked by the user.
     * @param user Address of the user.
     * @return uint8[] List of tokenIds.
     */
    function getAllStakedERC1155(address user)
        external
        view
        returns (uint8[] memory)
    {
        return stakers[user].ownedMultiTokens;
    }

    /**
     * @notice Allows to see the amount of reward available to a user.
     * @param user Address of the user.
     * @param tokenId Id of the token.
     * @param tokenIndex Index of the token in the mapping.
     * @return uint256 Amount of rewards.
     */
    function getRewards(
        address user,
        uint8 tokenId,
        uint16 tokenIndex
    ) public view returns (uint256) {
        Staker storage staker = stakers[user];
        ItemInfo memory item = staker.multiToken[tokenId][tokenIndex];

        uint256 timestamp;
        uint256 stakedPeriod;
        uint256 percentage;
        uint256 maxRewards;

        if (tokenId == 1 || tokenId == 2) {
            if (block.timestamp > endVestingPreSalesWhitelist) {
                timestamp = endVestingPreSalesWhitelist;
            } else {
                timestamp = block.timestamp;
            }
            stakedPeriod = (timestamp - item.timestamp) / stakingPeriod;
            if (stakedPeriod < 1) return 0;
            if (stakedPeriod < 6) {
                percentage = typePercentage[0];
            } else {
                percentage =
                    typePercentage[0] +
                    typePercentage[1] *
                    (stakedPeriod - 5);
                if (percentage > 100) percentage = 100;
            }
            if (tokenId == 1) {
                maxRewards = maxRewardsPreSales;
            } else {
                maxRewards = maxRewardsWhitelist;
            }
        } else if (tokenId == 3) {
            if (block.timestamp > endVestingPublicSale1) {
                timestamp = endVestingPublicSale1;
            } else {
                timestamp = block.timestamp;
            }
            stakedPeriod = (timestamp - item.timestamp) / stakingPeriod;
            if (stakedPeriod < 3) {
                return 0;
            } else if (stakedPeriod >= 3 && stakedPeriod < 9) {
                percentage = typePercentage[1] * (stakedPeriod - 2);
            } else {
                percentage = 100;
            }
            maxRewards = maxRewardsPublicSale1;
        } else {
            if (block.timestamp > endVestingPublicSale2) {
                timestamp = endVestingPublicSale2;
            } else {
                timestamp = block.timestamp;
            }
            stakedPeriod = (timestamp - item.timestamp) / stakingPeriod;
            if (stakedPeriod < 1) return 0;
            if (stakedPeriod < 7) {
                percentage = typePercentage[1] * stakedPeriod;
            } else {
                percentage = 100;
            }
            maxRewards = maxRewardsPublicSale2;
        }

        uint256 rewards = (item.amount * maxRewards * percentage);
        if (rewards - item.alreadyClaimed > 0) {
            return rewards - item.alreadyClaimed;
        }
        return 0;
    }
}
