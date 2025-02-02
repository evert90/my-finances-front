import React from "react";
import { createPopper } from "@popperjs/core";
import { Router, useRouter } from "next/router";
import { userService } from "../../services/user.service";
import { pushNotificationService } from "../../services/push-notification-service";
import { useToast } from "../Toast/ToastProvider";

const UserDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef: any = React.createRef();
  const popoverDropdownRef: any = React.createRef();
  const openDropdownPopover = () => {
    const instance = createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
    setTimeout(() => {
      instance.update();
    }, 50)
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const router = useRouter()

  const toast = useToast();

  const logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()
    userService.logout()
    closeDropdownPopover()
  }

  const sendNotificationTest = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()
    pushNotificationService
    .sendNotificationTest()
    .then((response: any) => {
        toast.pushSuccess("Enviada com sucesso", 5000);
    })
    .catch(error => {
        toast?.pushError("Erro ao enviar notificação. " + error, 7000, "truncate-2-lines")
    });
    closeDropdownPopover()
  }

  return (
    <>
      <a
        className="block text-blueGray-500"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-12 h-12 text-sm text-white rounded-full cursor-pointer bg-blueGray-200">
            <img
              alt="..."
              className="w-full align-middle scale-95 border-none rounded-full shadow-lg scale-0097"
              src="/img/team-1-800x800.jpg"
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a

          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
          }
          onClick={(e) => e.preventDefault()}
        >
          <i className="mr-1 fa fa-user"></i> Perfil
        </a>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
          }
          onClick={(e) => sendNotificationTest(e)}
        >
          <i className="mr-1 fa fa-bell"></i> Notificação
        </a>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <a

          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
          }
          onClick={(e) => logout(e)}
        >
          <i className="mr-1 fa fa-sign-out-alt"></i> Sair
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
