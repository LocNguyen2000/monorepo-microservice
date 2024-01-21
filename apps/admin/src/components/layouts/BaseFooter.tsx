import { Footer } from "antd/es/layout/layout";
import { footerStyle } from "../../css/layout";
import Flex from "antd/es/flex";
import { FacebookOutlined, InstagramOutlined, MailOutlined } from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";

const BaseFooter = () => {
  return (
    <Footer style={footerStyle}>
      <div>Rental Workbench ©2024 Created by Nguyen Huu Loc</div>
      <Typography>
        <MailOutlined className="override-antd-icon-item" style={{ marginRight: "0.25rem" }} />
        locnguyenhuu2k@gmail.com
      </Typography>
    </Footer>
  );
};

export default BaseFooter;
