import RootLayout from "@/app/layout";
import Link from "next/link";

const restaurants = [
    { "name": "Subway", "rating": "4.3", "next":"1"}, 
    { "name": "McDonald\'s", "rating": "3.6", "next":"2"}, 
    { "name": "Applebee\'s", "rating": "4.8", "next":""}
];

export default function Page({ params }: { params: { id: number }}) {
    const restaurant = restaurants[params.id as keyof object];
    return (
        <RootLayout>
            <h1>This is the suggestions page:</h1>
            <h2>Name: { restaurant.name }</h2>
            <h2>Rating: { restaurant.rating }</h2>
            <Link href={`/suggestions/${restaurant.next}`}>Get another suggeestion</Link>
        </RootLayout>
    );
}