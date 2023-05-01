import { useQuery } from "@tanstack/react-query";
import { Avatar, Button } from "antd";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import './styles.scss';

function getProfile() {
  return axios.get("auth/profile").then(({ data }) => data);
}




const ProfileDropDown = () => {
  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          profile (soon)
        </a>
      ),
      disabled: true,
    },
    {
      key: 'logout',
      danger: true,
      label: (
        <Button danger onClick={()=>{
          localStorage.clear()
          navigate('/login')
        }}>
          Logout
        </Button>
      ),
    },
  ];
  

  const { isLoading, data = { data: [] } } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  if (isLoading) return <span>loading ...</span>;
  return (
    <div className="profile-drop-down">
      <Dropdown menu={{ items }}>
        <Avatar src={data.image} size='large' />
      </Dropdown>
    </div>
  );
};

export default ProfileDropDown;
