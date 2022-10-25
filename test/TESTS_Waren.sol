// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.7;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// /// @title Waren NFTs Collection
// /// @author cd33
// contract TESTS_Waren is Ownable, ERC1155 {
//     using Strings for uint256;

//     using SafeERC20 for IERC20;
//     IERC20 private usdt = IERC20(0x55d398326f99059fF775485246999027B3197955);
//     address private recipient = 0xE4A9B8e3543814CDC309A057407A4327362341E6;
//     AggregatorV3Interface internal priceFeed =
//         AggregatorV3Interface(0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE);

//     enum Step {
//         Before,
//         WhitelistSale,
//         PublicSale1,
//         PublicSale2
//     }

//     Step public sellingStep;

//     uint8 private constant NFT1 = 1;
//     uint8 private constant NFT2 = 2;
//     uint8 private constant NFT3 = 3;
//     uint8 private constant NFT4 = 4;

//     uint8 private constant limitNFT1 = 125;
//     uint8 private constant limitNFT2 = 200;
//     uint16 private constant limitNFT3 = 5250;
//     uint24 private constant limitNFT4 = 86667;

//     uint8 public nextNFT1;
//     uint8 public nextNFT2;
//     uint16 public nextNFT3;
//     uint24 public nextNFT4;

//     uint256 public constant goldPassPrice = 10000;
//     uint256 public constant whitelistSalePrice = 300;
//     uint256 public constant publicSalePrice1 = 2000;
//     uint256 public constant publicSalePrice2 = 300;

//     bool public paused;

//     string public baseURI;

//     bytes32 private merkleRoot;

//     mapping(address => uint8) private amountNftPerWalletWhitelist;

//     /**
//      * @notice Emitted when the step changed.
//      */
//     event StepChanged(uint8 _step);

//     /**
//      * @notice Constructor of the contract ERC1155.
//      * @param _merkleRoot Used for the whitelist.
//      * @param _baseURI Metadatas for the ERC1155.
//      */
//     constructor(bytes32 _merkleRoot, string memory _baseURI) ERC1155(_baseURI) {
//         merkleRoot = _merkleRoot;
//         baseURI = _baseURI;
//     }

//     /**
//      * @notice Enables only externally owned accounts (= users) to mint.
//      */
//     modifier callerIsUser() {
//         require(tx.origin == msg.sender, "Caller is a contract");
//         _;
//     }

//     /**
//      * @notice Overrides safeTransferFrom of the parent ERC1155 to add a time delay.
//      */
//     function safeTransferFrom(
//         address from,
//         address to,
//         uint256 id,
//         uint256 amount,
//         bytes memory data
//     ) public override {
//         require(paused, "NFTs are not exchangeable for the moment");
//         super.safeTransferFrom(from, to, id, amount, data);
//     }

//     /**
//      * @notice Overrides safeBatchTransferFrom of the parent ERC1155 to add a time delay.
//      */
//     function safeBatchTransferFrom(
//         address from,
//         address to,
//         uint256[] memory ids,
//         uint256[] memory amounts,
//         bytes memory data
//     ) public override {
//         require(paused, "NFTs are not exchangeable for the moment");
//         super.safeBatchTransferFrom(from, to, ids, amounts, data);
//     }

//     /**
//      * @notice Changes the variable paused to allow or not the exchanges.
//      */
//     function setPaused() external onlyOwner {
//         paused = !paused;
//     }

//     /**
//      * @notice Get the current BNB/USD price.
//      * @dev The function uses the chainlink aggregator.
//      * @return int Price value.
//      */
//     function getLatestPrice() public view returns (int256) {
//         ( , int256 price, , , ) = priceFeed.latestRoundData();
//         return price;
//     }

//     /**
//      * @notice Requires approval of the other contract upstream.
//      * @param _tokenamount Dollar amount debited on the contract and returned to recipient.
//      */
//     function acceptPayment(uint256 _tokenamount) private {
//         usdt.safeTransferFrom(msg.sender, address(this), _tokenamount);
//         usdt.safeTransfer(recipient, usdt.balanceOf(address(this)));
//     }

//     /**
//      * @notice Allows to change the step of the contract.
//      * @param _step Step to change.
//      */
//     function setStep(uint8 _step) external onlyOwner {
//         sellingStep = Step(_step);
//         emit StepChanged(_step);
//     }

//     /**
//      * @notice Change the base URI.
//      * @param _newBaseURI New base URI.
//      **/
//     function setBaseUri(string memory _newBaseURI) external onlyOwner {
//         baseURI = _newBaseURI;
//     }

//     /**
//      * @notice Change the token's image URI, override for OpenSea traits compatibility.
//      * @param _tokenId Id of the token.
//      * @return string Token's metadatas URI.
//      */
//     function uri(uint256 _tokenId)
//         public
//         view
//         override
//         returns (string memory)
//     {
//         require(_tokenId > 0 && _tokenId < 5, "NFT doesn't exist");
//         return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
//     }

//     // MINTS
//     /**
//      * @notice Mint in BNB the gold pass.
//      * @param _quantity Number of tokens to mint.
//      */
//     function goldPassMint(uint8 _quantity) external payable callerIsUser {
//         require(sellingStep != Step.Before, "Gold Pass not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT1 + _quantity <= limitNFT1, "Sold out");
//         // require(
//         //     msg.value >=
//         //         (_quantity * goldPassPrice * 10**26) /
//         //             uint256(getLatestPrice()),
//         //     "Not enough funds"
//         // );
//         payable(recipient).transfer(address(this).balance);
//         nextNFT1 += _quantity;
//         _mint(
//             msg.sender,
//             NFT1,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #1"))
//         );
//     }

//     /**
//      * @notice Mint in USDT the gold pass.
//      * @param _quantity Number of tokens to mint.
//      */
//     function goldPassMintUSDT(uint8 _quantity) external callerIsUser {
//         require(sellingStep != Step.Before, "Gold Pass not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT1 + _quantity <= limitNFT1, "Sold out");
//         acceptPayment(goldPassPrice * 10**18 * _quantity);
//         nextNFT1 += _quantity;
//         _mint(
//             msg.sender,
//             NFT1,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #1"))
//         );
//     }

//     /**
//      * @notice Mint in BNB during the whitelist.
//      * @param _proof Merkle Proof.
//      * @param _quantity Number of tokens to mint.
//      */
//     function whitelistSaleMint(bytes32[] calldata _proof, uint8 _quantity)
//         external
//         payable
//         callerIsUser
//     {
//         require(sellingStep == Step.WhitelistSale, "Whitelist sale not active");
//         require(_isWhiteListed(msg.sender, _proof), "Not whitelisted");
//         require(_quantity > 0 && _quantity < 6, "Quantity between 1 & 5");
//         require(
//             amountNftPerWalletWhitelist[msg.sender] + _quantity <= 5,
//             "Max 5 NFT per wallet"
//         );
//         require(nextNFT2 + _quantity <= limitNFT2, "Sold out");
//         // require(
//         //     msg.value >=
//         //         (_quantity * whitelistSalePrice * 10**26) /
//         //             uint256(getLatestPrice()),
//         //     "Not enough funds"
//         // );
//         payable(recipient).transfer(address(this).balance);
//         amountNftPerWalletWhitelist[msg.sender] += _quantity;
//         nextNFT2 += _quantity;
//         _mint(
//             msg.sender,
//             NFT2,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #2"))
//         );
//     }

//     /**
//      * @notice Mint in USDT during the whitelist.
//      * @param _proof Merkle Proof.
//      * @param _quantity Number of tokens to mint.
//      */
//     function whitelistSaleMintUSDT(bytes32[] calldata _proof, uint8 _quantity)
//         external
//         callerIsUser
//     {
//         require(sellingStep == Step.WhitelistSale, "Whitelist sale not active");
//         require(_isWhiteListed(msg.sender, _proof), "Not whitelisted");
//         require(_quantity > 0 && _quantity < 6, "Quantity between 1 & 5");
//         require(
//             amountNftPerWalletWhitelist[msg.sender] + _quantity <= 5,
//             "Max 5 NFT per wallet"
//         );
//         require(nextNFT2 + _quantity <= limitNFT2, "Sold out");
//         acceptPayment(whitelistSalePrice * 10**18 * _quantity);
//         amountNftPerWalletWhitelist[msg.sender] += _quantity;
//         nextNFT2 += _quantity;
//         _mint(
//             msg.sender,
//             NFT2,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #2"))
//         );
//     }

//     /**
//      * @notice Mint in BNB during the public sale 1.
//      * @param _quantity Number of tokens to mint.
//      */
//     function publicSaleMint1(uint8 _quantity) external payable callerIsUser {
//         require(sellingStep == Step.PublicSale1, "Public sale 1 not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT3 + _quantity <= limitNFT3, "Sold out");
//         // require(
//         //     msg.value >=
//         //         (_quantity * publicSalePrice1 * 10**26) /
//         //             uint256(getLatestPrice()),
//         //     "Not enough funds"
//         // );
//         payable(recipient).transfer(address(this).balance);
//         nextNFT3 += _quantity;
//         _mint(
//             msg.sender,
//             NFT3,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #3"))
//         );
//     }

//     /**
//      * @notice Mint in USDT during the public sale 1.
//      * @param _quantity Number of tokens to mint.
//      */
//     function publicSaleMint1USDT(uint8 _quantity) external callerIsUser {
//         require(sellingStep == Step.PublicSale1, "Public sale 1 not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT3 + _quantity <= limitNFT3, "Sold out");
//         acceptPayment(publicSalePrice1 * 10**18 * _quantity);
//         nextNFT3 += _quantity;
//         _mint(
//             msg.sender,
//             NFT3,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #3"))
//         );
//     }

//     /**
//      * @notice Mint in BNB during the public sale 2.
//      * @param _quantity Number of tokens to mint.
//      */
//     function publicSaleMint2(uint8 _quantity) external payable callerIsUser {
//         require(sellingStep == Step.PublicSale2, "Public sale 2 not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT4 + _quantity <= limitNFT4, "Sold out");
//         // require(
//         //     msg.value >=
//         //         (_quantity * publicSalePrice2 * 10**26) /
//         //             uint256(getLatestPrice()),
//         //     "Not enough funds"
//         // );
//         payable(recipient).transfer(address(this).balance);
//         nextNFT4 += _quantity;
//         _mint(
//             msg.sender,
//             NFT4,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #4"))
//         );
//     }

//     /**
//      * @notice Mint in USDT during the public sale 2.
//      * @param _quantity Number of tokens to mint.
//      */
//     function publicSaleMint2USDT(uint8 _quantity) external callerIsUser {
//         require(sellingStep == Step.PublicSale2, "Public sale 2 not active");
//         require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
//         require(nextNFT4 + _quantity <= limitNFT4, "Sold out");
//         acceptPayment(publicSalePrice2 * 10**18 * _quantity);
//         nextNFT4 += _quantity;
//         _mint(
//             msg.sender,
//             NFT4,
//             _quantity,
//             bytes(abi.encodePacked("Waren NFT Type #4"))
//         );
//     }

//     /**
//      * @notice Allows the owner to offer NFTs.
//      * @param _to Receiving address.
//      * @param _quantity Number of tokens to mint.
//      * @param _type Type of tokens to mint.
//      */
//     function gift(
//         address _to,
//         uint16 _quantity,
//         uint8 _type
//     ) external onlyOwner {
//         require(_quantity > 0, "Quantity min 1");
//         require(_type > 0 && _type < 5, "NFT doesn't exist");
//         if (_type == NFT1) {
//             require(nextNFT1 + _quantity <= limitNFT1, "Sold out");
//             nextNFT1 += uint8(_quantity);
//             _mint(
//                 _to,
//                 NFT1,
//                 _quantity,
//                 bytes(abi.encodePacked("Waren NFT Type #1"))
//             );
//         }
//         if (_type == NFT2) {
//             require(nextNFT2 + _quantity <= limitNFT2, "Sold out");
//             nextNFT2 += uint8(_quantity);
//             _mint(
//                 _to,
//                 NFT2,
//                 _quantity,
//                 bytes(abi.encodePacked("Waren NFT Type #2"))
//             );
//         }
//         if (_type == NFT3) {
//             require(nextNFT3 + _quantity <= limitNFT3, "Sold out");
//             nextNFT3 += _quantity;
//             _mint(
//                 _to,
//                 NFT3,
//                 _quantity,
//                 bytes(abi.encodePacked("Waren NFT Type #3"))
//             );
//         }
//         if (_type == NFT4) {
//             require(nextNFT4 + _quantity <= limitNFT4, "Sold out");
//             nextNFT4 += _quantity;
//             _mint(
//                 _to,
//                 NFT4,
//                 _quantity,
//                 bytes(abi.encodePacked("Waren NFT Type #4"))
//             );
//         }
//     }

//     // WHITELIST
//     /**
//      * @notice Change Merkle root to update the whitelist.
//      * @param _merkleRoot Merkle Root.
//      **/
//     function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
//         merkleRoot = _merkleRoot;
//     }

//     /**
//      * @notice Return true or false if the account is whitelisted or not.
//      * @param _account User's account.
//      * @param _proof Merkle Proof.
//      * @return bool Account whitelisted or not.
//      **/
//     function _isWhiteListed(address _account, bytes32[] calldata _proof)
//         internal
//         view
//         returns (bool)
//     {
//         return _verify(_leafHash(_account), _proof);
//     }

//     /**
//      * @notice Return the account hashed.
//      * @param _account Account to hash.
//      * @return bytes32 Account hashed.
//      **/
//     function _leafHash(address _account) internal pure returns (bytes32) {
//         return keccak256(abi.encodePacked(_account));
//     }

//     /**
//      * @notice Returns true if a leaf can be proven to be part of a Merkle tree defined by root.
//      * @param _leaf Leaf.
//      * @param _proof Merkle Proof.
//      * @return bool Be part of the Merkle tree or not.
//      **/
//     function _verify(bytes32 _leaf, bytes32[] memory _proof)
//         internal
//         view
//         returns (bool)
//     {
//         return MerkleProof.verify(_proof, merkleRoot, _leaf);
//     }
// }