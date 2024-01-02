import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>Welcome to foodtinder</h2>
      <Link href={`/suggestions/0`}>Get suggestions</Link>
    </div>
  );
}
