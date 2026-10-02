import { createContext, useContext, useState } from "react";

const CreateSuccessContext = createContext(null);

export function CreateSuccessProvider({ children }) {
  const [createdItem, setCreatedItem] = useState(null);

  const showCreateSuccess = (type, data) => {
    setCreatedItem({
      type,
      data,
    });
  };

  const hideCreateSuccess = () => {
    setCreatedItem(null);
  };

  return (
    <CreateSuccessContext.Provider
      value={{
        createdItem,
        showCreateSuccess,
        hideCreateSuccess,
      }}
    >
      {children}
    </CreateSuccessContext.Provider>
  );
}

export function useCreateSuccess() {
  const context = useContext(CreateSuccessContext);

  if (!context) {
    throw new Error(
      "useCreateSuccess must be used inside CreateSuccessProvider"
    );
  }

  return context;
}