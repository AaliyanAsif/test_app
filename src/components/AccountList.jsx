import React from "react";
import { AiOutlineArrowsAlt } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function AccountList({ account }) {
  const navigate = useNavigate();

  // Sort accounts based on the "order" attribute
  const sortedAccounts = account.sort((a, b) => a.order - b.order);

  return (
    <div>
      {sortedAccounts.map((account, index) => (
        <div key={index} className="flex">
          <p className="text-[#374962] font-medium text-xl mb-5 ml-14 flex-grow">
            {account.name}
          </p>

          <button
            onClick={() =>
              navigate("dragList", {
                state: { subGroupID: account.subGroup },
              })
            }
          >
            <AiOutlineArrowsAlt className="mr-[400px]" />
          </button>
        </div>
      ))}
    </div>
  );
}
