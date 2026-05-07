import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LuCheck,
  LuClock,
  LuMessageCircle,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { staticImagesConfig } from "@/config/common.config";
import { HeaderSearchResultsProps } from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import { ProfilesResponseType } from "@/types/types/response.types";
import { RequestDirectionType } from "@/types/types/connection.types";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useToast } from "@/hooks/toast";
import { toTitleCase } from "@/utils/common.utils";
import { getFullName } from "@/helpers/profile.helpers";
import { conversationRoutes } from "@/lib/routes/routes";
import { connect } from "@/lib/actions/connection.actions";
import { fetchProfiles } from "@/lib/actions/discover.actions";

type SearchRelationshipType = "incoming" | "outgoing" | "connected" | "none";

const HeaderSearchResults = ({
  isOpen,
  onClose,
  positionClass = "top-full right-0 rounded-md w-full mt-2",
  searchQuery,
  connectionRequests,
  connections,
  onRequestAction,
}: HeaderSearchResultsProps) => {
  const [searchedUserProfiles, setSearchedUserProfiles] = useState<
    UserProfileType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exitDirection, setExitDirection] = useState<
    Record<string, RequestDirectionType>
  >({});

  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

  useOutsideClick({
    ref: searchResultsRef,
    when: isOpen,
    callback: onClose,
    defer: true,
  });

  const loadProfiles = useCallback(
    async (search: string, page: number = 1, reset: boolean = true) => {
      const normalizedSearch = search.trim();

      if (!normalizedSearch) {
        setSearchedUserProfiles([]);
        return;
      }

      if (isFetchingRef.current) {
        abortControllerRef.current?.abort();
      }

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const fetchProfilesResponse = await fetchProfiles(
          page,
          normalizedSearch,
        );

        if (fetchProfilesResponse.success && fetchProfilesResponse?.data) {
          const data = fetchProfilesResponse?.data as ProfilesResponseType;

          setSearchedUserProfiles((prev) =>
            reset ? data.users : [...prev, ...data.users],
          );
          pageRef.current = page;
        }
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) return;

    loadProfiles(searchQuery, 1, true);
  }, [searchQuery, isOpen, loadProfiles]);

  useEffect(() => {
    if (!isOpen) {
      setSearchedUserProfiles([]);
      setExitDirection({});
    }
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const getRelationship = (
    profile: UserProfileType,
  ): SearchRelationshipType => {
    if (profile.connectionStatus === "accepted") return "connected";
    if (profile.connectionStatus === "interested") {
      return profile.connectionDirection === "incoming"
        ? "incoming"
        : "outgoing";
    }

    if (connectionRequests.some((r) => r.userId === profile.userId)) {
      return "incoming";
    }

    if (connections.some((c) => c.userId === profile.userId)) {
      return "connected";
    }

    return "none";
  };

  const handleAction = async (
    userId: string,
    direction: RequestDirectionType,
  ) => {
    setExitDirection((prev) => ({ ...prev, [userId]: direction }));
    await onRequestAction(userId, direction);
  };

  const handleConnect = async (userId: string) => {
    const connectResponse = await connect(userId, "interested");

    if (!connectResponse.success) {
      showToast({
        title: toTitleCase(connectResponse.code),
        message: connectResponse.message ?? "",
        variant: "error",
      });
      return;
    }

    setSearchedUserProfiles((prev) =>
      prev.map((profile) =>
        profile.userId === userId
          ? {
              ...profile,
              connectionStatus: "interested",
              connectionDirection: "outgoing",
            }
          : profile,
      ),
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={searchResultsRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-72 glass-heavy backdrop-blur-md z-(--z-dropdown) pt-1 flex flex-col overflow-hidden`}
        >
          <ul className="max-h-75 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center gap-2 px-4 py-3 text-text-secondary text-sm">
                <TbLoader3 size={14} className="animate-spin" />
                Searching...
              </div>
            ) : searchedUserProfiles.length > 0 ? (
              searchedUserProfiles.map((profile) => {
                const relationship = getRelationship(profile);

                return (
                  <motion.div
                    key={profile.userId}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: exitDirection[profile.userId] === "right" ? 100 : -100,
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
                        handleNavigation(`/profile/${profile.userName}`)
                      }
                    >
                      <div className="flex items-center gap-2 pr-1 min-w-0">
                        <div className="relative shrink-0">
                          <Image
                            src={
                              profile?.avatar
                                ? profile.avatar
                                : staticImagesConfig.avatarPlaceholder.src
                            }
                            alt={
                              profile?.fullName
                                ? profile.fullName
                                : staticImagesConfig.avatarPlaceholder.alt
                            }
                            width={100}
                            height={100}
                            className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                          />

                          {relationship === "connected" && (
                            <div
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-bg ${profile?.lastSeen ? "bg-green-500" : "bg-gray-500"}`}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-text-primary text-sm truncate">
                            {getFullName(profile)}
                          </h6>
                          {profile?.currentJobRole && (
                            <p className="text-text-secondary text-xs truncate">
                              {profile.currentJobRole}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {relationship === "incoming" && (
                          <>
                            <div className="p-0 rounded-md alert alert-success">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(profile.userId, "right");
                                }}
                                className="p-0 w-8 h-8 font-medium text-status-success-text text-sm"
                                title="Accept request"
                              >
                                <LuCheck size={16} />
                              </button>
                            </div>
                            <div className="p-0 rounded-md alert alert-error">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(profile.userId, "left");
                                }}
                                className="p-0 w-8 h-8 font-medium text-status-error-text text-sm"
                                title="Reject request"
                              >
                                <LuX size={16} />
                              </button>
                            </div>
                          </>
                        )}

                        {relationship === "outgoing" && (
                          <div className="p-0 rounded-md alert alert-info">
                            <div
                              className="flex justify-center items-center p-0 w-8 h-8 text-status-info-text"
                              title="Request pending"
                            >
                              <LuClock size={16} />
                            </div>
                          </div>
                        )}

                        {relationship === "connected" && (
                          <div className="p-0 rounded-md alert alert-info">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                router.push(
                                  `${conversationRoutes.conversation}/${profile.userName}`,
                                );
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-info-text text-sm"
                              title="Message"
                            >
                              <LuMessageCircle size={16} />
                            </button>
                          </div>
                        )}

                        {relationship === "none" && (
                          <div className="p-0 rounded-md alert alert-success">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(profile.userId);
                              }}
                              className="p-0 w-8 h-8 font-medium text-status-success-text text-sm"
                              title="Connect"
                            >
                              <LuUserPlus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div
                onClick={onClose}
                className="flex justify-center items-center gap-2 px-4 py-3 w-full text-text-secondary text-sm text-left cursor-pointer"
              >
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No users found"}
              </div>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderSearchResults;
