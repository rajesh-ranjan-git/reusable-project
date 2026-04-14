import AdminPage from "@/components/pages/admin/adminPage";
import { AdminProps } from "@/types/propTypes";

const Admin = async ({ params }: AdminProps) => {
  const { type } = await params;
  logger.debug("params:", params);
  logger.debug("type:", type);

  return <AdminPage type={type} />;
};

export default Admin;
