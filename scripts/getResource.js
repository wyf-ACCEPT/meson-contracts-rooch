const { getRoochNodeUrl, RoochClient, bcs } = require("@roochnetwork/rooch-sdk")
const { sha3_256 } = require('js-sha3')

require('dotenv').config()

const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

const main = async () => {
  // ====================================================================================
  const client = new RoochClient({
    url: getRoochNodeUrl('testnet'),
  })

  const balanceResult = await client.getBalance({
    owner: process.env.ADDRESS,
    coinType: '0x3::gas_coin::RGas',
  })
  console.log(`${BLUE}Balance:${RESET} ${balanceResult.balance / 1e8} $ROOCH`)

  const objects = await client.queryObjectStates({
    filter: { owner: process.env.ADDRESS },
  })
  console.log(`${BLUE}Objects:${RESET} ${objects.data.length}`)
  console.log()


  // ====================================================================================
  const generalStoreType = `${process.env.HEX_ADDRESS}::MesonStates::GeneralStore`

  const generalStore = await client.getStates({
    accessPath: `/resource/${process.env.HEX_ADDRESS}/${generalStoreType}`,
    stateOption: { decode: true },
  })

  const tableInfo = {}
  for (const [k, v] of Object.entries(generalStore[0].decoded_value.value.value.value)) {
    tableInfo[k] = v.value.handle.value.id
  }
  console.log(`${BLUE}Table Information (General Store):${RESET}`)
  console.log(tableInfo)

  const encoder = new TextEncoder()
  const encodedU8 = encoder.encode('u8')
  const tokenIndex = 34   // u8 type
  const serializedTokenIndex = bcs.u8().serialize(tokenIndex).toBytes()
  const concatenatedArray = new Uint8Array([...serializedTokenIndex, ...encodedU8])
  const keySupportedCoins = '0x' + sha3_256(concatenatedArray)

  const resultSupportedCoins = await client.getStates({
    accessPath: `/fields/${tableInfo.supported_coins}/${keySupportedCoins}`,
    stateOption: { decode: true },
  })
  console.log(`${BLUE}Supported Coins ID=${tokenIndex}:${RESET}`)
  console.log(resultSupportedCoins[0].decoded_value.value.value.value)


  const poolIndex = 15
  const keyPoolOwner = '0x' + sha3_256(new Uint8Array([
    ...bcs.u64().serialize(poolIndex).toBytes(), ...encoder.encode('u64'),
  ]))
  const resultPoolOwner = await client.getStates({
    accessPath: `/fields/${tableInfo.pool_owners}/${keyPoolOwner}`,
    stateOption: { decode: true },
  })
  console.log(`${BLUE}Pool Owner of ${poolIndex}:${RESET} ${resultPoolOwner[0].decoded_value.value.value}`)


  const keyPoolOfAuthorizedAddr = '0x' + sha3_256(new Uint8Array([
    ...Buffer.from('b072a8901831f11fb096aa53bbcebc9d5bf7d503d1ac52c911db7a4bcf3c51e2', 'hex'),
    ...encoder.encode('address'),
  ]))
  const resultPoolOfAuthorizedAddr = await client.getStates({
    accessPath: `/fields/${tableInfo.pool_of_authorized_addr}/${keyPoolOfAuthorizedAddr}`,
    stateOption: { decode: true },
  })
  console.log(`${BLUE}Pool of Authorized Address:${RESET} ${
    resultPoolOfAuthorizedAddr[0].decoded_value.value.value
  }`)


  const listPostSwaps = await client.listStates({
    accessPath: `/fields/${tableInfo.posted_swaps}`,
    stateOption: { decode: true },
  })
  const listLockSwaps = await client.listStates({
    accessPath: `/fields/${tableInfo.locked_swaps}`,
    stateOption: { decode: true },
  })
  console.log(`${BLUE}List Post Swaps:${RESET}`)
  console.log(listPostSwaps)
  console.log(`${BLUE}List Lock Swaps:${RESET}`)
  console.log(listLockSwaps)

                    // 0x10000000271080100000000083a413fb000000000000671b3dc7afd522afd522
  const postSwap = '0x10000000271080100000000083a413fb000000000000671b3dc7afd522afd522'
  console.log(new Uint8Array([
    ...bcs.vector(bcs.U8, { length: 32 }).serialize(Buffer.from(postSwap.slice(2), 'hex')).toBytes(),
    ...encoder.encode('vector<u8>'),
  ]))
  const keyPostSwap = '0x' + sha3_256(new Uint8Array([
    ...bcs.vector(bcs.U8, { length: 32 }).serialize(Buffer.from(postSwap.slice(2), 'hex')).toBytes(),
    ...encoder.encode('vector<u8>'),
  ]))
  const resultPostSwap = await client.getStates({
    accessPath: `/fields/${tableInfo.posted_swaps}/${keyPostSwap}`,
    stateOption: { decode: true },
  })
  console.log(`${BLUE}Post Swap:${RESET}`)
  console.log(resultPostSwap)
  console.log()


  // ====================================================================================
  const storeForCoinType = `${process.env.HEX_ADDRESS}::MesonStates::StoreForCoin<0x3::gas_coin::RGas>`

  const storeForCoin = await client.getStates({
    accessPath: `/resource/${process.env.HEX_ADDRESS}/${storeForCoinType}`,
    stateOption: { decode: true },
  })

  const tableInfoStoreForCoin = {}
  for (const [k, v] of Object.entries(storeForCoin[0].decoded_value.value.value.value)) {
    tableInfoStoreForCoin[k] = v.value.handle.value.id
  }
  console.log(`${BLUE}Table Information (Store for Coin):${RESET}`)
  console.log(tableInfoStoreForCoin)

  const keyInPoolCoins = '0x' + sha3_256(new Uint8Array([
    ...bcs.u64().serialize(15).toBytes(), ...encoder.encode('u64'),
  ]))
  const resultInPoolCoins = await client.getStates({
    accessPath: `/fields/${tableInfoStoreForCoin.in_pool_coins}/${keyInPoolCoins}`,
    stateOption: { decode: true },
  })
  const coinObjectId = resultInPoolCoins[0].decoded_value.value.value.value.id
  console.log(`${BLUE}Coin Object ID:${RESET} ${coinObjectId}`)

  const coinObject = await client.queryObjectStates({
    filter: { object_id: coinObjectId }, queryOption: { decode: true },
  })
  console.log(`${BLUE}Coin Object Balance:${RESET} ${
    coinObject.data[0].decoded_value.value.balance.value.value / 1e8
  } $ROOCH`)

}

main()