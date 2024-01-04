import RootLayout from "@/app/layout";
import Link from "next/link";
import { getRestaurants } from "../../utils";

export const revalidate = 3600

export default async function Page({ params }: { params: { id: number }}) {
    const next_id = +params.id + +1;
    const restaurants = await getRestaurants();

    if (params.id >= restaurants.length) return <h1>No more suggestions</h1>;

    const restaurant = restaurants[params.id];

    return (
        <RootLayout>
            <h1>Suggestions page:</h1>
            <h2>Name: { restaurant.place_name }</h2>
            <h2>Rating: { restaurant.rating }</h2>
            <h2>Num of Ratings: { restaurant.user_ratings_total }</h2>
            <h2>Address: { restaurant.vicinity }</h2>
            <h2>Price Level ($): { restaurant.price_level }</h2>
            <h2>Google Place ID: { restaurant.place_id }</h2>
            <Link href={`/suggestions/` + `${next_id}`}>Get another suggeestion</Link>
        </RootLayout>
    );
}