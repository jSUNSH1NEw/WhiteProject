# EnneaWaren
Lors du mint d'un NFT, une récompense (WRN ERC20) est prévue en fonction du type de NFT.
Cette récompense est récupérable en stakant son NFT dans notre contrat de vesting.
Durant 1 an (à définir) le contract de vesting permet de staker son NFT et récupérer des récompenses.
Plus on le stake tot plus on recevra de récompense lors de son unstake

## ERC20
* Générer tous les erc20 au deploiement, les répartirs et burn au besoin
* Déploiement: 
  - Mint 1e8 tokens pour le vesting
  - Mint 3e7 pour le marketing
  - Mint le reste, 7e7 sur address(this) qui seront distribuées dans le futur à la team puis reserve
* Fonction de distribution des futurs supply vérouillées dans le temps

## TESTS ERC20
* Check les balances après deploiement, et totalSupply
* Tester le bon comportement de la fonction distributeLockedSupply()
* Gérer les distributions, distributeLockedSupply()
* Les fonctions de burn

## Vesting (ERC1155)
Vesting (ERC1155) = Staking NFT qui débloque les récompenses prévus en fonction du temps de staking
ex: 1NFT presale = 40000 au bout de X temps
Le contrat possède l'argent de la "vente publique" (les 100 millions) et redistribura ses tokens au stakers
Il appellera une fonction de burn pour burner son excedent à la fin de la période de vesting
* Fonction de burn ERC20
* Claim possible par les clients, pendant le vesting, tout en laissant le nft staké
FRONT:
(VESTING) si claim: message warning "votre durée minimum de staking sera réinitialisée, ce qui signifie que vous ne pourrez pas unstake votre NFT avant 1 mois"

## TESTS Vesting
* Recevoir token (100 millions)
* Voir si le stake, unstake, rewards fonctionnent
* Checker si les rewards sont corrects
* Checker si les infos des mapping sont corrects
* Tester l'ensemble des requires
* Fonction de burn ERC20

## Staking (ERC20 = WRN)
* Uniquement une pool WRN/WRN c.à.d un staking interne de seulement le WRN (ERC20) qui récompense en WRN.
* Le contrat possèdera et redistribura ses tokens, préalablement alimenté par le client (il gère)
* Tax 2% sur depot si unstake avant 6 mois

## TESTS Staking
* Voir le bon fonctionnement global

## SWAP/Listing
* L'argent du listing (argent utilisé pour créer la pool WRN/BNB sur pancake) vient du Marketing, le client gère.
