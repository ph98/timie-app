import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import axios from "../../utils/axios";
import './styles.scss';

function getProfile() {
  return axios.get("auth/profile").then(({ data }) => data);
}

const ProfileDropDown = () => {
  const { isLoading, data = { data: [] } } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  console.log("data", data);
  if (isLoading) return <span>loading ...</span>;
  return (
    <div className="profile-drop-down">
      <Avatar src={data.image} size='large' />
    </div>
  );
};

export default ProfileDropDown;
