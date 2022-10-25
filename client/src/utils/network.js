export const configuredChain = ["0x97", "0x56"] // BSC Testnet change to 56 for mainnet 

//Change the testnet to the mainnet configuration

export const networks = [
    {
        name: "BSC Mainnet",
        id: 56,
        hex: '0x56'
    },
    {
        name: "BSC Test Network",
        id: 97,
        hex: '0x97'
    }
    //if need other networks they apply them there and compile the contract on the new testnet or mainnet network 
]