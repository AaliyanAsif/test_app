import React from "react";
import { AiOutlineArrowsAlt } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
export default function AccountList({ account }) {
  const navigate = useNavigate();
  return (
    <div>
      {account.map((account, index) => (
        <div key={index} className="flex">
          <p
            className="text-[#374962] font-medium
           text-xl mb-5 ml-14 flex-grow "
          >
            {account.name}
            {console.log(account.subGroup)}
          </p>

          {/* <Link to="dragList"> */}
          <button
            onClick={() =>
              navigate("dragList", {
                state: { subGroupID: account.subGroup },
              })
            }
          >
            <AiOutlineArrowsAlt className="mr-[400px]" />
          </button>
          {/* </Link> */}
        </div>
      ))}
    </div>
  );
}
