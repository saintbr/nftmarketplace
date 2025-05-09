import { useEffect, useState } from "react";
import { useBuyNFT } from "./hooks/useBuyNFT";
import {BaseError} from "viem";

type NFT = {
    "id": string;
    "collection": string;
    "purchased": boolean;
    "tx": string;
    "owner": string;
    "name": string;
    "file": string;
    "price": bigint;
};

export default function NFTGallery() {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const { buy, isPending, isConfirmed, isConfirming, error, hash } = useBuyNFT();

    useEffect(() => {
        fetch("https://nftmarketplace-lq99.onrender.com/nfts")
            .then((res) => res.json())
            .then((data: NFT[]) => setNfts(data))
            .catch((err) => console.error("Erro ao carregar NFTs", err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">NFT Marketplace</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                    <div
                        key={nft.id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center"
                    >
                        <img
                            src={nft.file}
                            alt={nft.name}
                            className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                        <h2 className="text-xl font-semibold">{nft.name}</h2>
                        <p className="text-gray-600 mb-4">Price {nft.price} ETH</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50" onClick={() => buy(nft.id, nft.file, nft.price)}
                                disabled={isPending}
                        >
                            {isPending ? "Purchasing..." : "Purchase"}

                        </button>

                    </div>
                ))}
            </div>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>
    );
}