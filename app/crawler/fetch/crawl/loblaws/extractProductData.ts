import removeHtmlTags from "../../../../common/helpers/removeHtmlTags";
import { IProductProps } from "../../../../common/types/common/product";
import { AllStoreChainBrands } from "../../../../common/types/common/store";
import {
	ILoblawsAllFoodProps,
	LoblawsChainAlternateName,
	LoblawsChainName,
} from "../../../../common/types/loblaws/loblaws";

export interface IExtractProductDataProps {
	productTiles: ILoblawsAllFoodProps[];
	pagination: {
		pageNumber: number;
		pageSize: number;
		hasMore: boolean;
		totalResults: number;
	};
}

const extractProductData = (
	data: IExtractProductDataProps,
	chainName: LoblawsChainName,
	store_num: string
): IProductProps[] => {
	return data.productTiles.map((product: ILoblawsAllFoodProps) => {
		return {
			product_num: product.productId,
			product_name: product.title,
			store_num,
			chain_brand: AllStoreChainBrands.loblaws,
			chain_name: chainName, // loblaw not loblaws
			product_brand: product.brand || "",
			product_link:
				`https://www.${LoblawsChainAlternateName(
					chainName
				)}.ca${product?.link}` || "",
			product_image:
				product?.productImage[0]?.imageUrl ||
				product?.productImage.filter(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(image: any) => image?.imageUrl !== null
				)[0]?.imageUrl ||
				"",
			description: removeHtmlTags(product.description || "N/A"),
			product_size_unit: product.uom,
			// product_size_quantity: product[i].packageSizing,
			product_size_quantity: 1,

			unit_soldby_type: product.pricingUnits.type,
			unit_soldby_unit: product.pricingUnits.unit,
			price: Number(product.pricing.price),
			price_unit: product.pricingUnits.unit,
			price_was: product.pricing.wasPrice,
			price_was_unit: "",
			compare_price: 1,
			compare_price_unit: "",
			compare_price_quantity: 1,
		};
	});
};

export default extractProductData;
