import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FieldingStats, HittingStats, PitchingStats } from "../utils/types";
import { DropdownCard } from "../components/DropdownCard";
import { StatItem } from "../components/StatItem";
import { ProfileContext } from "../contexts/ProfileContext";

export function Stats() {
  const { id } = useParams();
  const [stats, setStats] = useState<{
    Hitting: HittingStats;
    Pitching: PitchingStats;
    Fielding: FieldingStats;
  } | null>(null);

  const { type } = useContext(ProfileContext)!;

  useEffect(() => {
    const url = `https://mlbee-backend-608818802454.asia-south1.run.app/${type}/${id}/stats`;

    let ignore = false;

    async function getStats() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        setStats(data);
      }
    }

    getStats();

    return () => {
      ignore = true;
    };
  }, [id, type]);

  if (!stats) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {Object.entries(stats).map(([type, stats], index) => (
        <DropdownCard key={index} title={type}>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats).map(([key, value], index) => (
              <StatItem key={index} label={key} value={value} />
            ))}
          </div>
        </DropdownCard>
      ))}
    </div>
  );
}
