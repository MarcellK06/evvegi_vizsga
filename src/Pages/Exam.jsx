function Exam() {
  return (
    <>
      <div className="row my-3">
        <div className="col-2"></div>
        <div className="col-8 d-flex">
          <p className="mx-auto fs-4">
            <a href="/user-doc" className=" text-decoration-none text-black">
              Felhasználói Dokumentáció
            </a>
          </p>
          <p className="mx-auto fs-4">
            <a href="/dev-doc" className=" text-decoration-none text-black">
              Fejlesztői Dokumentáció
            </a>
          </p>
          <p className="mx-auto fs-4">
            <a href="/test-doc" className=" text-decoration-none text-black">
              Tesztelői Dokumentáció
            </a>
          </p>
          <p className="mx-auto fs-4">
            <a href="https://api.szalkacar.hu/ppt" className=" text-decoration-none text-black">
              PPT Prezentáció
            </a>
          </p>
        </div>
        <div className="col-2"></div>
      </div>
    </>
  );
}

export default Exam;
