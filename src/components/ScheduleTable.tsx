import { Link } from "react-router-dom";
import { Game } from "../utils/types";

export default function ScheduleTable({ games }: { games: Game[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-dark1">
      <table className="min-w-full table-auto">
        <thead className="bg-dark1">
          <tr>
            <th className="p-3 text-left text-sm font-semibold text-light5">
              HOME TEAM
            </th>
            <th className="p-3 text-left text-sm font-semibold text-light5">
              AWAY TEAM
            </th>
            <th className="p-3 text-left text-sm font-semibold text-light5">
              DATE
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light5/35">
          {games.map((game) => (
            <tr
              key={game.gamePk}
              className="text-sm hover:bg-dark1/40 transition-colors duration-200"
            >
              <td className="px-3 py-4 text-light1 font-medium">
                <Link
                  to={`/teams/${game.homeTeamId}`}
                  className="flex items-center gap-2"
                >
                  <img
                    className="w-5 h-5"
                    src={`https://www.mlbstatic.com/team-logos/${game.homeTeamId}.svg`}
                  />
                  {game.homeTeam}
                </Link>
              </td>
              <td className="px-3 py-4 text-light1 font-medium">
                <Link
                  to={`/teams/${game.awayTeamId}`}
                  className="flex items-center gap-2"
                >
                  <img
                    className="w-5 h-5"
                    src={`https://www.mlbstatic.com/team-logos/${game.awayTeamId}.svg`}
                  />
                  {game.awayTeam}
                </Link>
              </td>
              <td className="px-3 py-4 text-sm text-light3">
                {formatDate(game.gameDate)}
              </td>
            </tr>
          ))}

          {games.length === 0 && (
            <tr>
              <td colSpan={3} className="p-3 text-center text-light3">
                No games found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
