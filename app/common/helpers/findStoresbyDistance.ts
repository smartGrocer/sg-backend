// import { sql } from "drizzle-orm";
// import db from "../db/db";

/*
SELECT
  *,
  (
    6371 * 2 * ASIN(
      SQRT(
        POWER(SIN(RADIANS(latitude - 43.643878) / 2), 2) + COS(RADIANS(43.643878)) * COS(RADIANS(latitude)) * POWER(SIN(RADIANS(longitude - (-79.560168)) / 2), 2)
      )
    )
  ) AS distanceFromUser
FROM
  Store
WHERE
  distanceFromUser <= 10
ORDER BY
  distanceFromUser
LIMIT 10;
*/
// const findStoresbyDistance = async (
// 	latitude: number,
// 	longitude: number,
// 	distance: number
// ): Promise<> => {
// 	try {
// 		const stores = await db.execute(sql`
//             SELECT
//                 *,
//                 (
//                     6371 * 2 * ASIN(
//                         SQRT(
//                             POWER(SIN(RADIANS(latitude - ${latitude}) / 2), 2) + COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * POWER(SIN(RADIANS(longitude - ${longitude}) / 2), 2)
//                         )
//                     )
//                 ) AS distanceFromUser
//             FROM
//                 Store
//             WHERE
//                 distanceFromUser <= ${distance}
//             ORDER BY
//                 distanceFromUser
//             LIMIT 10;

//         `);

// 		return stores;
// 	} catch (e) {
// 		console.error(e);
// 		return e as Error;
// 	}
// };
