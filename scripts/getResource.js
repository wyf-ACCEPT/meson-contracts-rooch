const { getRoochNodeUrl, RoochClient, bcs } = require("@roochnetwork/rooch-sdk")
const { sha3_256 } = require('js-sha3')

require('dotenv').config()

const main = async () => {
  const client = new RoochClient({
    url: getRoochNodeUrl('testnet'),
  })

  const generalStoreType = `${process.env.HEX_ADDRESS}::MesonStates::GeneralStore`

  const balanceResult = await client.getBalance({
    owner: process.env.ADDRESS,
    coinType: '0x3::gas_coin::RGas',
  })
  console.log(`Balance: ${balanceResult.balance / 1e8} $ROOCH`)

  const objects = await client.queryObjectStates({
    // filter: { object_id: '' }
    filter: { owner: process.env.ADDRESS },
  })
  console.log(`Objects: ${objects.data.length}`)

  const generalStore = await client.getStates({
    accessPath: `/resource/${process.env.HEX_ADDRESS}/${generalStoreType}`,
    stateOption: { decode: true },
  })

  const tableInfo = {}
  for (const [k, v] of Object.entries(generalStore[0].decoded_value.value.value.value)) {
    tableInfo[k] = v.value.handle.value.id
  }
  console.log(`Table Info: ${JSON.stringify(tableInfo)}`)

  const encoder = new TextEncoder()
  const encodedU8 = encoder.encode('u8')
  const tokenIndex = 34   // u8 type
  const serializedTokenIndex = bcs.u8().serialize(tokenIndex).toBytes()
  const concatenatedArray = new Uint8Array([...serializedTokenIndex, ...encodedU8])
  const key = '0x' + sha3_256(concatenatedArray)

  // // const keypair = Secp256k1Keypair.deriveKeypair(process.env.MNEMONIC)
  // // console.log(keypair)


  console.log(`/fields/${tableInfo.supported_coins}/${key}`)
  const b5 = await client.getStates({
    accessPath: `/fields/${tableInfo.supported_coins}/${key}`,
    stateOption: { decode: true },
  })
  console.log(b5[0].decoded_value.value)


}

main()