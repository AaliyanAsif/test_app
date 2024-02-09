import "../style.css";
import DraggableList from "react-draggable-list";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function DragableList() {
  const { state } = useLocation();
  const { groupID, subGroupID } = state;

  const [subGroups, setSubGroups] = useState([]);
  const [account, setAccounts] = useState([]);

  const [list, setList] = useState([]);

  const subGroupEndPoint = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/subGroup/group/${groupID}`;

  const accountEndPoint = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/account/subGroupId/${subGroupID}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(subGroupEndPoint);
        // console.log("Data:", response.data);
        setSubGroups(response.data.subGroups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [subGroupEndPoint]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(accountEndPoint);
        // console.log("Data:", response.data);
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [accountEndPoint]);

  useEffect(() => {
    // Map the fetched data to the desired format

    if (subGroups !== undefined) {
      const data1 = subGroups?.map((item) => ({
        id: item._id,
        name: item.name,
      }));

      // Set the mapped data to the state
      setList(data1);
    } else {
      const data1 = account?.map((item) => ({
        id: item._id,
        name: item.name,
      }));

      // Set the mapped data to the state
      setList(data1);
    }
  }, [subGroups, account]);

  const containerRef = useRef();

  const _onListChange = (newList) => {
    setList(newList);
    console.log(newList);

    const newListID = newList.map((item) => item.id);
    console.log(newListID);

    if (subGroups !== undefined) {
      const updateSubgroub = async () => {
        try {
          const apiUrl = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/account/updateSubGroupsOrderInGroup/${groupID}`;

          console.log("log", apiUrl);
          // Make a POST request with Axios
          const response = await axios.put(apiUrl, { subgroupIds: newListID });

          // Handle the response as needed
          console.log("Server response:", response.data);
        } catch (error) {
          // Handle errors
          console.error("Error updating items:", error);
        }
      };
      updateSubgroub();
    } else {
      const updateAccounts = async () => {
        try {
          const apiUrl = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/account/updateAccountOrder/${subGroupID}`;

          console.log("log", apiUrl);
          // Make a POST request with Axios
          const response = await axios.put(apiUrl, { accountIds: newListID });

          // Handle the response as needed
          console.log("Server response:", response.data);
        } catch (error) {
          // Handle errors
          console.error("Error updating items:", error);
        }
      };
      updateAccounts();
    }
  };

  const Item = ({ item, itemSelected, dragHandleProps }) => {
    const { onMouseDown, onTouchStart } = dragHandleProps;

    return (
      <div
        className="disable-select"
        style={{
          border: "1px solid black",
          margin: "4px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
          background: "#fff",
          userSelect: "none",
        }}
      >
        {item.name}
        <div
          className="disable-select dragHandle"
          style={{
            fontWeight: "600",
            transform: "rotate(90deg)",
            width: "20px",
            height: "20px",
            backgroundColor: "black",
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            console.log("touchStart");
            e.target.style.backgroundColor = "blue";
            document.body.style.overflow = "hidden";
            onTouchStart(e);
          }}
          onMouseDown={(e) => {
            console.log("mouseDown");
            document.body.style.overflow = "hidden";
            onMouseDown(e);
          }}
          onTouchEnd={(e) => {
            e.target.style.backgroundColor = "black";
            document.body.style.overflow = "visible";
          }}
          onMouseUp={() => {
            document.body.style.overflow = "visible";
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="App">
      <div
        ref={containerRef}
        style={{ touchAction: "pan-y", background: "beige" }}
      >
        <Link to="/">
          <button>Back</button>
        </Link>
        <DraggableList
          itemKey="id"
          template={Item}
          list={list}
          onMoveEnd={(newList) => _onListChange(newList)}
          container={() => containerRef.current}
        />
      </div>
    </div>
  );
}
