import { Link } from "react-router-dom";

import "./styles.sass";

const Admin = () => {
  return (
    <div className="admin">
      <h1 className="admin__title">Admin</h1>
      <Link className="admin__category" to="items">
        Items
      </Link>
      <Link className="admin__category" to="maps">
        Maps
      </Link>
      <Link className="admin__category" to="mobs">
        Mobs
      </Link>
    </div>
  );
};

export default Admin;
