# Add support token
rooch move run --function 0xb072a8901831f11fb096aa53bbcebc9d5bf7d503d1ac52c911db7a4bcf3c51e2::MesonStates::addSupportToken --args u8:34 --type-args 0x3::gas_coin::RGas

# Register pool index
rooch move run --function 0xb072a8901831f11fb096aa53bbcebc9d5bf7d503d1ac52c911db7a4bcf3c51e2::MesonPools::depositAndRegister --args 300u64 --args 15u64 --type-args 0x3::gas_coin::RGas

# Post swap
# public entry fun postSwapFromInitiator<CoinType: key + store>(
#         sender: &signer,
#         encoded_swap: vector<u8>,
#         initiator: vector<u8>, // an eth address of (20 bytes), the signer to sign for release
#         pool_index: u64,
#     )
rooch move run --function 0xb072a8901831f11fb096aa53bbcebc9d5bf7d503d1ac52c911db7a4bcf3c51e2::MesonSwap::postSwapFromInitiator --args 'vector<u8>:1,0,0,0,39,16,128,16,0,0,0,0,131,164,19,251,0,0,0,0,0,0,103,27,61,199,175,213,34,175,213,34' --args 'vector<u8>:0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0' --args 15u64 --type-args 0x3::gas_coin::RGas




# Args Example
# `address:0x1 bool:true u8:0 u256:1234 'vector<u32>:a,b,c,d'` 
#  address and uint can be written in short form like `@0x1 1u8 4123u256`.