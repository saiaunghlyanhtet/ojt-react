import React from "react";
import styles from "../../styles/UserSearch.module.css";
import { Table } from "antd";

const UserSearchtable = ({ loading, data, loginUser }) => {
  const columns = [
    {
      title: "番号",
      dataIndex: "_id",
      key: "id",
      render: (_, __, index) => {
        const { current = 1, pageSize = 10 } = paginationConfig;
        let currentRow = index + 1;
        currentRow = (current - 1) * pageSize + index + 1;
        return isNaN(currentRow) ? "-" : currentRow;
      },
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
    pageSize: 3,
  };

  // Filter data based on del_flg property
  const filteredData = data?.filter((user) => user.del_flg === "0");

  return (
    <>
      {loginUser?.user_level === "member" ? (
        <Table
          columns={columns}
          dataSource={loginUser ? [loginUser] : []}
          rowKey={record => record._id}
          loading={loading}
          pagination={paginationConfig}
          className={styles.table}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={record => record._id}
          loading={loading}
          pagination={paginationConfig}
          className={styles.table}
        />
      )}
    </>
  );
};

export default UserSearchtable;
