import RootLayout from "@/app/layout";
import Link from "next/link";
import ImageDisplay from "@/app/ImageDisplay";
import { getRestaurantsById, getSortedRecommendations, Restaurant } from "../../utils";

export const revalidate = 3600

export default async function Page({ params }: { params: { id: number }}) {
    // get data needed for creating page
    const next_id = +params.id + +1;
    const restaurantsById: Map<string, Restaurant> = await getRestaurantsById();
    const restaurants = getSortedRecommendations();

    // if there are no more suggestions, return a no suggestions page
    if (params.id >= restaurants.length) return <h1>No more suggestions</h1>;

    // get restaurant and verify it isn't null
    const restaurant = restaurantsById.get(restaurants[params.id]);
    if (!restaurant) return <h1>No more suggestions</h1>;

    // url to fetch photo from google 
    const imageUrl = 'https://places.googleapis.com/v1/places/' + restaurant.place_id 
        + '/photos/' + restaurant.photos__photo_reference 
        + '/media?key=' + process.env.api_key + '&maxHeightPx=2000';
    let priceString = '';
    for (let i = 0; i < +restaurant.price_level; i++) {
        priceString = priceString + "$";
    }
    return (
        <div className="center">
            <h1 className="center">{ restaurant.place_name }</h1>
            <div className="grid-container">
                <div className="grid-child">{ restaurant.rating } Stars ({restaurant.user_ratings_total})</div>
                <div className="grid-child">Price Level: { priceString }</div>
            </div>
            <Link href={`/suggestions/` + `${next_id}`}>Get another suggeestion</Link>
            <div>
                <ImageDisplay url={imageUrl}/>
            </div>
        </div>
    );
}