import { useContext, useEffect, useState } from "react";
import { ArticleData } from "../utils/types";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { ArrowBigDown, ArrowBigUp, Clock, Tag as TagIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [reaction, setReaction] = useState<"upvote" | "downvote" | null>(null);
  const { userToken } = useContext(AuthContext)!;

  useEffect(() => {
    const url = `https://mlbee-backend-608818802454.asia-south1.run.app/articles/${id}`;

    let ignore = false;

    async function fetchData() {
      const response = await fetch(url);
      const data = await response.json();
      if (!ignore) {
        setArticle(data);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [id]);

  function handleReaction(react: "upvote" | "downvote") {
    if (!userToken) {
      alert("Login to react");
      return;
    }

    if (react === reaction) {
      setReaction(null);
      return;
    }
    setReaction(react);
    const url = `https://mlbee-backend-608818802454.asia-south1.run.app/articles/reaction?articleId=${id}&reactionType=`;
    if (react == "upvote") {
      fetch(url + "upVotes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    } else {
      fetch(url + "downVotes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    }
  }

  if (!article) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <article className=" p-6 bg-dark3 rounded-lg shadow-xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-light1 mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-light3 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                Published: {format(article.uploadDate, "MMM dd, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
              >
                <TagIcon size={14} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div>
          <p className="text-xl text-light5 mb-8 border-l-[6px] rounded-l-lg border-light5 pl-3">
            {article.description}
          </p>
          <ReactMarkdown className="markdown-content text-light2">
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
      <div className="bg-dark1 w-32 flex justify-between items-center rounded-full gap-3 text-light4">
        <button
          className="p-2 hover:bg-dark3 rounded-full"
          onClick={() => handleReaction("upvote")}
        >
          <ArrowBigUp
            size={24}
            className={`${reaction === "upvote" && "text-emerald-500"}`}
          />
        </button>
        <p className="font-bold text-xl">{article.reactions.upVotes}</p>
        <button
          className="p-2 hover:bg-dark3 rounded-full"
          onClick={() => handleReaction("downvote")}
        >
          <ArrowBigDown
            size={24}
            className={`${reaction === "downvote" && "text-red-500"}`}
          />
        </button>
      </div>
    </div>
  );
}
