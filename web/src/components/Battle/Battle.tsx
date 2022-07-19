import { useQuery } from "react-query";
import { getMobs } from "api/endpoints";

const Battle = () => {
  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  return (
    <div>
      <h2>Battle</h2>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Map</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="admin__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>{mob.map.name}</td>
            <td>
              <button onClick={() => {}}>Fight</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Battle;
