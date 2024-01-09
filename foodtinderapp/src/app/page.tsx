import Link from "next/link";

export default function Home() {
  const tinderImg = 'https://static.vecteezy.com/system/resources/previews/018/910/833/original/tinder-app-logo-tinder-app-icon-free-free-vector.jpg';
  const burgerImg = 'https://static.vecteezy.com/system/resources/previews/007/890/977/original/burger-logo-for-fast-food-business-free-vector.jpg';

  return (
    <div className="center">
      <h1>Welcome to foodtinder</h1>
      <div className="grid-container">
        <div>
          <img src={tinderImg} className="logo" />
        </div>
        <div>
          <img src={burgerImg} className="logo" />
        </div>
      </div>
      <Link href={`/suggestions/0`}>Get suggestions</Link>
    </div>
  );
}
