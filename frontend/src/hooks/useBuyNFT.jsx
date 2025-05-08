import {useAccount, useWaitForTransactionReceipt, useSimulateContract, useWriteContract, useWriteContractAsync } from "wagmi";
import { parseEther } from "viem";
import { abi } from '../abi'

const CONTRACT_ADDRESS = "0x6A9C6A600444c41fd86fc6A8a489C4F4eDAd7B38";
const CONTRACT_ABI = abi;

export function useBuyNFT() {
    const { address } = useAccount();
    const {
        data: hash,
        error,
        isPending,
        writeContractAsync,
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const buy = async (tokenId: string, uri: string, price: bigint) => {
        if (!address) {
            alert("connect wallet");
            return;
        }

        try {
            const result = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "buy",
                args: [tokenId, uri],
                value: parseEther('0.01'),
            });

            if (isConfirmed)
            {
                alert("NFT successfully purchased!");
            }

        } catch (err) {
            console.error(err);
            alert("something went wrong");
        }
    };

    return { buy, isPending, isConfirmed, isConfirming, error, hash };
}
