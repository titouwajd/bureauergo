import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  robots: { index: false, follow: true },
};

export default function ConditionsUtilisation() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-gray">
      <h1>Conditions d&apos;utilisation</h1>
      <p>En utilisant le site {SITE_NAME}, vous acceptez les présentes conditions d&apos;utilisation.</p>

      <h2>1. Objet</h2>
      <p>Le site {SITE_NAME} est un guide comparatif d&apos;accessoires de bureau ergonomiques. Il propose des informations, avis et liens d&apos;affiliation vers des produits de tiers.</p>

      <h2>2. Contenu</h2>
      <p>Les informations présentes sur le site sont fournies à titre indicatif. Nous nous efforçons de maintenir ces informations exactes et à jour, mais ne pouvons garantir leur exhaustivité ou leur exactitude.</p>

      <h2>3. Liens d&apos;affiliation</h2>
      <p>Certains liens sur ce site sont des liens d&apos;affiliation. Si vous effectuez un achat après avoir cliqué sur l&apos;un de ces liens, nous pouvons percevoir une commission, sans coût supplémentaire pour vous. Cette commission n&apos;influence pas nos évaluations ou classements.</p>

      <h2>4. Propriété intellectuelle</h2>
      <p>Tous les contenus originaux du site (textes, logo, design) sont la propriété de {SITE_NAME}. Les images de produits et marques citées appartiennent à leurs propriétaires respectifs.</p>

      <h2>5. Commentaires et contributions</h2>
      <p>Les utilisateurs peuvent interagir avec le contenu dans le respect des lois et de la courtoisie. Tout contenu illicite, injurieux ou spam sera supprimé.</p>

      <h2>6. Limitation de responsabilité</h2>
      <p>{SITE_NAME} ne pourra être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder. Les prix affichés sont indicatifs et peuvent varier sur les sites marchands.</p>

      <h2>7. Modification des conditions</h2>
      <p>{SITE_NAME} se réserve le droit de modifier les présentes conditions à tout moment. Les modifications prennent effet dès leur publication.</p>

      <h2>8. Droit applicable</h2>
      <p>Les présentes conditions sont régies par le droit français. Tout litige relèvera de la compétence des tribunaux français.</p>
    </div>
  );
}
