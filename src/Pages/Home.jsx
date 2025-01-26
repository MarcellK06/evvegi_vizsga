import { useContext, useEffect } from "react";
import { ModalContext } from "../Providers/ModalProvider";
function Home() {
  const { CreateModal } = useContext(ModalContext);

  return (
    <>
      <button onClick={() => CreateModal("asd", <h1>BANDI</h1>, true)}>
        OPen Modal
      </button>
    </>
  );
}
export default Home;
