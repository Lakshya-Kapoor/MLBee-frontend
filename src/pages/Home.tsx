import { useEffect, useState } from "react";
import { ArticleData, Game } from "../utils/types";
import ArticleSlider from "../components/ArticleSlider";
import ScheduleTable from "../components/ScheduleTable";

export default function Home() {
  const [data, setData] = useState<{
    articles: ArticleData[];
    upcomingGames: Game[];
    liveGames: Game[];
  } | null>(null);

  const [gameType, setGameType] = useState<"upcoming" | "live">("upcoming");

  useEffect(() => {
    let ignore = false;

    const urls = [
      `https://mlbee-backend-608818802454.asia-south1.run.app/articles/feed?type=popular`,
      `https://mlbee-backend-608818802454.asia-south1.run.app/schedule?gameState=future`,
      `https://mlbee-backend-608818802454.asia-south1.run.app/schedule?gameState=live`,
    ];

    async function getData() {
      const requests = urls.map(async (url) =>
        fetch(url).then((res) => res.json())
      );
      const responses = await Promise.all(requests);

      if (!ignore) {
        setData({
          articles: responses[0],
          upcomingGames: responses[1].slice(0, 5),
          liveGames: responses[2],
        });
        console.log(responses[1].slice(0, 5));
      }
    }

    getData();

    return () => {
      ignore = true;
    };
  }, []);

  if (!data) {
    return <div className="text-light1">Loading...</div>;
  }

  return (
    <div className="space-y-16">
      <div className="space-y-5">
        <h3 className="text-3xl font-semibold text-light3">
          Trending Articles
        </h3>
        <ArticleSlider articles={data.articles} />
      </div>
      <div className="space-y-5">
        <h3 className="text-3xl font-semibold text-light3">Games</h3>
        <div className="bg-dark3 p-1 rounded-full inline-flex mx-auto">
          <ScheduleButton
            gameType="upcoming"
            activeGameType={gameType}
            setActiveGameType={setGameType}
          />
          <ScheduleButton
            gameType="live"
            activeGameType={gameType}
            setActiveGameType={setGameType}
          />
        </div>
        <ScheduleTable
          games={gameType === "upcoming" ? data.upcomingGames : data.liveGames}
        />
      </div>
    </div>
  );
}

interface ScheduleButtonProps {
  gameType: "upcoming" | "live";
  activeGameType: "upcoming" | "live";
  setActiveGameType: React.Dispatch<React.SetStateAction<"upcoming" | "live">>;
}

function ScheduleButton({
  gameType,
  activeGameType,
  setActiveGameType,
}: ScheduleButtonProps) {
  return (
    <button
      onClick={() => setActiveGameType(gameType)}
      className={`px-4 py-2 rounded-full font-bold text-md transition-all duration-300 ${
        activeGameType === gameType
          ? "bg-light5 text-dark1 shadow-md"
          : "text-light4 hover:bg-dark1"
      }`}
    >
      {gameType === "live" ? "Live" : "Future"}
    </button>
  );
}
