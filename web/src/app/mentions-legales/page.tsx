import { Metadata } from "next";
import { SITE_NAME, ADMIN_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-gray">
      <h1>Mentions légales</h1>
      <p>Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique, il est précisé aux utilisateurs du site {SITE_NAME} l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son suivi.</p>

      <h2>Édition du site</h2>
      <p>Le site {SITE_NAME} est édité par un particulier, joignable à l&apos;adresse email : {ADMIN_EMAIL}.</p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

      <h2>Propriété intellectuelle</h2>
      <p>Sauf mention contraire, l&apos;ensemble des contenus (textes, images, logo) présents sur le site {SITE_NAME} est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.</p>

      <h2>Liens d&apos;affiliation</h2>
      <p>Le site {SITE_NAME} participe à des programmes d&apos;affiliation. Cela signifie que lorsque vous cliquez sur certains liens et effectuez un achat, nous pouvons percevoir une commission, sans surcoût pour vous. En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.</p>

      <h2>Données personnelles</h2>
      <p>Les données collectées sur ce site (email via newsletter, logs de recherche) sont traitées conformément à notre Politique de Confidentialité. Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour l&apos;exercer, contactez-nous à {ADMIN_EMAIL}.</p>

      <h2>Limitation de responsabilité</h2>
      <p>Les informations diffusées sur le site {SITE_NAME} sont fournies à titre indicatif. Nous nous efforçons de maintenir ces informations à jour et exactes, mais ne pouvons garantir leur exhaustivité. Les prix affichés sont donnés à titre indicatif et peuvent varier.</p>
    </div>
  );
}
