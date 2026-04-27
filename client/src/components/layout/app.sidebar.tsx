import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LuMessageCircle, LuSearch, LuUserPlus } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import { ProfilesResponseType } from "@/types/types/response.types";
import { AppSidebarProps } from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import { RequestDirectionType } from "@/types/types/connection.types";
import { useToast } from "@/hooks/toast";
import { toTitleCase } from "@/utils/common.utils";
import { getFullName } from "@/helpers/profile.helpers";
import { chatRoutes, defaultRoutes } from "@/lib/routes/routes";
import {
  connect,
  fetchConnections,
  fetchRequests,
} from "@/lib/actions/connection.actions";
import FormInput from "@/components/forms/shared/form.input";

const AppSidebar = ({ setIsSidebarOpen }: AppSidebarProps) => {
  const router = useRouter();
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState<
    UserProfileType[]
  >([]);
  const [connections, setConnections] = useState<UserProfileType[]>([]);

  const [exitDirection, setExitDirection] = useState<
    Record<string, RequestDirectionType>
  >({});

  const { showToast } = useToast();

  const handleAction = async (
    userId: string,
    direction: RequestDirectionType,
  ): Promise<void> => {
    const selectedRequest = connectionRequests.find(
      (request) => request.userId === userId,
    );

    if (!selectedRequest) return;

    setExitDirection((prev) => ({
      ...prev,
      [userId]: direction,
    }));

    setConnectionRequests((prev) =>
      prev.filter((request) => request.userId !== userId),
    );

    if (direction === "right") {
      setConnections((prev) => [selectedRequest, ...prev]);
    }

    const status = direction === "right" ? "accepted" : "rejected";

    const response = await connect(userId, status);

    if (!response.success) {
      setConnectionRequests((prev) => [selectedRequest, ...prev]);

      if (direction === "right") {
        setConnections((prev) =>
          prev.filter((connection) => connection.userId !== userId),
        );
      }

      showToast({
        title: toTitleCase(response.code),
        message: response.message ?? "",
        variant: "error",
      });
    }
  };

  const visibleRequests = showAllRequests
    ? connectionRequests
    : connectionRequests.slice(0, 2);

  const getConnectionRequests = async () => {
    const connectionRequestsResponse = await fetchRequests();

    if (!connectionRequestsResponse?.success) {
    } else {
      const data = connectionRequestsResponse.data as ProfilesResponseType;

      setConnectionRequests(data.users);
    }
  };

  const getConnections = async () => {
    const connectionsResponse = await fetchConnections();

    if (!connectionsResponse?.success) {
    } else {
      const data = connectionsResponse.data as ProfilesResponseType;

      setConnections(data.users);
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
        {visibleRequests?.length > 0 ? (
          <div className="mb-2">
            <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
              Requests
            </h6>
            <div className="flex items-center gap-3 mb-3 alert alert-info">
              <LuUserPlus className="text-primary" size={20} />
              <p className="font-medium text-status-info-text text-sm">
                {connectionRequests.length} New Requests
              </p>
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {visibleRequests.map((request) => (
                  <motion.div
                    key={request.userId}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: exitDirection[request.userId] === "right" ? 100 : -100,
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
                ))}
              </AnimatePresence>
            </div>

            {!showAllRequests && connectionRequests.length > 2 && (
              <button
                onClick={() => setShowAllRequests(true)}
                className="my-2 w-full btn btn-secondary"
              >
                Show all requests ({connectionRequests.length})
              </button>
            )}
          </div>
        ) : null}

        <div>
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
            Connections
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
                        router.push(chatRoutes.chat);
                      }}
                      className="p-0 w-8 h-8 font-medium text-status-info-text text-sm"
                    >
                      <LuMessageCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
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
