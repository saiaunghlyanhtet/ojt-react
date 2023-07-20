import React, { useEffect, useState, useContext, useCallback } from "react";
import styles from "../../styles/UserSearch.module.css";
import UserSearchtable from "./UserSearchtable";
import { getAllUsers, getUserById } from "../../api/api-test";
import { Button, Form, Input, Select } from "antd";
import { AuthContext } from "../../utils/AuthContext";

const { Option } = Select;

const UserSearch = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    fetchLoginUserData();
    fetchUsers();
  }, []); // Empty dependency array, so this will run only once on component mount

  const fetchLoginUserData = async () => {
    try {
      if (userInfo && userInfo.user_id) {
        const response = await getUserById(userInfo.user_id);
        setLoginUser(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    let newData = [...userData];

    if (team === "All") {
      newData = newData.filter((user) => {
        const firstNameMatch = firstName ? user.user_name.includes(firstName) : true;
        const lastNameMatch = lastName ? user.user_name_last.includes(lastName) : true;
        const emailMatch = email ? user.email.includes(email) : true;
        const roleMatch = role ? user.user_level === role : true;
        const delFlgMatch = user.del_flg === "0";
        return firstNameMatch && lastNameMatch && emailMatch && roleMatch && delFlgMatch;
      });
    } else {
      newData = newData.filter((user) => {
        const firstNameMatch = firstName ? user.user_name.includes(firstName) : true;
        const lastNameMatch = lastName ? user.user_name_last.includes(lastName) : true;
        const emailMatch = email ? user.email.includes(email) : true;
        const roleMatch = role ? user.user_level === role : true;
        const teamMatch = team ? user.team === team : true;
        const delFlgMatch = user.del_flg === "0";
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

    setFilteredData(newData);
    console.log(newData);
  };

  

  return (
    <div className={styles["usermanagement-form-main"]}>
      <div className={styles["usermanagement-form-container"]}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSearch}
          initialValues={{
            firstName: loginUser?.user_level === "member" ? loginUser?.user_name : "",
            lastName: loginUser?.user_level === "member" ? loginUser?.user_name_last : "",
            email: loginUser?.user_level === "member" ? loginUser?.email : "",
            role: loginUser?.user_level === "member" ? loginUser?.user_level : undefined,
            team: loginUser?.user_level === "member" ? loginUser?.team : undefined,
          }}
        >
          <Form.Item label="ユーザー名[姓]" name="firstName">
            <Input
              disabled={loginUser?.user_level === "member"}
              className={styles["usermanagement-input"]}
            />
          </Form.Item>

          <Form.Item label="ユーザー名[名]" name="lastName">
            <Input
              disabled={loginUser?.user_level === "member"}
              
              className={styles["usermanagement-input"]}
            />
          </Form.Item>

          <Form.Item label="メールアドレス" name="email">
            <Input
              className={styles["usermanagement-input"]}
              disabled={loginUser?.user_level === "member"}
              
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
              disabled={loginUser?.user_level === "member"}
              
            />
          </Form.Item>

          <Form.Item label="チーム名：" name="team">
            <Select
              className={styles["usermanagement-input"]}
              options={[
                { value: "All", label: "All" },
                { value: "Team A", label: "A" },
                { value: "Team B", label: "B" },
                { value: "Team C", label: "C" },
              ]}
              disabled={loginUser?.user_level === "member"}
              
            />
          </Form.Item>

          <Form.Item className={styles["usermanagement-form-button-container"]}>
            {loginUser?.user_level === "member" ? (
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
          data={filteredData.length > 0 ? filteredData : userData}
          loading={loading}
          loginUser={loginUser}
        />
      </div>
    </div>
  );
};

export default UserSearch;
