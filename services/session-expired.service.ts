import { Dispatch, SetStateAction } from "react";

let setModalVisible: Dispatch<SetStateAction<boolean>> | null = null;

export const setSessionExpiredHandler = (
  setter: Dispatch<SetStateAction<boolean>>
) => {
  setModalVisible = setter;
};

export const triggerSessionExpired = () => {
  if (setModalVisible) {
    setModalVisible(true);
  }
};