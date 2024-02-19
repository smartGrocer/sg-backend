import UserAgent from "user-agents";
import { IProductProps } from "../../../../common/types/common/product";
import axios from "axios";

interface IGetProductProps {
	url?: string;
	product_id?: string;
	store_id: string;
	chainName: string;
}

const getProduct = async ({
	product_id,
	store_id,
	chainName,
}: IGetProductProps): Promise<IProductProps> => {
	const productData = {} as IProductProps;
	const userAgent = new UserAgent().toString();
	// format date as ddmmyyyy
	const date = new Date()
		.toISOString()
		.split("T")[0]
		.split("-")
		.reverse()
		.join("");
	const url_get = `https://api.pcexpress.ca/pcx-bff/api/v1/products/${product_id}?lang=en&date=${date}&pickupType=STORE&storeId=${store_id}&banner=${chainName}`;

	const headers = {
		"x-apikey": "C1xujSegT5j3ap3yexJjqhOfELwGKYvz",
		"Content-Type": "application/json",
		"user-agent": userAgent,
	};

	try {
		const response = await axios.get(url_get, { headers });

		const product = response.data;

		productData.product_id = product.code;
		productData.store_id = store_id;
		productData.chainName = chainName;
		productData.product_brand = product.brand;
		productData.product_name = product.name;
		productData.product_link = `https://www.${chainName}.ca${product.link}`;
		productData.product_image = pickImage(product.imageAssets);
		productData.product_size_unit = parseQuantity(product.packageSize).unit;
		productData.product_size_quantity = parseQuantity(
			product.packageSize
		).quantity;
		productData.unit_soldby_type = product.pricingUnits.type;
		productData.unit_soldby_unit = product.pricingUnits.unit;
		productData.price = product.prices.price.value;
		productData.price_unit = product.prices.price.unit;
		productData.price_was = product.prices.priceWas.value;
		productData.price_was_unit = product.prices.priceWas.unit;
		productData.compare_price = product.prices.compareAt.value;
		productData.compare_price_unit = product.prices.compareAt.unit;
		productData.compare_price_quantity = product.prices.compareAt.quantity;

		return productData;
	} catch (error: unknown) {
		console.log("Error fetching products for loblaws", error);

		if (axios.isAxiosError(error)) {
			throw new Error(
				`Error fetching products for loblaws: ${error?.response?.statusText} | ${error} | ${error?.response?.data}`
			);
		}

		throw new Error(`Error fetching products for loblaws: ${error}`);
	}
};
