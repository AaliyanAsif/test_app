import React from "react";
import { AiOutlineArrowsAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
export default function AccountList({ account }) {
  return (
    <div>
      {account.map((account, index) => (
        <div key={index} className="flex">
          <p className="text-[#374962] font-medium text-xl mb-5 ml-14 flex-grow ">
            {account.name}
          </p>

          <Link to="dragList">
            <AiOutlineArrowsAlt className="mr-[400px]" />
          </Link>
        </div>
      ))}
    </div>
  );
}
