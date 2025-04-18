import React from "react";

// reactstrap components
// import { Spinner } from "reactstrap";

// core components

export const PageChange = ({path}) => {
  return (
    <div>
      <div
        className="fixed top-0 left-0 z-40 w-full h-full bg-cover"
        style={{
          backgroundImage: "url('/app/img/img-1-1000x600.jpg')",
        }}
      ></div>
      <div className="absolute top-0 left-0 z-50 block w-full h-full bg-black bg-opacity-50"></div>
      <div className="relative top-0 z-50 max-w-sm mx-auto my-32 text-center">
        <div className="block mb-4">
          <i className="mx-auto text-6xl text-white fas fa-circle-notch animate-spin"></i>
        </div>
        <h4 className="text-lg font-medium text-white">
          Carregando...
        </h4>
      </div>
    </div>
  );
}
