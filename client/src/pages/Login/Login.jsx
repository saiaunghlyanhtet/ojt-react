import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Messages } from "../../data/message";
import styles from "../../styles/Login.module.css";
import { getAllUsers } from "../../api/api-test";
import { AuthContext } from "../../utils/AuthContext";

const Login = () => {
  const [userData, setUserData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // get all users
  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      setUserData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredData = userData?.filter((user) => user.del_flg === "0");

  const users = useMemo(() => {
    return filteredData?.filter(
      (user) =>
        user.user_level === "admin" ||
        user.user_level === "super admin" ||
        user.user_level === "member"
    );
  }, [filteredData]);

  const findUserByName = (usersArray, name) => {
    return usersArray.find((user) => {
      const fullName = `${user.user_name} ${user.user_name_last}`;
      return fullName === name;
    });
  };

  const handleSubmit = (values) => {
    const { username } = values;
    // Find the user in the filtered data
    const user = findUserByName(users, username);

    if (
      user &&
      (user.user_level === "admin" ||
        user.user_level === "super admin" ||
        user.user_level === "member")
    ) {
      const userInformation = { user_level: user.user_level, user_id: user._id };
      handleLogin(userInformation);

      navigate("/menu");
      console.log("login succ");
      setMessage("ログイン成功");

      // Clear input fields
      setUsername("");
      setPassword("");
    } else {
      setMessage("ユーザー名とパスワードが間違っています。");
    }
  };

  return (
    <div className={styles["login-form-main"]}>
      <div className={styles["login-form-container"]}>
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: Messages.M018,
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="ユーザー名"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: Messages.M019,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="パスワード"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles["login-form-button"]}
            >
              ログイン
            </Button>
          </Form.Item>
          <p className={styles["login-form-err-message"]}>{message}</p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
