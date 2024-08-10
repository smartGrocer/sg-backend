// /**
//  * Find duplicate products in the mongoDB database that have the same product_num but different parent_company
//  * Check only parent_company that is foodbasics and metro, and set isDuplicate to true if duplicate is found
//  */

// import Product from "../../db/schema/product";
// import logger from "../../logging/logger";

// // const findDuplicateProducts = async () => {
// // 	logger.info({
// // 		message: "Finding duplicate products",
// // 		service: "findDuplicateProducts",
// // 	});

// // 	// find all products that have parent_company of foodbasics. Find 10 products at a time. Sort by createdAt in ascending order
// // 	const products = await Product.find({
// // 		parent_company: "foodbasics",
// // 		isDuplicate: false,
// // 	})
// // 		.limit(1000)
// // 		.sort({ createdAt: 1 });

// // 	logger.info({
// // 		message: `Found ${products.length} products with parent_company of foodbasics`,
// // 		service: "findDuplicateProducts",
// // 	});

// // 	if (products.length === 0) {
// // 		logger.info({
// // 			message: "No products found with parent_company of foodbasics",
// // 			service: "findDuplicateProducts",
// // 		});
// // 		return;
// // 	}

// // 	// for each product, check if there is a duplicate product with the same product_num but different parent_company
// // 	for await (const product of products) {
// // 		const duplicateProduct = await Product.findOne({
// // 			product_num: product.product_num,
// // 			parent_company: "metro",
// // 		});

// // 		// also only add the isDuplicate field if the parent_company is foodbasics
// // 		if (duplicateProduct) {
// // 			logger.info({
// // 				message: `Found duplicate products with product_num: ${product.product_num}`,
// // 				service: "findDuplicateProducts",
// // 			});

// // 			await product.updateOne({ isDuplicate: true });
// // 		} else {
// // 			logger.info({
// // 				message: `No duplicate products found with product_num: ${product.product_num}`,
// // 				service: "findDuplicateProducts",
// // 			});

// // 			await product.updateOne({ isDuplicate: false });
// // 		}
// // 	}

// // 	logger.info({
// // 		message: "Finished a batch of products",
// // 		service: "findDuplicateProducts",
// // 	});

// // 	await findDuplicateProducts();
// // };

// const findDuplicateProducts = async () => {
// 	// find all products that have parent_company of foodbasics and isDuplicate is set to false

// 	const products = await Product.find({
// 		parent_company: "foodbasics",
// 		isDuplicate: false,
// 	}).limit(1000);

// 	if (products.length === 0) {
// 		logger.info({
// 			message:
// 				"No products found with parent_company of foodbasics and isDuplicate is false",
// 			service: "findDuplicateProducts",
// 		});
// 		return;
// 	}

// 	// change all the parent_company to metro
// 	for await (const product of products) {
// 		await Product.updateMany(
// 			{ product_num: product.product_num },
// 			{ parent_company: "metro" }
// 		);

// 		logger.info({
// 			message: `Updated product_num: ${product.product_num} to metro`,
// 			service: "findDuplicateProducts",
// 		});

// 		// remove the isDuplicate field and key
// 		await Product.updateMany(
// 			{ product_num: product.product_num },
// 			{ $unset: { isDuplicate: "" } }
// 		);
// 	}

// 	logger.info({
// 		message: "Finished a batch of products",
// 		service: "findDuplicateProducts",
// 	});

// 	await findDuplicateProducts();
// };

// export default findDuplicateProducts;
