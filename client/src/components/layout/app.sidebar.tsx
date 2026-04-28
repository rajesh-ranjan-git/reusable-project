import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LuMessageCircle, LuSearch, LuUserPlus } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import {
  ProfilesResponseType,
  ResponsePaginationType,
} from "@/types/types/response.types";
import { AppSidebarProps } from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import { RequestDirectionType } from "@/types/types/connection.types";
import { useToast } from "@/hooks/toast";
import useSheet from "@/hooks/useSheet";
import { toTitleCase } from "@/utils/common.utils";
import { getFullName, mergeUniqueUsersByKey } from "@/helpers/profile.helpers";
import { conversationRoutes, defaultRoutes } from "@/lib/routes/routes";
import {
  connect,
  fetchConnections,
  fetchConnectionRequests,
} from "@/lib/actions/connection.actions";
import FormInput from "@/components/forms/shared/form.input";
import Sheet from "@/components/ui/sheet/sheet";

const AppSidebar = ({ setIsSidebarOpen }: AppSidebarProps) => {
  const [connectionRequests, setConnectionRequests] = useState<
    UserProfileType[]
  >([]);
  const [connections, setConnections] = useState<UserProfileType[]>([]);
  const [exitDirection, setExitDirection] = useState<
    Record<string, RequestDirectionType>
  >({});
  const [connectionRequestsPagination, setConnectionRequestsPagination] =
    useState<ResponsePaginationType | null>(null);
  const [connectionsPagination, setConnectionsPagination] =
    useState<ResponsePaginationType | null>(null);

  const router = useRouter();

  const { showToast } = useToast();

  const connectionRequestsSheet = useSheet({ type: "connectionRequests" });

  const handleAction = async (
    userId: string,
    direction: RequestDirectionType,
  ) => {
    const selectedRequest = connectionRequests.find(
      (request) => request.userId === userId,
    );

    if (!selectedRequest) return;

    setExitDirection((prev) => ({
      ...prev,
      [userId]: direction,
    }));

    setTimeout(() => {
      setConnectionRequests((prev) =>
        prev.filter((request) => request.userId !== userId),
      );

      setConnectionRequestsPagination((prev) =>
        prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
      );

      if (direction === "right") {
        setConnections((prev) => [selectedRequest, ...prev]);

        setConnectionsPagination((prev) =>
          prev
            ? { ...prev, total: prev.total + 1 }
            : { page: 1, limit: 10, total: 1, totalPages: 1 },
        );
      }
    }, 0);

    const status = direction === "right" ? "accepted" : "rejected";

    const response = await connect(userId, status);

    if (!response.success) {
      setConnectionRequests((prev) => [selectedRequest, ...prev]);

      setConnectionRequestsPagination((prev) =>
        prev ? { ...prev, total: prev.total + 1 } : prev,
      );

      if (direction === "right") {
        setConnections((prev) =>
          prev.filter((connection) => connection.userId !== userId),
        );

        setConnectionsPagination((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev,
        );
      }

      showToast({
        title: toTitleCase(response.code),
        message: response.message ?? "",
        variant: "error",
      });
    }
  };

  const getConnectionRequests = async (page: number = 1) => {
    const connectionRequestsResponse = await fetchConnectionRequests(page);

    if (!connectionRequestsResponse?.success) {
    } else {
      const data = connectionRequestsResponse.data as ProfilesResponseType;

      setConnectionRequests((prev) =>
        mergeUniqueUsersByKey(prev, data.users, "userId"),
      );

      setConnectionRequestsPagination(data.pagination);
    }
  };

  const getConnections = async (page?: number) => {
    const connectionsResponse = await fetchConnections(page);

    if (!connectionsResponse?.success) {
    } else {
      const data = connectionsResponse.data as ProfilesResponseType;

      setConnections((prev) =>
        mergeUniqueUsersByKey(prev, data.users, "userId"),
      );
      setConnectionsPagination(data.pagination);
    }
  };

  useEffect(() => {
    getConnectionRequests();
    getConnections();
  }, []);

  return (
    <aside className="flex flex-col border-glass-border border-r border-b-0 md:w-64 lg:w-72 h-full transition-all duration-500 glass-nav shrink-0">
      <div className="p-2 pt-3 border-glass-border border-b">
        <h2 className="font-arima md:text-3xl tracking-wider">Network</h2>
      </div>
      <div className="md:hidden p-2">
        <div className="relative flex-1 max-w-md">
          <FormInput
            placeholder="Search developers, skills..."
            startIcon={<LuSearch />}
          />
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="mb-2">
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
            Requests
          </h6>
          <div className="flex items-center gap-3 mb-3 alert alert-info">
            <LuUserPlus className="text-primary" size={20} />

            <p className="font-medium text-status-info-text text-sm select-none">
              {connectionRequestsPagination?.total &&
              connectionRequestsPagination?.total > 0 ? (
                <span>{connectionRequestsPagination?.total}&nbsp;</span>
              ) : (
                "No "
              )}
              New Requests
            </p>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {connectionRequests?.length > 0
                ? connectionRequests.slice(0, 2).map((request) => (
                    <motion.div
                      key={request.userId}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{
                        opacity: 0,
                        x:
                          exitDirection[request.userId] === "right"
                            ? 100
                            : -100,
                        height: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        transition: { duration: 0.25, ease: "backIn" },
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden cursor-pointer"
                        onClick={() =>
                          router.push(`/profile/${request.userName}`)
                        }
                      >
                        <div className="flex items-center gap-2 pr-1 min-w-0">
                          <Image
                            src={
                              request?.avatar
                                ? request.avatar
                                : staticImagesConfig.avatarPlaceholder.src
                            }
                            alt={
                              request?.fullName
                                ? request.fullName
                                : staticImagesConfig.avatarPlaceholder.alt
                            }
                            width={100}
                            height={100}
                            className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-text-primary text-sm truncate">
                              {getFullName(request)}
                            </h6>
                            {request?.currentJobRole && (
                              <p className="text-text-secondary text-xs truncate">
                                {request.currentJobRole}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="p-0 rounded-md alert alert-success">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(request.userId, "right");
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-success-text text-sm"
                            >
                              ✓
                            </button>
                          </div>
                          <div className="p-0 rounded-md alert alert-error">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(request.userId, "left");
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-error-text text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                : null}
            </AnimatePresence>
          </div>

          {connectionRequests.length > 2 && (
            <button
              onClick={() => connectionRequestsSheet.toggle()}
              className="my-2 w-full btn btn-secondary"
            >
              Show all requests
            </button>
          )}
        </div>

        <Sheet
          open={connectionRequestsSheet.isOpen}
          onClose={() => connectionRequestsSheet.close()}
        >
          <div className="flex flex-col h-full">
            <h4 className="mb-3 p-1 font-poppins text-text-secondary uppercase tracking-wider">
              Requests
              {connectionRequestsPagination?.total &&
              connectionRequestsPagination.total > 0 ? (
                <span>&nbsp;({connectionRequestsPagination.total})</span>
              ) : null}
            </h4>

            <div className="flex-1 space-y-2 overflow-y-auto">
              <AnimatePresence>
                {connectionRequests?.length > 0 ? (
                  connectionRequests.map((request) => (
                    <motion.div
                      key={request.userId}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{
                        opacity: 0,
                        x:
                          exitDirection[request.userId] === "right"
                            ? 100
                            : -100,
                        height: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        transition: { duration: 0.25, ease: "backIn" },
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden cursor-pointer"
                        onClick={() =>
                          router.push(`/profile/${request.userName}`)
                        }
                      >
                        <div className="flex items-center gap-2 pr-1 min-w-0">
                          <Image
                            src={
                              request?.avatar
                                ? request.avatar
                                : staticImagesConfig.avatarPlaceholder.src
                            }
                            alt={
                              request?.fullName
                                ? request.fullName
                                : staticImagesConfig.avatarPlaceholder.alt
                            }
                            width={100}
                            height={100}
                            className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-text-primary text-sm truncate">
                              {getFullName(request)}
                            </h6>
                            {request?.currentJobRole && (
                              <p className="text-text-secondary text-xs truncate">
                                {request.currentJobRole}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="p-0 rounded-md alert alert-success">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(request.userId, "right");
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-success-text text-sm"
                            >
                              ✓
                            </button>
                          </div>
                          <div className="p-0 rounded-md alert alert-error">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(request.userId, "left");
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-error-text text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="my-auto text-sm text-center">
                    No requests available...
                  </p>
                )}
              </AnimatePresence>

              {connectionRequestsPagination?.total &&
                connectionRequestsPagination.total >
                  connectionRequests.length && (
                  <button
                    onClick={() =>
                      getConnectionRequests(
                        connectionRequestsPagination.page + 1,
                      )
                    }
                    className="my-2 w-full btn btn-secondary"
                  >
                    Load more requests
                  </button>
                )}
            </div>
          </div>
        </Sheet>

        <div>
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
            Connections
            {connectionsPagination?.total && connectionsPagination.total > 0 ? (
              <span>&nbsp;({connectionsPagination.total})</span>
            ) : null}
          </h6>
          {connections?.length > 0 ? (
            <div className="space-y-2">
              {connections.map((connection) => (
                <div
                  key={connection.userId}
                  onClick={() => router.push(`/profile/${connection.userName}`)}
                  className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-2 pr-1 min-w-0">
                    <div className="relative shrink-0">
                      <Image
                        src={
                          connection?.avatar
                            ? connection.avatar
                            : staticImagesConfig.avatarPlaceholder.src
                        }
                        alt={
                          connection?.fullName
                            ? connection.fullName
                            : staticImagesConfig.avatarPlaceholder.alt
                        }
                        width={100}
                        height={100}
                        className="shadow-glass rounded-full w-10 h-10 object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-bg ${connection?.lastSeen ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="font-medium text-text-primary text-sm truncate">
                        {getFullName(connection)}
                      </h6>
                      {connection?.currentJobRole && (
                        <p className="text-text-secondary text-xs truncate">
                          {connection.currentJobRole}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-0 rounded-md alert alert-info">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSidebarOpen?.(false);
                        router.push(
                          `${conversationRoutes.conversation}/${connection.userName}`,
                        );
                      }}
                      className="p-0 w-8 h-8 font-medium text-status-info-text text-sm"
                    >
                      <LuMessageCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {connectionsPagination?.total &&
                connectionsPagination.total > connections.length && (
                  <button
                    onClick={() =>
                      getConnections(connectionsPagination.page + 1)
                    }
                    className="my-2 w-full btn btn-secondary"
                  >
                    Load more connections
                  </button>
                )}
            </div>
          ) : (
            <p className="my-auto text-sm text-center">
              <Link href={defaultRoutes.discover} className="text-text-primary">
                Discover
              </Link>{" "}
              fellow developers to connect...
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
