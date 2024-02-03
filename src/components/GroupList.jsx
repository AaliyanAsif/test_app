import React, { useEffect, useState } from "react";
import { data } from "../data";
import axios from "axios";

import SubgroubList from "./SubgroubList";
const endPoint =
  "https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/group/chartOfAccount";

export default function GroupList() {
  const [data, setData] = useState([]);

  // Function to fetch data using Axios GET request
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(endPoint);
  //     console.log("Data:", response.data);
  //     setData(response.data.chartOfAccounts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // Use useEffect to call fetchData when the component mounts
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
  }, []); // Th

  // const { id: groupID, name: groupName, subgroup } = group;

  // const { name, subGroups } = data;
  return (
    <div>
      {console.log(data)}
      {/* {console.log(data[0].name)} */}
      {/* {console.log(data[0].subGroups[0])} */}
      {/* {console.log(data[0].subGroups[0].name)} */}
      {/* {console.log(data[0].subGroups[0].accounts[0])} */}
      {/* {console.log(data[0].subGroups)} */}
      {/* {console.log(data[0].subGroups[0].name)} */}
      {/* {console.log(data[0].subGroups[0].accounts)} */}

      <h1 className="text-4xl my-10">
        {data.map((group, index) => (
          <div>
            <h1 key={index}>{group.name} </h1>
            <SubgroubList subgroup={group.subGroups} />
          </div>
        ))}
      </h1>
    </div>
  );
}
