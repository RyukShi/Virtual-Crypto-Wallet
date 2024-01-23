import type { Asset } from "@/stores/api-store"

export const getToAssetAmount = (fromAssetAmount: number, fromAsset: Asset, toAsset: Asset) => {
    return (fromAsset.price_usd * fromAssetAmount) / toAsset.price_usd
}
