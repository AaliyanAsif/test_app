import React, { useEffect, useState } from "react";
import axios from "axios";

import SubgroubList from "./SubgroubList";
const endPoint =
  "https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/group/chartOfAccount";

export default function GroupList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endPoint);
        console.log("Data:", response.data);
        setData(response.data.chartOfAccounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fbfbfb] p-6">
      {data.map((group, index) => (
        <div key={index}>
          <h1 className="text-[#d5a85d] font-medium text-4xl my-5" key={index}>
            {group.name}{" "}
          </h1>
          <SubgroubList subgroup={group.subGroups} groupID={group._id} />
        </div>
      ))}
    </div>
  );
}
