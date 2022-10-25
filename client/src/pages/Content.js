import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "../components/Navbar";

import Screen1 from "../assets/phone1.png";
import Screen2 from "../assets/phone2.png";
import Screen3 from "../assets/phone3.png";
import Down from "../assets/chevron-down-solid.svg";
import AppleStore from "../assets/appStore.png";
import PlayStore from "../assets/googlePlay.png";
import Flex1 from "../assets/flex1.png";
import Flex2 from "../assets/flex2.png";
import Flex3 from "../assets/flex3.png";
import Jet from "../assets/jet-2.png";
import Roadmap from "../assets/roadmap.jpg"

import "../styles/css/style.css";
import { Accordion } from "../components/Accordion";

function App() {

  const BottomRef = useRef(null);

  const scrollBottom = () => {
    BottomRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
    <div id="header">
      <Navbar />
      <div className="content">
        <h1>Waren</h1>
        <h2>Application</h2>
        <p>
          WAREN est un service de réservation de jet à la demande grâce à une
          application sécurisée, sur laquelle les informations personnelles
          des clients ne courent aucun risque.
        </p>
      </div>
      <div className="down" onClick={scrollBottom}>
        <img src={Down} alt="down" />
      </div>
    </div>
    <div id="hero">
      <div className="screens">
        <img src={Screen1} alt="screen" />
        <img src={Screen2} alt="screen" />
        <img src={Screen3} alt="screen" />
      </div>
    </div>
    <div id="download">
      <div className="wrapper">
        <a
          href="https://www.apple.com/fr/store"
          target="_blank"
          rel="noreferrer"
        >
          <img src={AppleStore} alt="appleStore" />
        </a>
        <a
          href="https://play.google.com/store/games?hl=fr&gl=US"
          target="_blank"
          rel="noreferrer"
        >
          <img src={PlayStore} alt="playStore" />
        </a>
      </div>
    </div>
    <div id="about">
      <h2>Pourquoi l'aviation privée attire de plus en plus de clients ?</h2>
      <p>
        <span>
          <strong>Voyager en jet</strong> permet de passer outre les
          contraintes des aéroports classiques afin d’arriver quelques minutes
          avant son vol et aussi d’éviter les escales, de choisir son horaire,
          et tout cela facilement.
          <strong>Voyager en jet</strong> permet aussi, et de plus en plus,
          aux entreprises de faire voyager leurs cadres et ainsi de gagner du
          temps et de la productivité.
          <strong>Voyager en jet</strong> permettra enfin, à tout une nouvelle
          tranche de la population (startuper, traders et investisseurs),
          d’accéder à ce service d’excellence aéronautique.
        </span>
      </p>
      <p>
        Cependant nous avons remarqué que ce service haut de gamme pouvait
        être encore amélioré. Suite à la crise du covid-19, qui a frappé le
        monde entier, le marché de la location de jets privés a bénéficié d’un
        sursaut de popularité. En effet, la demande en matière d'affrètement
        aérien a bien changé. Lors du troisième trimestre de 2019, avant
        l'arrivée du covid 19 ; la personne type qui louait un jet privé est
        un homme âgé d'en moyenne 40 ans.
        <br />
        <br />
        Cependant grâce aux réseaux sociaux, la demande a explosé malgré un
        service très haut de gamme.
      </p>
      <h2>
        Pour plus de détails consultez notre Étude de marché ou Business plan*
      </h2>
    </div>
    <section id="time">
      <div className="title">
        <h2>Gain de temps</h2>
      </div>
      <div className="content">
        <div className="card">
          <div className="head">
            <h3>Conciergerie traditionnelle</h3>
          </div>
          <div className="body">
            <ul>
              <li>
                Appel téléphonique pour demande de devis : <span>30min</span>
              </li>
              <li>
                Retour devis : entre <span>1 heure et 24 heures</span>
              </li>
              <li>
                Prise en charge et passage des contrôles : <span>2h30</span>
              </li>
              <li>
                Formalités d’arrivée : <span>1h</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="head">
            <h3>Waren</h3>
          </div>
          <div className="body">
            <ul>
              <li>
                Application : <span>immédiat</span>
              </li>
              <li>
                Prise en charge et passage des contrôles :{" "}
                <span>15 minutes</span>
              </li>
              <li>
                Formalités d'arrivée : <span>30 minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section id="access-flex">
      <div id="access">
        <div className="title">
          <h2>Accessibilité</h2>
        </div>
        <div className="content">
          <div className="card">
            <div className="head">
              <h3>
                Comparatifs des tarifs <br />
                <span>traditionnel / waren</span>
              </h3>
            </div>
            <div className="body">
              <div className="container">
                <p>
                  Avec l’application Warren, les prix seront imbattables,
                  grâce au système de vols vide.
                </p>
                <h5>Les tarifs pour un vol PARIS/CANNES :</h5>
                <div className="price">
                  <div className="trad">
                    <h6>Traditionnel</h6>
                    <p>12 000€</p>
                  </div>
                  <div className="divider"></div>
                  <div className="waren">
                    <h6>Waren</h6>
                    <p>3 000€</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="info">
              Ce jet, de toute manière doit retourner au Bourget, c'est
              pourquoi sur l’application le retour Cannes/Paris sera à moindre
              coût. Le jet ne restera pas à l'aéroport de Cannes, car le prix
              de stockage sera beaucoup plus élevé que le simple retour sur le
              Bourget. Nous avons optimisé ce système au maximum pour
              permettre des prix extrêmement compétitifs.
            </p>
          </div>
        </div>
      </div>
      <div id="flex">
        <div className="title">
          <h2>Flexibilité</h2>
        </div>
        <div className="container">
          <div className="card">
            <img src={Flex1} alt="flex1" />
            <div className="text">
              <h6>Conseils d'experts</h6>
              <p>24h/24</p>
            </div>
          </div>
          <div className="card">
            <img src={Flex2} alt="flex2" />
            <div className="text">
              <h6>Estimation de prix</h6>
              <p>en temps réel</p>
            </div>
          </div>
          <div className="card">
            <img src={Flex3} alt="flex3" />
            <div className="text">
              <h6>Réservation</h6>
              <p>24h/24</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="about-secondary">
      <h3>
        Plus besoin d'appeler, ou d'envoyer d'e-mail à votre conciergerie pour
        effectuer vos réservations ! Tout ce passe sur l’application WAREN :{" "}
      </h3>
      <ul>
        <li>Personnalisation de l'équipage de bord.</li>
        <li>Choix de son appareil. (en temps normal celui-ci est imposé).</li>
        <li>Choix des options à bord. (nourriture, boissons, ...).</li>
        <li>Délai d'embarquement et aéroportuaire simplifié.</li>
        <li>Des services Exclusifs proposés par nos partenaires.</li>
      </ul>
      <h3>
        Avec Waren vous ne voyagerez plus simplement en jet, vous créerez un
        voyage en jet unique selon vos besoin.
      </h3>
    </section>
    <section id="vip">
      <div className="container">
        <div className="title">
          <h2>Services vip</h2>
        </div>
        <div className="grid">
          <div className="row">
            <div className="card">
              <p>Chauffeur privé</p>
            </div>
            <div className="card">
              <p>Salon privé VIP</p>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <p>Menus gastronomiques au choix</p>
            </div>
            <div className="card">
              <p>Personnalisation du vol</p>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <p>Confidentialité</p>
            </div>
            <div className="card">
              <p>Confort inégalable</p>
            </div>
          </div>
        </div>
        <h4>
          Une messagerie privée dédiée à toutes les demandes
          <br />
          de nos clients.
        </h4>
      </div>
    </section>
    <section id="vip-secondary">
      <div className="title">
        <h2>Services vip</h2>
      </div>
      <div className="wrapper">
        <div className="card">
          <p>VERY LIGHT JET / PHENOM 100 & 500</p>
        </div>
        <div className="card">
          <p>LIGHT JET / HAWKER 400</p>
        </div>
        <div className="card">
          <p>MIDDLE JET</p>
        </div>
      </div>
      <h5>
        Chaque jet est disponible sur <br />
        l'application waren
      </h5>
    </section>
    <section id="faq">
      <div className="title">
        <h2>Investissement</h2>
      </div>
      <div className="container">
        <Accordion title="Pourquoi investir avec waren ?">
          <p>
            Sabry Pascal Dabou cumule 7 ans d'expériences dans le domaine de
            l’aviation privée avec son équipe, il connaît les avantages et les
            inconvénients de son secteur. C'est pourquoi il a souhaité
            développer un outil logistique simple et efficace pour les
            particuliers et les entreprises. Aujourd’hui, vous avez la
            possibilité de pouvoir pénétrer ce milieu très fermé de l’aviation
            privée.
          </p>
          <h5>"Avec Waren, Voyager en toute tranquilité et sérénité"</h5>
          <h6>Sabry Pascall Dabou</h6>
        </Accordion>
        <Accordion title="Notre vision & nos objectifs">
          <p>
            Waren permet aux investisseurs de participer à la construction du
            projet. L’objectif est d'acquérir plusieurs appareils : Embraer
            Phenom 100 , Gulfstream G-400, le Challenger 650. Cela permettra
            d’augmenter les marges sans passer par des fournisseurs de jets
            privés en location. <br />
            <br /> Nous avons également l’ambition de rendre accessible des
            services de luxe, jusqu’ici réservés à une minorité de personnes
            privilégiées grâce à une application mobile aussi intuitive que
            simple. Nous nous sommes donnés l’objectif non seulement d’être
            avant-gardiste, mais également d’utiliser à bon escient les
            technologies disponibles, notamment la blockchain, pour rendre le
            service irréprochable et créer une application facile à utiliser. {" "}
            <br />
            <br /> Objectif de la levée de fonds : 50 millions d'euros
          </p>
          <h5>"Créons ensemble, la trajectoire de notre avenir"</h5>
          <h6>Sabry Pascall Dabou</h6>
        </Accordion>
        <Accordion title="Road map">
          <img src={Roadmap} alt="roadmap" />
        </Accordion>
      </div>
    </section>
    <div className="footer" ref={BottomRef}>
      <img src={Jet} alt="jet" />
      <Link to="/mint">
        <button><p>Pre-sale</p></button>
      </Link>
    </div>
    </>
  );
}

export default App;