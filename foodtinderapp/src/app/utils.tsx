import fs from 'fs';
import csvParser from 'csv-parser';
import { cache } from 'react';

const filePath = '../googleJsonResult.csv';

export interface Restaurant {
  name: string;
  place_name: string;
  photos_photo_reference: string;
  place_id: string;
  plus_code__compound_code: string;
  price_level: string;
  rating: string;
  user_ratings_total: string;
  vicinity: string;
}

export const getRestaurantsById = cache(async () => {
    let csv_data: Restaurant[] = [];
    
    const restaurants: Restaurant[] = await new Promise((resolve, reject) => {
        const rows: Restaurant[] = [];
    
        const stream = fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row: Restaurant) => {
            rows.push(row);
          })
          .on('end', () => {
            // Assign the read CSV data to the csv_data variable
            csv_data = rows;
            console.log('CSV file read successfully!');
            resolve(csv_data);
          })
          .on('error', (err: any) => {
            console.error('Error while reading CSV:', err);
            reject(err);
          });
    
        stream.on('error', (err: any) => {
          console.error('Error in stream:', err);
          reject(err);
        });
    });
    const map: Map<string, Restaurant> = new Map<string, Restaurant>();
    restaurants.forEach((row) => map.set(row.place_id, row));

    return map;
});

export const getRecommendedRestaurantList = () => {
  // mock list of restaurants
  return [
    "ChIJXdxV_FEFlVQR-jNsGKb7cVI",
    "ChIJ1ZscbbsalVQRSbgiD4VyVvU",
    "ChIJf7Hdiu0PlVQRVY3EvQz9IG0",
    "ChIJj-5sBU4FlVQRFdFemOmd4fo",
    "ChIJ2WrLURcQlVQRikqa0hiFEDE",
    "ChIJUXjP06QalVQR1ip77-vRHGA",
    "ChIJUUJE66IalVQRqTwGMC449Kg",
    "ChIJAw3f_VEFlVQR5Hd6s3YL3pQ",
    "ChIJxzL2CVEFlVQRcoupdvRsOl4",
    "ChIJi7RS308FlVQRLnZXH_KyOSM",
    "ChIJj8p0hIcPlVQRHZTxzjpTj-0",
    "ChIJyyLqLlAFlVQRak01OCytghs",
    "ChIJlWJILVAFlVQRn5d6F0aEBeo",
    "ChIJyyLqLlAFlVQRCnEd-YPKctk",
    "ChIJn4XNyagalVQRywI8ysKemTE",
    "ChIJ-UJwUBcQlVQReQvFgVNkyN0",
    "ChIJzZtgsRAQlVQRD8IRi3qYy2g",
    "ChIJvTg6URcQlVQRel-EsQdUzDo",
    "ChIJd7IqhIcPlVQRGajeeAhT338",
    "ChIJATd2hIcPlVQRQ_89XoSedA8"
  ];
}