import React from "react";
import EmptyState from "../components/EmptyState";

const Users = () => {
  return (
    <div className="hidden lg:block lg:pl-80 xl:pl-96 h-full transition-all duration-200">
      <EmptyState />
    </div>
  );
};

export default Users;
