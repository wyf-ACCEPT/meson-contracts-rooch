const { getRoochNodeUrl, RoochClient, bcs } = require("@roochnetwork/rooch-sdk")
const { ethers } = require('ethers')

const swapStruct = [
  { name: 'version', type: 'uint8' },
  { name: 'amount', type: 'uint40' },
  { name: 'salt', type: 'uint80' },
  { name: 'fee', type: 'uint40' },
  { name: 'expireTs', type: 'uint40' },
  { name: 'outChain', type: 'uint16' },
  { name: 'outToken', type: 'uint8' },
  { name: 'inChain', type: 'uint16' },
  { name: 'inToken', type: 'uint8' },
]

// 0x 01 0027759ca3 80100000000083a413fb 00000a1a03 00671a2072 afd5 02 afd5 02

const main = async () => {
  const encoded = ethers.solidityPacked(
    swapStruct.map(d => d.type),
    [
      1, 10000, 0x80100000000083a413fbn, 0, parseInt(Date.now() / 1e3 + 5400
        + 5000     // This is a bug in the rooch testnet, the timestamp is 7000 seconds ahead
      ), 0xafd5, 34, 0xafd5, 34
    ],
  )

  console.log(encoded)
  console.log((Buffer.from(encoded.slice(2), 'hex')).join(','))



  // const timestamp = await client.getStates({
  //   accessPath: `/resource/${process.env.HEX_ADDRESS}/${generalStoreType}`,
  //   stateOption: { decode: true },
  // })
  // console.log(timestamp)


}

main()