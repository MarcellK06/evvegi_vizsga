import { motion, useInView } from "framer-motion";
import { useRef } from "react";
function faq() {

    const FaqCard = (title, answer, index) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true });
        var title = title;
        var answer = answer;
        return (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="col my-2"
          >
            <div className="card h-100 bg-dark text-white">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
</svg>
                  <h5 className="card-title mb-0 mx-2">{title}</h5>
                </div>
                <hr />
                <p className="card-text mx-3">{answer}</p>
              </div>
            </div>
          </motion.div>
        );
      };
      
      const FAQS = [
        {"title": "Hogy működik az árajánlat kérés?", "answer": <p className="px-3">A kérésben leírt hibának és a megadott járműnek köszönhetően technikusaink könnyen megállapíthatják a szerelés idejét, és árát. Ha eszerint nem tudjuk beazonosítani a hibát és egy árat mondani, lehet megkérjük hogy járművét hozza be szerelőgarázsunkba ha lehetséges.</p>},
        {"title": "Hogyan tudok meggyőződni, hogy a piaci hirdetések megbízhatóak?", "answer": <p className="px-3">A piacon szereplő hirdetések adminisztrátoraink által ellenőrzöttek, ezáltal a megbizhatatlan hirdetés esélye közel a nullához.</p>},
        {"title": "Miért szükséges a jármű felvétele a fiókhoz, és a forgalmi befotózása miért kötelező?", "answer": <p className="px-3">Ez a folyamat fontos a felhasználó, és a szerelők munkájának megkönnyebbítéséhez. Ahelyett hogy magyarázni kelljen a jármű márkáját és adatait, helyette alvázszám alapján felkereshetjük. És emellett ha valamelyik felhasználó lopott járműből szeretne adni alkatrészt, ezt tudjuk ellenőrizni.</p>},
        {"title": "Milyen szerelési idő várható?", "answer": <p className="px-3">A szerelési idő a hibától függ, ha komolyabb hiba az lehet egy- vagy több hét is.</p>},
        {"title": "Milyen módon tudhatom meg, ha a járművem készen áll átvételre?", "answer": <p className="px-3">Értesítjük emailen keresztül, és felhasználói fiókján keresztül is a 'Saját Járművem' szekciónál. Ha 24 órán belül nem válaszol vagy veszi fel járművét, értesítjük telefonon keresztül.</p>},
        {"title": "Hogyan tudok megbizonyodni arról, hogy minőségi munkát végeznek?", "answer": <p className="px-3">technikusaink '<b>Gépjármű-mechatronikai technikus</b>' végzettséggel rendelkeznek. Ha javítás után a javított alkatrész továbbra is produkálja a hibát, vállaljuk az ingyenes javítást. Beépített alkatrészeinkre 12 hónap garanciát adunk.</p>}
      ];

      return (<>
      <div className="row mt-3">
      <div className="col-3"></div>
      <div className="col-6">
      {FAQS.map((i, idx) => FaqCard(i.title, i.answer, idx))}
      </div>
      <div className="col-3"></div></div>
      </>)

}

export default faq;