const express = require('express');
const app = express();
const cors = require('cors');
const { ethers } = require('ethers');
const NftMarketplaceABI = require('./constants/NftMarketplace.json');
const NftMarketplace = require('./models/NftMarketplace');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const contractAddressesLocation = './constants/networkMapping.json';
const chainId = 4;

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA);

let private = process.env.PRIVATE_KEY;

let wallet = new ethers.Wallet(private, provider);

const contractAddresses = JSON.parse(
  fs.readFileSync(contractAddressesLocation, 'utf-8')
);

const totalLength = contractAddresses[chainId]['NftMarketplace'].length;

const nftMarketplaceAddress =
  contractAddresses[chainId]['NftMarketplace'][totalLength - 1];

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const Contract = new ethers.Contract(
  nftMarketplaceAddress,
  NftMarketplaceABI,
  wallet
);

app.listen(PORT, () => {
  Contract.on(
    'ItemListed',
    async (seller, nftAddress, tokenId, price, action) => {
      console.log('Item listed!');
      price = parseFloat(ethers.utils.formatUnits(price, 'ether'));
      tokenId = parseInt(tokenId.toString());
      if (action === 'list_item') {
        await NftMarketplace.insertItemListed({
          seller,
          nftAddress,
          tokenId,
          price,
        });
      } else {
        await NftMarketplace.updateItemPrice({
          seller,
          nftAddress,
          tokenId,
          price,
        });
      }
    }
  );

  Contract.on('ItemBought', async (buyer, nftAddress, tokenId, price) => {
    console.log('Item bought!');
    price = parseFloat(ethers.utils.parseEther(price));
    tokenId = parseInt(tokenId.toString());
    await NftMarketplace.updateItemSeller({
      buyer,
      nftAddress,
      tokenId,
      price,
    });
  });

  Contract.on('ItemCanceled', async (seller, nftAddress, tokenId, price) => {
    console.log('Item canceled!');
    price = parseFloat(ethers.utils.parseEther(price));
    tokenId = parseInt(tokenId.toString());
    await NftMarketplace.deleteActiveItem({
      nftAddress,
      tokenId,
      price,
      seller,
    });
  });
});
