import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Select, Button, message } from "antd";
import styles from "../../styles/UserManagement.module.css";
import { createUser, getAllUsers } from "../../api/api-test";
import { Messages } from "../../data/message";
import { AuthContext } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagementTable from "./UserManagementTable2";

const UserManagement = ({ loginUserEmail }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Create a form instance
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const {userInfo} = useContext(AuthContext)
  
  console.log(userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

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

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      const emailExists = userData.some((user) => user.email === values.email);

      if (emailExists) {
        form.setFields([
          {
            name: "email",
            errors: [Messages.M003],
          },
        ]);
        setLoading(false);
        return;
      }

      const newUserData = {
        user_name: values.firstName,
        user_name_last: values.lastName,
        email: values.email,
        user_level: values.role,
        del_flg:"0",
        create_user: userInfo.user_id, 
        create_datetime: new Date().toISOString(), 
      };

      const createdUser = await createUser(newUserData);
      console.log("User created:", createdUser);
      message.success(Messages.M006);
      fetchUsers();
      form.resetFields();
    } catch (error) {
      message.success(Messages.M007);
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles["usermanagement-form-main"]}>
        <div className={styles["usermanagement-form-container"]}>
          <Form
            form={form}
            onFinish={handleFormSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="ユーザー名[姓]"
              name="firstName"
              rules={[{ required: true, message: Messages.M013 }]}
            >
              <Input className={styles["usermanagement-input"]} />
            </Form.Item>
            <Form.Item
              label="ユーザー名[名]"
              name="lastName"
              rules={[{ required: true, message: Messages.M014 }]}
            >
              <Input className={styles["usermanagement-input"]} />
            </Form.Item>
            <Form.Item
              label="メールアドレス"
              name="email"
              rules={[
                { required: true, message: Messages.M002 },
                { pattern: emailRegex, message: Messages.M004 },
              ]}
            >
              <Input className={styles["usermanagement-input"]} />
            </Form.Item>
            <Form.Item
              label="ユーザー権限"
              name="role"
              rules={[{ required: true, message: Messages.M005 }]}
            >
              <Select
                className={styles["usermanagement-input"]}
                options={[
                  {
                    value: "admin",
                    label: "Admin",
                  },
                  {
                    value: "super admin",
                    label: "Super Admin",
                  },
                  {
                    value: "member",
                    label: "Member",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              className={styles["usermanagement-form-button-container"]}
            >
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles["usermanagement-table-main"]}>
          <UserManagementTable
            data={userData}
            loading={loading}
            fetchUsers={fetchUsers}
            
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
