const { getRoochNodeUrl, RoochClient, Secp256k1Keypair } = require("@roochnetwork/rooch-sdk")
require('dotenv').config()

const main = async () => {
  const client = new RoochClient({
    url: getRoochNodeUrl('testnet'),
  })

  const generalStoreType = '0x7bc31de9066a4d2a05bbda68ab2501fdc07af83dc4daecd9d5e03739d47c8df0::MesonStates::GeneralStore'

  const b1 = await client.getBalance({
    owner: 'rooch12tu82p9ld5487s3uuuue3ffn88yeq2m0dzqex9ujxufcwq0yxpjsstd3qt',
    coinType: '0x3::gas_coin::RGas',
  })
  console.log(b1.balance / 1e8)

  const b2 = await client.queryObjectStates({
    // filter: { object_id: '' }
    filter: { owner: 'rooch100p3m6gxdfxj5pdmmf52kfgplhq847pacndwekw4uqmnn4ru3hcqu2vfaf' }
  })
  console.log(b2.data.length)

  const b3 = await client.getStates({
    accessPath: '/resource/0x7bc31de9066a4d2a05bbda68ab2501fdc07af83dc4daecd9d5e03739d47c8df0/' + generalStoreType,
    stateOption: { decode: true },
  })
  // console.log(b3[0].decoded_value.value.value)

  const d = b3[0].decoded_value.value.value.value
  console.log(d.pool_owners.value.handle.value.id)

  const b4 = await client.queryObjectStates({
    // filter: { object_id: '0xbd087e45f4b2f922e595b68ff3809e4231b5b1f11610e7c2c6c0736dfd0b1641' }, // Pool Owners
    filter: { object_id: '0x4b3bb2e8a252a147c700f356c718ea64215632e6f832629fef1727b03e663b1b' },    // Supported Coins
  })
  console.log(b4)

  // const keypair = Secp256k1Keypair.deriveKeypair(process.env.MNEMONIC)
  // console.log(keypair)

  const b5 = await client.getStates({
    accessPath: '/table/table_handle/0x4b3bb2e8a252a147c700f356c718ea64215632e6f832629fef1727b03e663b1b'
  })


}

main()