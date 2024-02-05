import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  styled,
  Grid,
  Link,
  APP_PREFIX_PATH,
  BaseUrl,
  Typography,
  Stack,
} from "../../../../../imports/index";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import "./styles.css";

import { AddButton } from "components/shared-components/Buttons/ViewCustomerButton";
import { Icon } from "@iconify/react";
import axios from "axios";

import DraggableList from "react-draggable-list";

import ErrorPop from "components/shared-components/Errors-PopUp";
import Loading from "components/shared-components/Loading";
import PrimaryNavbar from "components/shared-components/ReuseNavbars/PrimaryNavbar";
import theme from "components/shared-components/GlobalTheme";
import SkeletonTable from "components/shared-components/Skeleton";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const editlist = ["Date", "Currency", "Rate"];
const editlistObject = {};
editlist.forEach((fieldName) => {
  editlistObject[fieldName] = {
    value: fieldName,
    status: true,
  };
});

const SettingsChartsOffAccounts = () => {
  const [group, setGroupData] = useState([]);
  const [subGroupByGroupId, setSubGroupByGroupId] = useState([]);
  const [groupAccount, setGroupAccount] = useState([]);
  const [subGroupAccount, setSubGroupAccount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState([]);
  const [formattedData, setFormattedData] = useState({ groups: [] });
  const [openDialog, setOpenDialog] = useState(false);
  // const [gAccounts, setGAccounts] = useState([]);
  // const [gSubGroup, setgSubGroup] = useState([]);
  // const [gSubbGroAccount, setgSubbGroAccount] = useState([]);
  const [dragListData, setDragListData] = useState([]);
  const [getParentGroupId, setParentGroupId] = useState();
  // dragable list

  const [list, setList] = useState(dragListData);
  const [dragType, setDragType] = useState("");
  const containerRef = useRef();

  const _onListChange = async (newList) => {
    console.log(newList, "ok");

    let filterNewList = newList.map((listItem, index) => {
      return listItem._id;
    });

    let endpoint = "";
    if (dragType === "drag1") {
      endpoint = `settings/balancesheet/account/updateGroupOrder/${newList[0].group}`;
      const res = await axios.put(BaseUrl + endpoint, {
        accountIds: filterNewList,
      });
      console.log(res.data, "update 1");
    } else if (dragType === "drag2") {
      // Set the endpoint for the drag2 operation
      endpoint = `settings/balancesheet/account/updateSubGroupsOrderInGroup/${newList[0].group}`;
      const res = await axios.put(BaseUrl + endpoint, {
        subgroupIds: filterNewList,
      });
      console.log(res.data, "update 2");
    } else if (dragType === "drag3") {
      // Set the endpoint for the drag3 operation
      endpoint = `settings/balancesheet/account/updateSubGroupOrder/${newList[0].subGroup}`;
      const res = await axios.put(BaseUrl + endpoint, {
        accountIds: filterNewList,
      });
      console.log(res.data, "update 3");
    }

    console.log(filterNewList, "new liat");
    setList(newList);
  };

  const Item = ({ item, itemSelected, dragHandleProps }) => {
    const { onMouseDown, onTouchStart } = dragHandleProps;

    return (
      <div
        className="disable-select"
        style={{
          border: "1px solid coral",
          margin: "4px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
          background: "#fff",
          userSelect: "none",
        }}
      >
        {item?.name}
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

  const fetchBalanceSheetGroups = async () => {
    try {
      const groupResponse = await axios.get(
        BaseUrl + `settings/balancesheet/group`
      );
      const groups = groupResponse.data.groups;
      setGroupData(groups);

      let formattedData = { groups: [] };

      for (const group of groups) {
        const subGroupResponse = await axios.get(
          BaseUrl + `settings/balance-sheet/subGroups/group/${group._id}`
        );
        const subGroups = subGroupResponse.data.subGroups;

        if (group === groups[0]) {
          setSubGroupByGroupId(subGroups);
        }

        const groupAccountResponse = await axios.get(
          BaseUrl + `settings/balancesheet/account/groupId/${group._id}`
        );
        const groupsAccounts = groupAccountResponse.data;

        setGroupAccount(groupsAccounts);

        const formattedGroup = {
          ...group,
          subgroups: Array.isArray(subGroups)
            ? subGroups.map((subGroup) => ({
                ...subGroup,
                accounts: [],
              }))
            : [],
          accounts: groupsAccounts,
        };

        if (Array.isArray(subGroups)) {
          for (const subGroup of subGroups) {
            console.log(`Fetching accounts for subgroup ${subGroup._id}`);
            const subGroupAccountResponse = await axios.get(
              BaseUrl +
                `settings/balancesheet/account/subGroupId/${subGroup._id}`
            );
            const subGroupsAccounts = subGroupAccountResponse.data.accounts;
            setSubGroupAccount(subGroupsAccounts);

            const foundSubGroup = formattedGroup.subgroups.find(
              (sg) => sg && sg._id === subGroup._id
            );
            if (foundSubGroup) {
              foundSubGroup.accounts = subGroupsAccounts;
            }
          }
        }

        formattedData.groups.push(formattedGroup);
      }

      setFormattedData(formattedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheetGroups();
  }, [list]);

  useEffect(() => {
    const ProfitandLossGroups = async () => {
      try {
        const response = await axios.get(
          BaseUrl + `settings/profit-loss/group`
        ); // Replace with your API endpoint
        const groups = response.data;
        setAccount(groups);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    ProfitandLossGroups();
  }, []);
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDragClick = (accounts, subGroup, subbGroAccount, type) => {
    console.log("here is data", accounts, subGroup, subbGroAccount);

    // Set the type of drag operation
    setDragType(type);

    // Set the data for the draggable list based on the type of drag operation
    if (type === "drag1") {
      setDragListData(accounts?.accounts);
    } else if (type === "drag2") {
      setDragListData(subGroup);
    } else if (type === "drag3") {
      setDragListData(subbGroAccount);
    } else {
      setDragListData([]);
    }

    setOpenDialog(true);
  };

  useEffect(() => {
    setList(dragListData);
  }, [dragListData]);

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Data Dialog</DialogTitle>
        <div className="App">
          <div
            ref={containerRef}
            className="sdfasdfas"
            style={{
              touchAction: "pan-y",
              background: "beige",
              width: "400px",
              height: "800px",
            }}
          >
            <DraggableList
              itemKey="_id"
              template={Item}
              list={list}
              onMoveEnd={(newList) => _onListChange(newList)}
              container={() => containerRef.current}
            />
          </div>
        </div>
      </Dialog>
      <ErrorPop error={error} setError={setError} type={"error"} />
      {!error && loading && <Loading />}
      {!error && !loading ? (
        <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <PrimaryNavbar
              name={"Settings/Charts Of Accounts"}
              address={`${APP_PREFIX_PATH}/dashboards/settings`}
            />
          </Grid>
          <Grid item xs={6}>
            <TableContainer component={Paper} sx={{ overflowX: "hidden" }}>
              <Table
                // sx={{ minWidth: 700 }}
                aria-label="customized table"
                padding={"none"}
              >
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.background }}
                  >
                    <StyledTableCell align="left">
                      <Typography
                        variant="h6"
                        sx={{ padding: "10px", height: "30px" }}
                      >
                        Balance Sheet
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        margin={0.7}
                      >
                        <Link
                          to={`${APP_PREFIX_PATH}/dashboards/settings/chartsofaccounts/balancesheet/addbalancesheetgroup`}
                        >
                          <AddButton>New Group</AddButton>
                        </Link>
                        <Link
                          to={`${APP_PREFIX_PATH}/dashboards/settings/chartsofaccounts/balancesheet/addbalancesheetaccount`}
                        >
                          <AddButton>New Account</AddButton>
                        </Link>
                      </Stack>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.background }}
                  >
                    <StyledTableCell
                      align="left"
                      sx={{ height: "30px", padding: "10px" }}
                    >
                      Name
                    </StyledTableCell>
                    {
                      / dont remove the following empty cell it is for styling purpose only /
                    }
                    <StyledTableCell align="left"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    "loading....."
                  ) : (
                    <>
                      {formattedData?.groups?.slice(0, 3).map((g) => (
                        <>
                          {/ group /}
                          <StyledTableRow>
                            <StyledTableCell>
                              <Typography variant="h5">{g.name}</Typography>
                            </StyledTableCell>
                          </StyledTableRow>
                          {/ group accounts /}
                          {g.accounts?.accounts?.map((gacc) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell>
                                  <Typography variant="h6">
                                    {gacc.name}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <button
                                    onClick={() =>
                                      handleDragClick(
                                        g.accounts,
                                        null,
                                        null,
                                        "drag1"
                                      )
                                    }
                                  >
                                    drag 1
                                  </button>
                                </StyledTableCell>
                              </StyledTableRow>
                            </>
                          ))}
                          {/ subgroup /}
                          {g.subgroups.map((subg) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell>
                                  <Typography variant="h6">
                                    {subg.name}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <button
                                    onClick={() =>
                                      handleDragClick(
                                        null,
                                        g.subgroups,
                                        null,
                                        "drag2"
                                      )
                                    }
                                  >
                                    drag 2
                                  </button>
                                </StyledTableCell>
                              </StyledTableRow>
                              {subg?.accounts?.map((subacc) => (
                                <>
                                  <StyledTableRow>
                                    <StyledTableCell>
                                      <Typography variant="h6">
                                        &nbsp;&nbsp;&nbsp;{subacc?.name}
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <button
                                        onClick={() =>
                                          handleDragClick(
                                            null,
                                            null,
                                            subg.accounts,
                                            "drag3"
                                          )
                                        }
                                      >
                                        drag 3
                                      </button>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <TableContainer component={Paper} sx={{ overflowX: "hidden" }}>
              <Table
                // sx={{ minWidth: 700 }}
                aria-label="customized table"
                padding={"none"}
              >
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.background }}
                  >
                    <StyledTableCell align="left">
                      <Typography
                        variant="h6"
                        sx={{ padding: "10px", height: "30px" }}
                      >
                        Profit and Loss Statement
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        margin={0.7}
                      >
                        <Link
                          to={`${APP_PREFIX_PATH}/dashboards/settings/chartsofaccounts/profitandlossstatementgroup/addprofitandlossstatementgroup`}
                        >
                          <AddButton>New Group</AddButton>
                        </Link>
                        <Link
                          to={`${APP_PREFIX_PATH}/dashboards/settings/chartsofaccounts/profitandlossstatementaccount/addprofitandlossstatementaccount`}
                        >
                          <AddButton>New Account</AddButton>
                        </Link>
                        <Link
                          to={`${APP_PREFIX_PATH}/dashboards/settings/chartsofaccounts/total/addtotal`}
                        >
                          <AddButton>New Total</AddButton>
                        </Link>
                      </Stack>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.background }}
                  >
                    <StyledTableCell
                      align="left"
                      sx={{ height: "30px", padding: "10px" }}
                    >
                      Name
                    </StyledTableCell>
                    {
                      / dont remove the following empty cell it is for styling purpose only /
                    }
                    <StyledTableCell align="left"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    "loading....."
                  ) : (
                    <>
                      {formattedData?.groups?.slice(3, 5).map((g) => (
                        <>
                          {/ group /}
                          <StyledTableRow>
                            <StyledTableCell>
                              <Typography variant="h5">{g.name}</Typography>
                            </StyledTableCell>
                          </StyledTableRow>
                          {/ group accounts /}
                          {g.accounts?.accounts?.map((gacc) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell>
                                  <Typography variant="h6">
                                    {gacc.name}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <button
                                    onClick={() =>
                                      handleDragClick(
                                        g.accounts,
                                        null,
                                        null,
                                        "drag1"
                                      )
                                    }
                                  >
                                    drag 1
                                  </button>
                                </StyledTableCell>
                              </StyledTableRow>
                            </>
                          ))}
                          {/ subgroup /}
                          {g.subgroups.map((subg) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell>
                                  <Typography variant="h6">
                                    {subg.name}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <button
                                    onClick={() =>
                                      handleDragClick(
                                        null,
                                        g.subgroups,
                                        null,
                                        "drag2"
                                      )
                                    }
                                  >
                                    drag 2
                                  </button>
                                </StyledTableCell>
                              </StyledTableRow>
                              {subg?.accounts?.map((subacc) => (
                                <>
                                  <StyledTableRow>
                                    <StyledTableCell>
                                      <Typography variant="h6">
                                        &nbsp;&nbsp;&nbsp;{subacc?.name}
                                      </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <button
                                        onClick={() =>
                                          handleDragClick(
                                            null,
                                            null,
                                            subg.accounts,
                                            "drag3"
                                          )
                                        }
                                      >
                                        drag 3
                                      </button>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/ .......Editcolumn Dialog BOX.....  /}
        </Grid>
      ) : (
        <SkeletonTable />
      )}
    </>
  );
};
export default SettingsChartsOffAccounts;
