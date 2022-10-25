
                                 ///////////  Erc20 params //////////// 

    bool public alreadyDistributedReserves;
    uint256 public alreadyDistributedTeams;

    /// @notice Reference date for the different stages of the project.
    uint256 public initialTime = block.timestamp;

    uint256 public constant lockedSupplyTeam = 3e7 * 10**18;
    uint256 public constant lockedSupplyReserves = 4e7 * 10**18;

        contract constructor 
     * @notice Constructor of the contract ERC20.
     * @param _vesting Address of the Vesting contract.



     * @notice Allows distribution of future supplies, locked in time.
     distributeLockedSupplyTeams()


    * @notice Allows distribution of future supplies, locked in time.
        function distributeLockedSupplyReserves() 




                    /////////////////// VESTING ERC1155 params ///////////////////

            * @notice Enables only externally owned accounts.

    modifier callerIsUser() 

    uint16 public constant maxRewardsPreSales = 40000;
    uint16 public constant maxRewardsWhitelist = 1200;
    uint16 public constant maxRewardsPublicSale1 = 5714;
    uint16 public constant maxRewardsPublicSale2 = 750;

       uint256 public constant stakingPeriod = 30 days;
    uint256 public stakingMinimalUnlock = 1 days;

    /// @dev calcul: (30 * nombreDeMois) - 1, pour laisser quasiment un mois aux users de staker et d'avoir la récompense totale sans dépasser la stakingPeriod.
    uint256 public endVestingPreSalesWhitelist = block.timestamp + 359 days;
    uint256 public endVestingPublicSale1 = block.timestamp + 299 days;
    uint256 public endVestingPublicSale2 = block.timestamp + 239 days;

        /// @notice event emitted when a user has staked a nft.
    event Staked1155(address owner, uint8 id, uint16 amount);

        /// @notice event emitted when a user has unstaked a nft.
    event Unstaked1155(address owner, uint8 id, uint16 amount);

        /// @notice event emitted when a user has claimed his rewards.
    event RewardClaimed(address owner, uint256 rewards);


         * @notice Changes the variable notPaused to allow or not the staking.

    function setPause() 

        * @notice Changes the minimum period before it's possible to unstake.
        * @param _period New minimum period before being able to unstake.

    function setUnlockPeriod(uint256 _period) 

            * @notice Allows to stake an NFT in the desired quantity.
            * @param tokenId Id of the token to stake.
            * @param tokenAmount Amount of tokens to stake.

    function stakeERC1155(uint8 tokenId, uint16 tokenAmount)

            * @notice Allows to stake several NFT.
            * @param tokenIds Ids of the tokens to stake.
            * @param tokenAmounts Amount of tokens to stake.
     
    function batchStakeERC1155(uint8[] memory tokenIds, uint16[] memory tokenAmounts)

            * @notice Allows to withdraw rewards available without unstake.
            * @param tokenId Id of the token.
            * @param tokenIndex Index of the token in the mapping.

    function claimRewards(uint8 tokenId, uint16 tokenIndex)

            * @notice Allows to unstake an NFT staked.
            * @param tokenId Id of the token to unstake.
            * @param tokenIndex Index of the token to unstake in the mapping.

    function unstakeERC1155(uint8 tokenId, uint16 tokenIndex)

            * @notice Allows to unstake several NFT staked.
            * @param tokenIds Ids of the tokens to unstake.
            * @param tokenIndexes Indexes of the tokens to unstake in the mapping.

    function batchUnstakeERC1155(uint8[] memory tokenIds,uint16[] memory tokenIndexes) 

            * @notice Allows the entire undistributed supply to be burnt at the end of the vesting.
            * @dev Extreme Warning! Destroys all WRN tokens on the contract, irrevocable action!

    function burnExcededSupplyERC20()

            * @notice Returns the ItemInfo[] of a specific NFT staked.
            * @param user Address of the user.
            * @param tokenId Id of the token.
            * @return ItemInfo[] Details of tokenId.

    function getStakedERC1155(address user, uint8 tokenId)

            * @notice Returns the list of NFT staked by the user.
            * @param user Address of the user.
            * @return uint8[] List of tokenIds.

    function getAllStakedERC1155(address user)

            * @notice Allows to see the amount of reward available to a user.
            * @param user Address of the user.
            * @param tokenId Id of the token.
            * @param tokenIndex Index of the token in the mapping.
            * @return uint256 Amount of rewards.

    function getRewards(address user,uint8 tokenId,uint16 tokenIndex) 




                        /////////////// Staking ERC20  params ////////////////

    uint256 public duration; [front/stake]
        Timestamp of when the rewards finish 

    uint256 public finishAt; 
         Minimum of last updated time and reward finish time

    uint256 public updatedAt;
         Reward to be paid out per second

    uint256 public rewardRate; [front/home]
         Sum of (reward rate * dt * 1e18 / total supply)

    uint256 public rewardPerTokenStored; [front/home]
         Total staked

    uint256 public totalSupply;[front/staking]
         User address => rewardPerTokenStored

    mapping(address => uint256) public userRewardPerTokenPaid;
         User address => rewards to be claimed

    mapping(address => uint256) public rewards;
         User address => staked amount

    mapping(address => uint256) public balanceOf;
         User address => timestamp of the first stake

    mapping(address => uint256) public firstStakeOf;

        * @notice onlybyowner setPause for the pool.

     function setPause() 

        * @notice Changes the total duration of the staking pool, the first function to be called when the pool is created.
        * @param _duration Duration of the pool.

     function setRewardsDuration(uint256 _duration)

        * @notice Initializes the set of variables needed to run the staking pool, the second function to be called when the pool is created.
        * @param _amount Total amount of reward that the pool will distribute.
     
     function notifyRewardAmount(uint256 _amount)

        * @notice Calculate the sum of (reward rate * dt * 1e18 / total supply), left side of the equation.
        * @return uint256 rewardPerToken.

     function rewardPerToken()


        * @notice Calculates the amount of rewards a user has earned.
        * @param _account Address of the user.
        * @return uint256 Amount of rewards.
     
     function earned(address _account)

        * @notice Allows to stake a quantity of WRN.
        * @param _amount Amount of tokens to stake.

     function stake(uint256 _amount)

        * @notice Allows to unstake a quantity of WRN, the reward is sent.
        * @param _amount Amount of tokens to unstake.

     function unstake(uint256 _amount)

         * @notice Allows a user to claim their rewards.

    function claimReward()