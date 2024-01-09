import fs from 'fs';
import csvParser from 'csv-parser';
// @ts-ignore
import cosineSimilarity from 'cosine-similarity';
import { cache } from 'react';

const filePath = '../googleJsonResult.csv';
export const restaurantIds = [
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

export interface Restaurant {
  name: string;
  place_name: string;
  photos__photo_reference: string;
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

export const getSortedRecommendations = () => {
  // Get recommendations for a specific user (replace '1' with the user ID you want recommendations for)
  const recommendations: [number, number][] = getUserRecommendations(1, userSimilarityMatrix, userItemMatrix);
  const rec_ids: string[] = [];
  recommendations.forEach(([item, rating]) => {
    // console.log(`Item${item}: ${rating.toFixed(2)}`);
    rec_ids.push(restaurantIds[item]);
  });
  return rec_ids;
}

// Mock user-item matrix (to be replaced w mock data from supabase)
const userItemMatrix: number[][] = [
  [5, 4, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],  // Ratings for items by User1
  [0, 0, 3, 4, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // Ratings for items by User2
  [5, 0, 4, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // Ratings for items by User3
  [0, 5, 0, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],  // Ratings for items by User4
  [0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],  // Ratings for items by User5
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 0, 0, 3, 0],  // Ratings for items by User6
];

// Function to calculate cosine similarity matrix between users
function calculateUserSimilarityMatrix(matrix: number[][]): number[][] {
  const similarityMatrix: number[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    similarityMatrix[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      similarityMatrix[i][j] = cosineSimilarity(matrix[i], matrix[j]);
    }
  }
  return similarityMatrix;
}

// Calculate user similarity matrix
const userSimilarityMatrix: number[][] = calculateUserSimilarityMatrix(userItemMatrix);

// Function to generate recommendations for a target user
function getUserRecommendations(
  userId: number,
  similarityMatrix: number[][],
  userItemMatrix: number[][]
): [number, number][] {
  const similarUsers = similarityMatrix[userId - 1]
    .map((similarity, index) => ({ userId: index + 1, similarity }))
    .sort((a, b) => b.similarity - a.similarity);

  const userRatings = userItemMatrix[userId - 1];

  const recommendations: [number, number][] = [];
  for (let itemIndex = 0; itemIndex < userRatings.length; itemIndex++) {
    if (userRatings[itemIndex] === 0) {
      let itemRating = 0;
      let totalSimilarity = 0;
      for (const similarUser of similarUsers) {
        const similarUserRating = userItemMatrix[similarUser.userId - 1][itemIndex];
        if (similarUserRating !== 0) {
          itemRating += similarUserRating * similarUser.similarity;
          totalSimilarity += similarUser.similarity;
        }
      }
      if (totalSimilarity > 0) {
        recommendations.push([itemIndex, itemRating / totalSimilarity]);
      }
    }
  }

  return recommendations.sort((a, b) => b[1] - a[1]);
}