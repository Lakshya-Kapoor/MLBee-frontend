import { ChangeEvent, useState } from "react";
import SearchInput from "./SearchInput";
import TeamResults from "./TeamResults";
import PlayerResults from "./PlayerResults";
import ArticleSlider from "./ArticleSlider";

export default function Search() {
  const [text, setText] = useState("");
  const [results, setResults] = useState({
    teams: [],
    players: [],
    articles: [],
  });

  async function searchFunction(text: string) {
    const urls = [
      `https://mlbee-backend-608818802454.asia-south1.run.app/teams?name=${text}&limit=5`,
      `https://mlbee-backend-608818802454.asia-south1.run.app/players?name=${text}&limit=5`,
      `https://mlbee-backend-608818802454.asia-south1.run.app/articles/search?query=${text}`,
    ];

    const requests = urls.map(async (url) =>
      fetch(url).then((res) => res.json())
    );
    const responses = await Promise.all(requests);
    setResults({
      teams: responses[0],
      players: responses[1],
      articles: responses[2]["title_match_articles"],
    });
  }

  async function searchChange(e: ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setText(text);
    if (text === "") {
      setResults({ teams: [], players: [], articles: [] });
      return;
    }

    await searchFunction(text);
  }

  return (
    <div>
      <SearchInput value={text} onChange={async (e) => await searchChange(e)} />
      <div className="mt-12 grid grid-cols-2">
        {results.teams.length > 0 && <TeamResults teams={results.teams} />}
        {results.players.length > 0 && (
          <PlayerResults players={results.players} />
        )}
        {(results.teams.length > 0 || results.players.length > 0) &&
          results.articles.length > 0 && (
            <span className="col-span-2 bg-dark1 h-[2px] my-5" />
          )}
        {results.articles.length > 0 && (
          <ArticleResults articles={results.articles} />
        )}
      </div>
    </div>
  );
}

function ArticleResults({ articles }) {
  return (
    <div className="col-span-2">
      <h3 className="text-2xl text-light5 font-semibold mb-5">Articles</h3>
      <ArticleSlider articles={articles} />
    </div>
  );
}
