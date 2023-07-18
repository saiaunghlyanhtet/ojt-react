import React, { useEffect, useState,useContext } from "react";
import styles from "../../styles/UserSearch.module.css";
import UserSearchtable from "./UserSearchtable";
import { getAllUsers } from "../../api/api-test";
import { Button, Form, Input, Select } from "antd";
import { AuthContext } from "../../utils/AuthContext"

const UserSearch = ({ loginUser }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data
  const {userInfo} = useContext(AuthContext)

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      setUserData(users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    const { firstName, lastName, email, role, team } = values;

    let newData = [...userData]; // Create a copy of userData array

    if (team === "All") {
      newData = newData.filter((user) => {
        const firstNameMatch = firstName
          ? user.user_name.includes(firstName)
          : true;
        const lastNameMatch = lastName
          ? user.user_name_last.includes(lastName)
          : true;
        const emailMatch = email ? user.email.includes(email) : true;
        const roleMatch = role ? user.user_level === role : true;
        const delFlgMatch = user.del_flg === "0"; // Check if del_flg is "0"
        return (
          firstNameMatch &&
          lastNameMatch &&
          emailMatch &&
          roleMatch &&
          delFlgMatch
        );
      });
    } else {
      newData = newData.filter((user) => {
        const firstNameMatch = firstName
          ? user.user_name.includes(firstName)
          : true;
        const lastNameMatch = lastName
          ? user.user_name_last.includes(lastName)
          : true;
        const emailMatch = email ? user.email.includes(email) : true;
        const roleMatch = role ? user.user_level === role : true;
        const teamMatch = team ? user.team_name === team : true;
        const delFlgMatch = user.del_flg === "0"; // Check if del_flg is "0"
        return (
          firstNameMatch &&
          lastNameMatch &&
          emailMatch &&
          roleMatch &&
          teamMatch &&
          delFlgMatch
        );
      });
    }

    setFilteredData(newData); // Update the filteredData state
  };
  return (
    <div className={styles["usermanagement-form-main"]}>
      <div className={styles["usermanagement-form-container"]}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSearch}
        >
          <Form.Item label="ユーザー名[姓]" name="firstName">
            <Input
              disabled={userInfo.user_level === "member"}
              className={styles["usermanagement-input"]}
            />
          </Form.Item>
          <Form.Item label="ユーザー名[名]" name="lastName">
            <Input
              disabled={userInfo.user_level === "member"}
              className={styles["usermanagement-input"]}
            />
          </Form.Item>
          <Form.Item label="メールアドレス" name="email">
            <Input
              className={styles["usermanagement-input"]}
              disabled={userInfo.user_level === "member"}
            />
          </Form.Item>

          <Form.Item label="ユーザー権限" name="role">
            <Select
              className={styles["usermanagement-input"]}
              options={[
                { value: "admin", label: "Admin" },
                { value: "super admin", label: "Super Admin" },
                { value: "member", label: "Member" },
              ]}
              disabled={userInfo.user_level === "member"}
              
            />
          </Form.Item>
          <Form.Item label="チーム名：" name="team">
            <Select
              className={styles["usermanagement-input"]}
              options={[
                { value: "All", label: "All" },
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
              ]}
              disabled={userInfo.user_level === "member"}
              
            />
          </Form.Item>

          <Form.Item className={styles["usermanagement-form-button-container"]}>
            {userInfo.user_level === "member" ? (
              <Button type="primary" disabled>
                検索
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                検索
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
      <div className={styles["usermanagement-table-main"]}>
        <UserSearchtable
          loginUser={loginUser}
          data={filteredData} // Use the filteredData state as the data source
          loading={loading}
          fetchUsers={fetchUsers}
        />
      </div>
    </div>
  );
};

export default UserSearch;
