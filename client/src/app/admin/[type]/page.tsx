import AdminPage from "@/components/pages/admin/adminPage";
import { AdminProps } from "@/types/propTypes";

const Admin = async ({ params }: AdminProps) => {
  const { type } = await params;

  return <AdminPage type={type} />;
};

export default Admin;
