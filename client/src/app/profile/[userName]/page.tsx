import { ProfileProps } from "@/types/props/profile.props.types";
import ProfilePage from "@/components/pages/profile/profile.page";

const UserProfile = async ({ params }: ProfileProps) => {
  const { userName } = await params;

  return <ProfilePage userName={userName} />;
};

export default UserProfile;
