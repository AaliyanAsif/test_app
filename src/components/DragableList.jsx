import "../style.css";
import DraggableList from "react-draggable-list";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const data = Array(10)
  .fill(null)
  .map((item, index) => ({ id: index, name: "xyz" }));

export default function DragableList() {
  const { state } = useLocation();
  const { groupID, subGroupID } = state;

  const [subGroups, setSubGroups] = useState([]);
  const [account, setAccounts] = useState([]);

  const [subGroupNames, setSubGroupNames] = useState([]);
  const [accountNames, setAccountNames] = useState([]);

  const subGroupEndPoint = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/subGroup/group/${groupID}`;

  const accountEndPoint = `https://dolphin-app-pr7kk.ondigitalocean.app/api/settings/balancesheet/account/subGroupId/${subGroupID}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(subGroupEndPoint);
        console.log("Data:", response.data);
        setSubGroups(response.data.subGroups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(accountEndPoint);
        console.log("Data:", response.data);
        // console.log(response.data.accounts);
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const data1 = subGroups?.map((item, index) => ({
    id: item._id,
    name: item.name,
  }));
  console.log(data1);
  const [list, setList] = useState(data);
  const containerRef = useRef();

  const _onListChange = (newList) => {
    console.log(newList);
    setList(newList);
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
        {/* {subGroups?.map((subgroup) => (
          <h1>{subgroup.name}</h1>
        ))}

        {account?.map((account) => (
          <h1>{account.name}</h1>
        ))} */}

        <DraggableList
          itemKey="id"
          template={Item}
          list={list}
          onMoveEnd={(newList) => _onListChange(newList)}
          container={() => containerRef.current}
        />
        {console.log(groupID, subGroupID)}
      </div>
    </div>
  );
}
