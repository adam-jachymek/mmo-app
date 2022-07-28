import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getExplore } from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ExploreScreen = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const { data: exploreData, refetch: refetchExplore } = useQuery(
    ["getExplore", id],
    () => getExplore(id)
  );

  useEffect(() => {
    if (exploreData?.mobId) {
      navigate(`/battle/${exploreData.id}`, { replace: true });
    }
  }, [exploreData]);

  return (
    <div>
      <div>{exploreData?.title}</div>
      <button
        onClick={() => {
          refetchExplore();
        }}
      >
        GO
      </button>
    </div>
  );
};

export default ExploreScreen;
