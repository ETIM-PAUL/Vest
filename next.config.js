/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CONTRACT_ADDRESS: "0x8E2384E34D13762B61dc7a4A0f8E5F5fD6119fC6",
    ABI: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "_stakeholder",
        "outputs": [
          {
            "internalType": "address",
            "name": "stakeHolder",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "whitelisted",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "unlockedTime",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_tokenName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_tokenSymbol",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "stakeHolder",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "role",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "whitelisted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "unlockedTime",
                "type": "uint256"
              }
            ],
            "internalType": "struct Vest.Stakeholder[]",
            "name": "_stakeholders",
            "type": "tuple[]"
          }
        ],
        "name": "addOrganization",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_orgId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountToWithdraw",
            "type": "uint256"
          }
        ],
        "name": "claimTokenAsAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "organizations",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tokenName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "admin",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
}

module.exports = nextConfig
