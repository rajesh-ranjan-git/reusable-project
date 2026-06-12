import AdminWrapper from "@/components/admin/admin.wrapper";
import AdminPage from "@/components/pages/admin/admin.page";
import { AdminProps } from "@/types/props/admin.props.types";

const Admin = async ({ params }: AdminProps) => {
  const { type } = await params;

  return (
    <AdminWrapper>
      <AdminPage type={type} />
    </AdminWrapper>
  );
};

export default Admin;
