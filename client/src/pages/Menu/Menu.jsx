import React, { useContext, useEffect } from "react";
import { Button, Space } from "antd";
import { Link } from "react-router-dom";
import styles from "../../styles/Menu.module.css";
import { AuthContext } from "../../utils/AuthContext"; // Update the path to the AuthContext file
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const { userInfo } = useContext(AuthContext); // Access the userInformation value from the AuthContext
  const navigate = useNavigate();
  console.log(userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);
  return (
    <>
      {userInfo !== null  ? (
        <div className={styles["menu-main"]}>
        <div className={styles["menu-container"]}>
          <div className={styles["menu-title"]}>
            <div>メニュー</div>
          </div>
          <Space
            direction="vertical"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {userInfo.user_level === "super admin" || userInfo.user_level === "admin" ? ( 
              <Link to="/usermanagement">
                <Button
                  style={{ height: "70px", width: "350px" }}
                  type="primary"
                  block
                >
                  ユーザー管理 
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                style={{ height: "70px", width: "350px" }}
                type="primary"
                block
              >
                ユーザー管理 
              </Button>
            )}
            {userInfo.user_level === "super admin" || userInfo.user_level === "admin"  ? ( 
              <Link to="/team-management">
              <Button
                style={{ height: "70px", width: "350px" }}
                type="primary"
                block
              >
                チーム設定
              </Button>
              </Link>
            ) : (
              <Button
                disabled
                style={{ height: "70px", width: "350px" }}
                type="primary"
                block
              >
                チーム設定
              </Button>
            )}
            <Link to='/user-search'>
            <Button
              style={{ height: "70px", width: "350px" }}
              type="primary"
              block
            >
              ユーザー検索
            </Button>
            </Link>
          </Space>
        </div>
      </div>
      ):(
        <h1>menu</h1>
      )}
    </>
  );
};

export default Menu;
