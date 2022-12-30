import React from "react";

export const UserContext = React.createContext("");

export default function App() {
  return (
    <UserContext.Provider value="Reed">
      <User />
    </UserContext.Provider>
  );
}

function User() {
  return (
    <UserContext.Consumer>
      {(value) => <h1>{value}</h1>}
      {/* prints: Reed */}
    </UserContext.Consumer>
  );
}
