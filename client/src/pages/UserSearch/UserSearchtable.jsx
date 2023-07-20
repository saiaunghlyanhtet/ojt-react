import React from "react";
import styles from "../../styles/UserSearch.module.css";
import { Table } from "antd";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { getUserById } from "../../api/api-test";

const UserSearchtable = ({ loading, data}) => {
  const {userInfo} = useContext(AuthContext);
  const [loginUser, setLoginUser] = useState([])
console.log(userInfo);
  useEffect(() => {
    fetchLoginUserData()
  }, [loginUser, userInfo])

  console.log("login user", loginUser);

  const fetchLoginUserData = async () => {
    try {
      const response = await getUserById(userInfo.user_id);
            setLoginUser([response]);
    } catch (error) {
      console.log(error);
    }
    }
  
  const columns = [
    {
      title: "番号",
      dataIndex: "_id",
      key: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "ユーザー名",
      dataIndex: "user_name",
      key: "username",
      render: (_, record) => `${record.user_name} ${record.user_name_last}`,
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "メールアドレス",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "ユーザー権限",
      dataIndex: "user_level",
      key: "role",
      sorter: (a, b) => a.user_level.localeCompare(b.user_level),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "チーム名",
      dataIndex: "team",
      key: "team",
      sorter: (a, b) => a.team.localeCompare(b.team),
      sortDirections: ["ascend", "descend"],
    },
  ];
  const paginationConfig = {
    pageSize: 10,
  };

  // Filter data based on del_flg property
  const filteredData = data?.filter((user) => user.del_flg === "0");
  console.log("filterdatattt", filteredData);
  console.log("loginuser", loginUser);
  return (
    <>
      {userInfo.user_level === "member" ? (
        <Table
          columns={columns}
          dataSource={loginUser}
          loading={loading}
          pagination={paginationConfig}
          className={styles.table}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={paginationConfig}
          className={styles.table}
        />
      )}
    </>
  );
};

export default UserSearchtable;
