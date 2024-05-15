import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <header>Head</header>
      <main>
        <Outlet />
      </main>

      <footer className="relative ">footer</footer>
    </>
  );
};
export default RootLayout;
