function About() {
  const sections = [
    {
      info: "Kik vagyunk mi?",
      answer: (
        <>
          <p>
            A <b>SzalkaCar™</b> egy egyéni vállalkozás, amely a felhasználók és
            szerelők munkájának megkönnyebbítésében specializál.
          </p>
        </>
      ),
    },
    {
      info: "Mi a célunk?",
      answer: (
        <>
          <p>
            A célunk egy olyan szerelő-ügyfél kapcsolatot létrehozni, amely a
            megbízást és kommunikációt részesíti előnyben.
          </p>
        </>
      ),
    },
  ];

  const sectionEntry = (i) => {
    var info = i.info;
    var answer = i.answer;
    return (
      <>
        <div className="row bg-dark mx-5 rounded my-2">
          <div className="col-12">
            <div className="row text-white ms-1">
              <p className="fs-3 mb-0 mt-1">{info}</p>
            </div>
            <div className="row ms-2 text-white">
              <hr />
              <p className="fs-5">{answer}</p>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container mt-3">
        {sections.map((i) => sectionEntry(i))}
      </div>
    </>
  );
}
export default About;
