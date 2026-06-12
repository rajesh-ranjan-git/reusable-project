import { UIEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { TbLoader3 } from "react-icons/tb";
import { staticImagesConfig } from "@/config/common.config";
import { HeaderSearchResultsProps } from "@/types/props/common.props.types";
import { UserProfileType } from "@/types/types/profile.types";
import {
  ProfilesResponseType,
  ResponsePaginationType,
} from "@/types/types/response.types";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useNetworkActions } from "@/hooks/useNetworkActions";
import { useToast } from "@/hooks/toast";
import { getFullName } from "@/helpers/profile.helpers";
import { fetchProfiles } from "@/lib/actions/discover.actions";

const HeaderSearchResults = ({
  isOpen,
  onClose,
  positionClass = "top-full right-0 rounded-md w-full mt-2",
  searchQuery,
}: HeaderSearchResultsProps) => {
  const [searchedUserProfiles, setSearchedUserProfiles] = useState<
    UserProfileType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchPagination, setSearchPagination] =
    useState<ResponsePaginationType | null>(null);

  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const router = useRouter();
  const { showToast } = useToast();
  const networkActions = useNetworkActions();

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
      setIsLoading(reset);
      setIsLoadingMore(!reset);

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
          setSearchPagination(data.pagination);
          pageRef.current = page;
        }
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
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
      setSearchPagination(null);
    }
  }, [isOpen]);

  const handleResultsScroll = (e: UIEvent<HTMLUListElement>) => {
    if (!searchPagination) return;
    if (searchPagination.page >= searchPagination.totalPages) return;
    if (isFetchingRef.current || isLoading || isLoadingMore) return;

    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom <= 96) {
      loadProfiles(searchQuery, searchPagination.page + 1, false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
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
          <ul
            className="max-h-75 overflow-y-auto"
            onScroll={handleResultsScroll}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2 px-4 py-3 text-text-secondary text-sm">
                <TbLoader3 size={14} className="animate-spin" />
                Searching...
              </div>
            ) : searchedUserProfiles.length > 0 ? (
              <>
                {searchedUserProfiles.map((profile) => (
                  <motion.div
                    key={profile.userId}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
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
                    </div>
                  </motion.div>
                ))}

                {isLoadingMore && (
                  <div className="flex justify-center items-center gap-2 px-4 py-3 text-text-secondary text-sm">
                    <TbLoader3 size={14} className="animate-spin" />
                    Loading more...
                  </div>
                )}
              </>
            ) : (
              <div
                onClick={onClose}
                className="flex justify-center items-center gap-2 px-4 py-3 w-full text-text-secondary text-sm text-left select-none"
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
