import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/UserSearch.module.css";
import UserSearchtable from "./UserSearchtable";
import { getAllUsers, getUserById, getAllTeams } from "../../api/api-test";
import { Button, Form, Input, Select } from "antd";
import { AuthContext } from "../../utils/AuthContext";

const { Option } = Select;

const UserSearch = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch login user data
      if (userInfo && userInfo.user_id) {
        const response = await getUserById(userInfo.user_id);
        setLoginUser(response);
      }

      // Fetch all users data
      const users = await getAllUsers();
      setUserData(users);

      // Fetch teams data
      const teamsData = await getAllTeams();
      setTeams(teamsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    
  };

 

  return (
    <div className={styles["usermanagement-form-main"]}>
      <div className={styles["usermanagement-form-container"]}>
        {loginUser ? (
          <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          disabled={loginUser?.user_level === "member"}
          onFinish={handleSearch}
          initialValues={{

            // Use initialValues prop instead of defaultValue

            firstName:

              loginUser?.user_level === "member"

                ? loginUser.user_name

                : "",

            lastName:

              loginUser?.user_level === "member"

                ? loginUser.user_name_last

                : "",

            email:

              loginUser?.user_level === "member" ? loginUser.email : "",

            role:

              loginUser?.user_level === "member"

                ? loginUser.user_level

                : undefined,

            team:

              loginUser?.user_level === "member"

                ? loginUser.team

                : undefined,

          }}
        >

          <Form.Item label="ユーザー名[姓]" name="firstName">
            <Input

              className={styles["usermanagement-input"]}

            />
          </Form.Item>

          <Form.Item label="ユーザー名[名]" name="lastName">
            <Input

              className={styles["usermanagement-input"]}

            />
          </Form.Item>

          <Form.Item label="メールアドレス" name="email">
            <Input
              className={styles["usermanagement-input"]}



            />
          </Form.Item>

          <Form.Item label="チーム名：" name="team">
            <Select
              className={styles["usermanagement-input"]}




            >
              <Option value="All">All</Option>
              {teams && (
                teams.map((team) => (
                  <Option key={team._id} value={team.teamName}>
                    {team.teamName}
                  </Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Form.Item label="ユーザー権限" name="role">
            <Select
              className={styles["usermanagement-input"]}
              options={[
                { value: "admin", label: "Admin" },
                { value: "super admin", label: "Super Admin" },
                { value: "member", label: "Member" },
              ]}


            />
          </Form.Item>

          <Form.Item className={styles["usermanagement-form-button-container"]}>
              {loginUser?.user_level === "member" ? ( <Button type="primary" disabled
            >
              検索
            </Button>) : (
               <Button type="primary" htmlType="submit"
               >
                 検索
               </Button>
            )}
           

          </Form.Item>
        </Form>
        ) : (null)}
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
