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
    console.log(newData);
  };

  

  return (
    <div className={styles["usermanagement-form-main"]}>
      <div className={styles["usermanagement-form-container"]}>
       
       {loginUser?.user_level === "member" ? (
         <Form
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
       >
        
         <Form.Item label="ユーザー名[姓]" name="firstName">
           <Input
             disabled={true}
             className={styles["usermanagement-input"]}
            
           />
         </Form.Item>

         <Form.Item label="ユーザー名[名]" name="lastName">
           <Input
             disabled={true}
             className={styles["usermanagement-input"]}
           
           />
         </Form.Item>

         <Form.Item label="メールアドレス" name="email">
           <Input
             className={styles["usermanagement-input"]}
             disabled={true}
             
             
           />
         </Form.Item>

         <Form.Item label="チーム名：" name="team">
           <Select
             className={styles["usermanagement-input"]}
            
             disabled={true}
             
             
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
             disabled={true}
             
           />
         </Form.Item>

         <Form.Item className={styles["usermanagement-form-button-container"]}>
         
             <Button type="primary" disabled
             >
               検索
             </Button>
           
         </Form.Item>
       </Form>
       ) : (
        <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSearch}
        
      >
        <Form.Item label="ユーザー名[姓]" name="firstName">
          <Input
            disabled={false}
            className={styles["usermanagement-input"]}
          />
        </Form.Item>

        <Form.Item label="ユーザー名[名]" name="lastName">
          <Input
            disabled={false}
            className={styles["usermanagement-input"]}
          />
        </Form.Item>

        <Form.Item label="メールアドレス" name="email">
          <Input
            className={styles["usermanagement-input"]}
            disabled={false}
            
          />
        </Form.Item>

        <Form.Item label="チーム名：" name="team">
          <Select
            className={styles["usermanagement-input"]}
           
            disabled={false}
            
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
            disabled={false}
            
          />
        </Form.Item>

        <Form.Item className={styles["usermanagement-form-button-container"]}>
         
            <Button type="primary" htmlType="submit">
              検索
            </Button>
        
        </Form.Item>
      </Form>
       )}
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
