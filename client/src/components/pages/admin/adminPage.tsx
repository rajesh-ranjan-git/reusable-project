"use client";

import { useState } from "react";
import {
  LuActivity,
  LuDollarSign,
  LuDownload,
  LuTarget,
  LuUsers,
} from "react-icons/lu";
import ActivityFeed from "@/components/admin/activityFeed";
import AdminSidebar from "@/components/admin/adminSidebar";
import ChartCard from "@/components/admin/chartCard";
import StatCard from "@/components/admin/statCard";
import Header from "@/components/layout/header";
import { AdminPageProps } from "@/types/propTypes";
import { toTitleCase } from "@/utils/common.utils";
import { adminRoutes } from "@/lib/routes/routes";
import { notFound } from "next/navigation";

const AdminPage = ({ type }: AdminPageProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!type || !Object.keys(adminRoutes).includes(type.toLowerCase())) {
    return notFound();
  }

  return (
    <div className="flex bg-bg-page selection:bg-primary/30 min-h-dvh overflow-hidden text-text-primary">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col flex-1 md:ml-18 w-full h-dvh overflow-hidden ${!collapsed ? "md:ml-64" : ""}`}
      >
        <Header
          type="admin"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="space-y-6 md:space-y-8 mx-auto pb-10 max-w-7xl">
            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
              <div>
                <h1 className="md:text-4xl">{toTitleCase(type)}</h1>
                <p className="mt-1">Monitor platform metrics and activity.</p>
              </div>
              <button className="btn btn-secondary">
                <LuDownload size={16} />
                Generate Report
              </button>
            </div>

            <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                value="12,482"
                change={12.5}
                trend="up"
                icon={LuUsers}
              />
              <StatCard
                title="Active Matches"
                value="8,234"
                change={8.2}
                trend="up"
                icon={LuTarget}
              />
              <StatCard
                title="Platform Revenue"
                value="$42,500"
                change={4.1}
                trend="up"
                icon={LuDollarSign}
              />
              <StatCard
                title="Bounce Rate"
                value="24.2%"
                change={2.4}
                trend="down"
                icon={LuActivity}
              />
            </div>

            <div className="gap-4 md:gap-6 grid grid-cols-1 xl:grid-cols-3 h-auto xl:h-112.5">
              <ChartCard />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
