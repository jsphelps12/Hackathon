import fs from 'fs';
import csvParser from 'csv-parser';
import { cache } from 'react';

const filePath = '../googleJsonResult.csv';

interface Restaurant {
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

export const getRestaurants = cache(async () => {
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
    return restaurants;
});