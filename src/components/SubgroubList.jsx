import React from "react";
import { AiOutlineArrowsAlt } from "react-icons/ai";
import AccountList from "./AccountList";
import { Link, useNavigate } from "react-router-dom";

export default function SubgroubList({ subgroup, groupID }) {
  const navigate = useNavigate();

  return (
    <div>
      {subgroup.map((subgroup, index) => {
        return (
          <div key={index}>
            <div className=" flex ">
              <h3 className="text-[#374962] text-2xl font-medium ml-5 mb-5 flex-grow ">
                {subgroup.name}
                {groupID}
              </h3>
              <div>
                {/* <Link to={{ pathname: "dragList", state: dataToPass }}> */}
                <button
                  onClick={() =>
                    navigate("dragList", {
                      state: { groupID: groupID },
                    })
                  }
                >
                  <AiOutlineArrowsAlt className="mr-[400px]" />
                </button>
                {/* </Link> */}
              </div>
            </div>

            <div>
              <AccountList account={subgroup.accounts} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
