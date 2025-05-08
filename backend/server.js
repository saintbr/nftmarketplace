require("dotenv").config();
const path = require('path'); 

const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { Web3Storage, File } = require('web3.storage');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = require('./abi/ExeedMeNFT.json');
const { networkInterfaces } = require("os");
const {parseEther} = require("ethers/lib/utils");
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

const storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

async function uploadMetadata(name, imageCid) {
    const metadata = {
        name,
        description: `NFT de ${name}`,
        image: `ipfs://${imageCid}`
    };
    const buffer = Buffer.from(JSON.stringify(metadata));
    const file = new File([buffer], 'metadata.json');
    const cid = await storage.put([file]);
    return `ipfs://${cid}/metadata.json`;
}

contract.on('Purchase', async (buyer, amount, id, uri) => {
    console.log(`purchase id: ${id} of ${buyer}, price: ${ethers.utils.formatEther(amount)} file: ${uri}`);

    const approved = Math.random() < 0.7;

    if (approved) {
        // const imageFile = new File([fs.readFileSync('./assets/item.png')], 'item.png');
        // const imageCid = await storage.put([imageFile]);
        // const metadataUri = await uploadMetadata('Item Exclusivo', imageCid + '/item.png');

        const tx = await contract.mint(buyer, uri);
        await tx.wait();
        console.log(`NFT minted for ${buyer}`);
    } else {
        const tx = await contract.refund(buyer, parseEther('0.01'));
        await tx.wait();
        console.log(`purchase denied, charge back to ${buyer}`);
    }
});

app.get('/', (_, res) => res.send('API Web3 NFT'));

app.get('/nfts', (req, res) => {
    fs.readFile(path.join(__dirname, 'nfts.json'), 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).send('Erro ao ler o arquivo JSON');
      }
      res.json(JSON.parse(data));
    });
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));