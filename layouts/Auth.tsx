import React from "react";
import { FooterSmall } from "../components/Footers/FooterSmall";

export const Auth = ({ children }) => {
  return (
    <>
      <style jsx global>{`
      /* INPUT BORDER ON FOCUS */
      [type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='month']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {
        --tw-ring-color: rgba(71, 85, 105, var(--tw-text-opacity));
        border-color: var(--tw-ring-color) !important;
        border-left: 5px solid var(--tw-ring-color) !important;
      }
      `}</style>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full h-full min-h-screen py-40">
          <div
            className="absolute top-0 w-full h-full bg-no-repeat bg-blueGray-800 bg-full"
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
            }}
          ></div>
          {children}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
