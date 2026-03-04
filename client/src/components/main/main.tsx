import { ReactNodeProps } from "@/types/propTypes";

const Main = ({ children }: ReactNodeProps) => {
  return (
    <main className="relative flex justify-center items-center w-screen max-w-screen overflow-x-hidden font-semibold text-lg">
      {children}
    </main>
  );
};

export default Main;
