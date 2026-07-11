import { Metadata } from "next";
import { SITE_NAME, ADMIN_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-gray">
      <h1>Politique de confidentialité</h1>
      <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      <p>La présente politique de confidentialité décrit comment {SITE_NAME} collecte, utilise et protège vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD).</p>

      <h2>1. Données collectées</h2>
      <p>Nous collectons les données suivantes :</p>
      <ul>
        <li><strong>Adresse email</strong> : lorsque vous vous inscrivez à notre newsletter.</li>
        <li><strong>Requêtes de recherche</strong> : les termes que vous recherchez sur notre site, à des fins d&apos;amélioration du service.</li>
        <li><strong>Données de navigation</strong> : adresse IP, pages visitées, durée de visite (via des cookies analytics si vous les acceptez).</li>
      </ul>

      <h2>2. Finalités du traitement</h2>
      <ul>
        <li>Envoi de la newsletter (1 email par semaine maximum).</li>
        <li>Amélioration du moteur de recherche interne.</li>
        <li>Analyse d&apos;audience anonymisée.</li>
        <li>Suivi des clics sur les liens d&apos;affiliation (anonymisé).</li>
      </ul>

      <h2>3. Base légale</h2>
      <p>Le traitement de vos données repose sur :</p>
      <ul>
        <li>Votre consentement (inscription newsletter, cookies).</li>
        <li>Notre intérêt légitime (amélioration du service, sécurité).</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>Notre site utilise des cookies pour :</p>
      <ul>
        <li>Mémoriser votre consentement aux cookies.</li>
        <li>Mesurer l&apos;audience de manière anonyme.</li>
      </ul>
      <p>Aucun cookie publicitaire tiers n&apos;est déposé sans votre consentement explicite. Vous pouvez à tout moment retirer votre consentement en effaçant les cookies de votre navigateur.</p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>Données newsletter : jusqu&apos;au désabonnement.</li>
        <li>Logs de recherche : 12 mois.</li>
        <li>Cookies analytics : 13 mois maximum.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>Droit d&apos;accès à vos données.</li>
        <li>Droit de rectification.</li>
        <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;).</li>
        <li>Droit à la portabilité.</li>
        <li>Droit d&apos;opposition.</li>
        <li>Droit de retirer votre consentement à tout moment.</li>
      </ul>
      <p>Pour exercer ces droits, contactez-nous à : {ADMIN_EMAIL}.</p>

      <h2>7. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.</p>

      <h2>8. Contact</h2>
      <p>Pour toute question relative à cette politique : {ADMIN_EMAIL}.</p>
    </div>
  );
}
