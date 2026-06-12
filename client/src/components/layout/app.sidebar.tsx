import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { LuSearch, LuUserPlus } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import { AppSidebarProps } from "@/types/props/common.props.types";
import { profileRoutes } from "@/lib/routes/routes";
import FormInput from "@/components/forms/shared/form.input";

const AppSidebar = ({ setIsSidebarOpen }: AppSidebarProps) => {
  const router = useRouter();

  return (
    <aside className="flex flex-col border-glass-border border-r border-b-0 md:w-64 lg:w-72 h-full transition-all duration-500 glass-nav shrink-0">
      <div className="p-2 pt-3 border-glass-border border-b">
        <h2 className="md:text-3xl tracking-wide">Network</h2>
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
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wide">
            Requests
          </h6>
          <div className="flex items-center gap-3 mb-3 alert alert-info">
            <LuUserPlus className="text-primary" size={20} />

            <p className="font-medium text-status-info-text text-sm select-none">
              No New Requests
            </p>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              <div
                className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden cursor-pointer"
                onClick={() => router.push(profileRoutes.profile)}
              >
                <div className="flex items-center gap-2 pr-1 min-w-0">
                  <Image
                    src={staticImagesConfig.avatarPlaceholder.src}
                    alt={staticImagesConfig.avatarPlaceholder.alt}
                    width={100}
                    height={100}
                    className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-medium text-text-primary text-sm truncate">
                      Rajesh Ranjan
                    </h6>
                    <p className="text-text-secondary text-xs truncate">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wide">
            Connections
          </h6>
          <div className="space-y-2">
            <div
              onClick={() => router.push(profileRoutes.profile)}
              className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-2 pr-1 min-w-0">
                <div className="relative shrink-0">
                  <Image
                    src={staticImagesConfig.avatarPlaceholder.src}
                    alt={staticImagesConfig.avatarPlaceholder.alt}
                    width={100}
                    height={100}
                    className="shadow-glass rounded-full w-10 h-10 object-cover"
                  />
                  <div className="right-0 bottom-0 absolute bg-green-500 border border-bg rounded-full w-2.5 h-2.5"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-text-primary text-sm truncate">
                    Rajesh Ranjan
                  </h6>
                  <p className="text-text-secondary text-xs truncate">
                    Full Stack Developer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
