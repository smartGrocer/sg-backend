import removeHtmlTags from "../../../../common/helpers/removeHtmlTags";
import { IProductProps } from "../../../../common/types/common/product";
import { AllParentCompanyList } from "../../../../common/types/common/store";
import {
	ILoblawsAllFoodProps,
	LoblawsFlagAlternateName,
	LoblawsFlagName,
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
	flagName: LoblawsFlagName,
	store_num: string
): IProductProps[] => {
	return data.productTiles.map((product: ILoblawsAllFoodProps) => {
		return {
			product_num: product.productId,
			product_name: product.title,
			store_num,
			parent_company: AllParentCompanyList.loblaws,
			flag_name: flagName, // loblaw not loblaws
			product_brand: product.brand || "",
			product_link:
				`https://www.${LoblawsFlagAlternateName(
					flagName
				)}.ca${product?.link}` || "",
			product_image:
				product?.productImage[0]?.imageUrl ||
				product?.productImage.filter(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(image: any) => image?.imageUrl !== null
				)[0]?.imageUrl ||
				"",
			description: removeHtmlTags(product.description || "N/A"),

			price: Number(product.pricing.price),
		};
	});
};

export default extractProductData;
