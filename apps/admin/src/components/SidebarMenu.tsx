import { FunctionComponent } from "react";
import { ProfileFilled, IdcardFilled } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarMenuProps {
    
}
 
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }


const items: MenuProps['items'] = [
    getItem('Employees', 'sub1', <IdcardFilled />),
    getItem('Customers', 'sub2', <ProfileFilled />)
]
const SidebarMenu: FunctionComponent<SidebarMenuProps> = () => {
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
      };

    return ( <Menu
        className='m-sider'
        theme="dark"
        onClick={onClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      /> );
}
 
export default SidebarMenu;