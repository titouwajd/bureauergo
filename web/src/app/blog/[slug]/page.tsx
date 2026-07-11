import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category: string;
  categorySlug: string;
  readTime: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    title: "Comment choisir sa chaise de bureau ergonomique en 2026",
    excerpt:
      "Guide complet pour trouver la chaise idéale : support lombaire, accoudoirs réglables, matériaux respirants et budget.",
    date: "2026-06-15",
    slug: "guide-choisir-chaise-bureau-ergonomique",
    category: "Sièges",
    categorySlug: "sieges-bureau",
    readTime: "8 min",
    content: `
Passer huit heures par jour assis devant un écran n'est pas sans conséquence pour votre dos, vos épaules et votre cou. Investir dans une chaise de bureau ergonomique est l'un des meilleurs décisions que vous puissiez prendre pour votre santé au travail. Mais comment s'y retrouver face à la multitude d'offres ?

<h2>Les critères essentiels</h2>

<h3>Le support lombaire</h3>
<p>Un bon soutien lombaire est le premier élément à vérifier. Il doit être réglable en hauteur et en profondeur pour s'adapter à la courbure naturelle de votre colonne vertébrale. Sans support lombaire adéquat, vous risquez des douleurs chroniques dans le bas du dos.</p>

<h3>Les accoudoirs réglables</h3>
<p>Vos avant-bras doivent former un angle de 90 degrés lorsque vous tapez. Des accoudoirs réglables en hauteur, largeur et profondeur vous permettent d'atteindre cette position idéale. Certains modèles haut de gamme offrent même des accoudoirs 4D.</p>

<h3>L'assise et le dossier</h3>
<p>La profondeur d'assise doit permettre à vos cuisses d'être soutenues sans exercer de pression derrière les genoux. Privilégiez un dossier inclinable avec mécanisme synchrone qui suit naturellement les mouvements de votre corps.</p>

<h3>Les matériaux : mesh ou cuir ?</h3>
<ul>
  <li><strong>Le mesh (tissu respirant)</strong> : idéal pour les longues sessions, il évacue la chaleur et empêche la transpiration. C'est le choix recommandé pour une utilisation intensive.</li>
  <li><strong>Le cuir (simili ou véritable)</strong> : plus esthétique mais moins respirant. Convient aux environnements climatisés ou aux utilisations modérées.</li>
</ul>

<h2>Budget par gamme</h2>
<p>On distingue trois grandes catégories de prix :</p>
<ul>
  <li><strong>Entrée de gamme (150-300 €)</strong> : fonctionnel mais avec des réglages limités. Convient pour un usage occasionnel.</li>
  <li><strong>Moyenne gamme (300-600 €)</strong> : le meilleur rapport qualité-prix. Réglages complets, matériaux durables, garantie étendue.</li>
  <li><strong>Haut de gamme (600 € et plus)</strong> : matériaux premium, personnalisation poussée, certification ergonomique. Un investissement sur le long terme.</li>
</ul>

<h2>Nos recommandations</h2>
<p>Sur BureauErgo, nous avons sélectionné les meilleures chaises ergonomiques adaptées à chaque budget. Que vous cherchiez un modèle mesh respirant pour le télétravail ou un fauteuil en cuir pour votre bureau de direction, notre comparatif vous aide à faire le bon choix.</p>`,
  },
  {
    title: "Les 10 accessoires indispensables pour le télétravail",
    excerpt:
      "Améliorez votre productivité et votre confort avec ces accessoires essentiels pour le travail à domicile.",
    date: "2026-05-28",
    slug: "accessoires-indispensables-teletravail",
    category: "Accessoires",
    categorySlug: "accessoires-bureau",
    readTime: "6 min",
    content: `
Le télétravail s'est imposé dans notre quotidien, mais travailler depuis chez soi nécessite un équipement adapté. Voici les 10 accessoires qui feront la différence entre un home office bricolé et un véritable espace de travail productif.

<h2>1. Un support pour ordinateur portable</h2>
<p>Travailler avec l'écran de votre laptop à hauteur des yeux est essentiel pour éviter les douleurs cervicales. Un support réglable permet d'ajuster la hauteur et d'améliorer la circulation d'air autour de votre appareil.</p>

<h2>2. Un écran externe</h2>
<p>Un moniteur supplémentaire (ou une paire) démultiplie votre productivité. Vous pouvez avoir vos outils de communication sur un écran et votre travail sur l'autre. Optez pour une taille de 24 à 27 pouces avec une résolution minimale de 1080p.</p>

<h2>3. Un clavier ergonomique</h2>
<p>Le clavier de votre ordinateur portable n'est pas conçu pour une utilisation intensive. Un clavier ergonomique, qu'il soit à coupe unique ou divisé, réduit la tension sur vos poignets et vos avant-bras.</p>

<h2>4. Une souris verticale</h2>
<p>La souris traditionnelle force votre avant-bras à se tordre. Une souris verticale maintient votre main dans une position naturelle de poignée de main, réduisant considérablement le risque de syndrome du canal carpien.</p>

<h2>5. Une lampe de bureau</h2>
<p>Un bon éclairage est crucial. Choisissez une lampe avec température de couleur réglable (3000K à 5000K) et intensité variable. L'éclairage d'appoint réduit la fatigue oculaire et améliore la concentration.</p>

<h2>6. Un repose-poignet</h2>
<p>Associé à votre clavier et votre souris, un repose-poignet en gel ou en mousse à mémoire de forme maintient vos poignets en position neutre pendant la frappe.</p>

<h2>7. Un casque ou des écouteurs</h2>
<p>Indispensable pour les visioconférences. Un casque avec micro antibruit améliore la qualité de vos appels et vous isole des bruits domestiques.</p>

<h2>8. Un organiseur de câbles</h2>
<p>Les câbles qui traînent créent du désordre visuel et du stress. Des clips adhésifs, des gaines et un boîtier de gestion des câbles transforment votre bureau en espace ordonné.</p>

<h2>9. Un tapis de souris de grande taille</h2>
<p>Un tapis de bureau XXL protège votre surface de travail et offre un espace suffisant pour la souris et le clavier, tout en apportant une touche esthétique.</p>

<h2>10. Une plante dépolluante</h2>
<p>Enfin, une touche de verdure ! Une plante comme le pothos ou le spathiphyllum améliore la qualité de l'air et réduit le stress. C'est l'accessoire bien-être par excellence.</p>

<p>Avec ces 10 accessoires, votre espace de télétravail sera aussi confortable et productif qu'un vrai bureau professionnel. Découvrez notre sélection d'accessoires pour équiper votre poste de travail.</p>`,
  },
  {
    title: "Bureau assis-debout : avantages, inconvénients et comparatif 2026",
    excerpt:
      "Pourquoi et comment adopter le bureau assis-debout ? Analyse des bénéfices santé et productivité.",
    date: "2026-05-10",
    slug: "bureau-assis-debout-avantages-comparatif",
    category: "Mobilier",
    categorySlug: "mobilier-bureau",
    readTime: "10 min",
    content: `
Le bureau assis-debout, aussi appelé desk bike ou standing desk, a conquis le monde professionnel. Mais est-ce vraiment plus sain ? Et surtout, comment bien le choisir ? Notre analyse complète.

<h2>Les bienfaits pour la santé</h2>

<h3>Réduction des risques cardiovasculaires</h3>
<p>Une étude de l'American Heart Association montre que rester assis plus de 6 heures par jour augmente de 64% le risque de maladies cardiaques. Alterner positions assise et debout réduit ce risque significativement.</p>

<h3>Brûler plus de calories</h3>
<p>Rester debout brûle environ 0,7 calorie de plus par minute que la position assise. Sur une journée de 8 heures avec 50% du temps en position debout, cela représente environ 170 calories supplémentaires. Cumulé sur une semaine, c'est l'équivalent d'une séance de sport modérée.</p>

<h3>Amélioration de la posture</h3>
<p>La position debout force naturellement un meilleur alignement de la colonne vertébrale. Les douleurs lombaires liées à la sédentarité diminuent chez 87% des utilisateurs de bureaux assis-debout selon plusieurs enquêtes.</p>

<h2>Les bénéfices sur la productivité</h2>
<p>Contrairement à une idée reçue, la position debout n'altère pas la concentration. Au contraire, de nombreux utilisateurs rapportent une meilleure vigilance et une réduction de la fatigue post-prandiale (le fameux coup de pompe de 14h).</p>

<h2>Top modèles recommandés</h2>

<h3>Bureau manuel vs électrique</h3>
<ul>
  <li><strong>Manuel (vilebrequin)</strong> : moins cher, plus silencieux, mais plus long à régler. Idéal si vous changez rarement de position.</li>
  <li><strong>Électrique</strong> : plus rapide, précis, avec mémorisation des hauteurs. Recommandé pour une utilisation régulière.</li>
</ul>

<h3>Bureau fixe avec surélévateur</h3>
<p>Une alternative économique : placez un surélévateur motorisé sur votre bureau existant. Vous conservez votre espace de travail tout en bénéficiant de la flexibilité assis-debout. C'est la solution idéale pour un budget serré.</p>

<h2>Comment bien transitionner</h2>
<p>Ne passez pas brutalement de 0 à 8 heures debout. Commencez par 30 minutes le matin et 30 minutes l'après-midi, puis augmentez progressivement. Alternez toutes les 45 à 60 minutes pour un rythme optimal. Investissez dans un tapis anti-fatigue qui réduit la pression sur vos articulations.</p>

<p>Prêt à passer au bureau assis-debout ? Consultez notre gamme de mobilier ergonomique pour trouver le modèle qui correspond à vos besoins et à votre budget.</p>`,
  },
  {
    title: "Éclairage de bureau : comment éviter la fatigue oculaire",
    excerpt:
      "Le bon éclairage est essentiel pour votre santé visuelle. Découvrez les lampes les mieux notées.",
    date: "2026-04-22",
    slug: "eclairage-bureau-fatigue-oculaire",
    category: "Éclairage",
    categorySlug: "eclairage-bureau",
    readTime: "5 min",
    content: `
Saviez-vous que la fatigue oculaire, les maux de tête et la baisse de concentration sont souvent causés par un mauvais éclairage ? Pourtant, la solution est simple et accessible. Voici comment optimiser l'éclairage de votre bureau.

<h2>Comprendre la température de couleur</h2>
<p>La température de couleur se mesure en Kelvin (K). Plus le chiffre est bas, plus la lumière est chaude (jaune). Plus il est élevé, plus la lumière est froide (bleue).</p>
<ul>
  <li><strong>2700K-3000K (blanc chaud)</strong> : idéal pour la détente, la lecture sur papier.</li>
  <li><strong>3500K-4500K (blanc neutre)</strong> : parfait pour un bureau, il offre un bon équilibre entre concentration et confort visuel.</li>
  <li><strong>5000K-6500K (blanc froid)</strong> : stimule l'attention mais peut fatiguer les yeux en fin de journée.</li>
</ul>
<p>Privilégiez une lampe avec température réglable pour adapter la lumière à vos tâches et au moment de la journée.</p>

<h2>La luminosité adaptée</h2>
<p>Une lumière trop forte provoque de l'éblouissement ; trop faible force vos yeux à accommoder. La règle d'or : l'éclairage d'ambiance (plafonnier) doit être doux, et l'éclairage de travail (lampe de bureau) doit être dirigé directement sur votre plan de travail, sans créer d'ombres gênantes.</p>

<h2>Positionnement de la lampe</h2>
<p>Placez votre lampe de bureau du côté opposé à votre main dominante : à gauche si vous êtes droitier, à droite si vous êtes gaucher. Ainsi, la lumière éclaire votre travail sans créer d'ombre sous votre main. La source lumineuse doit se trouver au-dessus du bord supérieur de votre écran pour éviter les reflets.</p>

<h2>Les meilleures lampes de bureau</h2>
<ul>
  <li><strong>Lampe à bras articulé</strong> : flexible, elle se positionne précisément. Idéale pour les petits espaces.</li>
  <li><strong>Lampe barre LED</strong> : fixée au-dessus du moniteur, elle éclaire uniformément votre bureau sans prendre de place sur le bureau.</li>
  <li><strong>Lampe avec gradateur</strong> : permet d'ajuster l'intensité selon vos besoins et le moment de la journée.</li>
</ul>
<p>Toutes nos lampes recommandées offrent un indice de rendu des couleurs (IRC) supérieur à 90, garantissant une restitution fidèle des couleurs.</p>

<h2>Prévenir la fatigue oculaire au quotidien</h2>
<p>En complément d'un bon éclairage, appliquez la règle du 20-20-20 : toutes les 20 minutes, regardez à 20 pieds (6 mètres) pendant 20 secondes. Clignez régulièrement des yeux pour les lubrifier et réduisez la luminosité de vos écrans pour qu'elle soit comparable à celle de votre environnement.</p>`,
  },
  {
    title: "5 exercices pour soulager le mal de dos au bureau",
    excerpt:
      "Des étirements simples à faire à votre poste de travail pour prévenir les douleurs lombaires.",
    date: "2026-04-05",
    slug: "exercices-soulager-mal-de-dos-bureau",
    category: "Bien-être",
    categorySlug: "accessoires-bureau",
    readTime: "7 min",
    content: `
Rester assis 8 heures par jour met votre colonne vertébrale sous pression. Ces cinq exercices, à faire directement à votre bureau, vous aideront à prévenir et soulager les douleurs dorsales. Pas besoin de tenue de sport, juste 5 minutes par exercice.

<h2>1. Le roulement des épaules</h2>
<p><strong>Objectif :</strong> relâcher les tensions dans les trapèzes et les épaules.</p>
<p>Asseyez-vous droit, les bras le long du corps. Inspirez en montant les épaules vers les oreilles, puis expirez en les abaissant lentement en les roulant vers l'arrière. Effectuez 10 rotations vers l'arrière, puis 10 vers l'avant. Répétez 2 à 3 fois par jour, surtout après une longue période de concentration.</p>

<h2>2. La torsion assise</h2>
<p><strong>Objectif :</strong> mobiliser la colonne vertébrale et soulager les lombaires.</p>
<p>Assis bien droit, placez votre main droite sur votre genou gauche. Inspirez et, sur l'expiration, tournez doucement le buste vers la gauche en regardant par-dessus votre épaule. Maintenez 20 à 30 secondes, respirez profondément, puis répétez de l'autre côté. Attention : ne forcez jamais la rotation.</p>

<h2>3. L'extension debout</h2>
<p><strong>Objectif :</strong> contrer la cyphose (dos voûté) provoquée par la position assise prolongée.</p>
<p>Levez-vous, placez vos mains sur les hanches. Poussez doucement le bassin vers l'avant tout en ouvrant la poitrine vers le plafond. Vous devez sentir un étirement dans le bas du dos et l'abdomen. Maintenez 15 secondes, relâchez, répétez 5 fois.</p>

<h2>4. Les étirements des poignets</h2>
<p><strong>Objectif :</strong> prévenir le syndrome du canal carpien et les tendinites.</p>
<p>Tendez le bras devant vous, paume vers le plafond. Avec l'autre main, tirez doucement les doigts vers le bas. Vous devez sentir un étirement dans l'avant-bras. Maintenez 15 secondes, puis répétez paume vers le bas en poussant les doigts doucement vers l'arrière. Alternez les bras.</p>

<h2>5. L'étirement chat-vache (assis)</h2>
<p><strong>Objectif :</strong> assouplir toute la colonne vertébrale.</p>
<p>Asseyez-vous en bout de chaise, pieds à plat, mains sur les genoux. Inspirez en creusant le dos, poitrine ouverte et regard vers le plafond. Expirez en arrondissant le dos, menton vers la poitrine et nombril rentré. Alternez lentement 10 fois en suivant votre respiration.</p>

<h2>Rappel : la prévention avant tout</h2>
<p>Ces exercices sont très efficaces, mais ils ne remplacent pas une bonne posture et un équipement adapté. Une chaise ergonomique, un support d'écran à hauteur des yeux et des pauses régulières sont vos meilleurs alliés contre le mal de dos au bureau.</p>`,
  },
  {
    title: "Guide : organiser son bureau pour maximiser sa productivité",
    excerpt:
      "Rangement, organisation des câbles, supports écran : tous nos conseils pour un espace de travail optimisé.",
    date: "2026-03-18",
    slug: "organiser-bureau-maximiser-productivite",
    category: "Rangement",
    categorySlug: "rangement-bureau",
    readTime: "9 min",
    content: `
Un bureau encombré génère du stress et réduit votre capacité de concentration. Des études montrent que le désordre visuel sollicite inutilement votre cerveau et diminue votre productivité de 20%. Voici comment reprendre le contrôle de votre espace de travail.

<h2>1. La gestion des câbles</h2>
<p>C'est le premier pas vers un bureau ordonné. Les câbles qui serpentent partout sont non seulement inesthétiques mais aussi source de stress.</p>
<ul>
  <li><strong>Gaines et spirales</strong> : regroupez les câbles par faisceaux et glissez-les dans une gaine en tissu.</li>
  <li><strong>Clips adhésifs</strong> : fixez les câbles sous le bureau pour les faire courir le long des pieds.</li>
  <li><strong>Boîtier de gestion</strong> : un boîtier cache la multiprise et le transformateur, pour un résultat très propre.</li>
</ul>

<h2>2. Le rangement vertical</h2>
<p>Maximisez la surface utile de votre bureau en exploitant la hauteur :</p>
<ul>
  <li><strong>Étagères murales</strong> : idéales pour les livres, classeurs et objets décoratifs.</li>
  <li><strong>Range-documents debout</strong> : un classeur vertical ou un organiseur de courrier libère de l'espace.</li>
  <li><strong>Panneau perforé (pegboard)</strong> : accrochez vos outils, ciseaux, post-it et accessoires au mur, à portée de main.</li>
</ul>

<h2>3. Les organiseurs de tiroirs</h2>
<p>Les tiroirs deviennent vite un capharnaüm. Investissez dans des séparateurs ajustables ou des bacs modulables :</p>
<ul>
  <li>Un bac pour les fournitures de bureau (stylos, trombones, agrafeuse).</li>
  <li>Un bac pour les chargeurs et câbles de rechange.</li>
  <li>Un bac pour les documents administratifs en attente de traitement.</li>
</ul>
<p>Le principe est simple : une place pour chaque chose, chaque chose à sa place.</p>

<h2>4. Le minimalisme de bureau</h2>
<p>Ne gardez sur votre bureau que ce que vous utilisez quotidiennement. Testez la règle du <strong>« tout nettoyer en fin de journée »</strong> : chaque soir, remettez tout à sa place. Le matin, vous arrivez sur un espace vierge et prêt à travailler. Cette routine de 5 minutes transforme votre rapport au travail.</p>

<h2>5. Le désencombrement numérique</h2>
<p>Un bureau organisé passe aussi par le digital :</p>
<ul>
  <li>Nettoyez votre bureau d'ordinateur des fichiers inutiles.</li>
  <li>Organisez vos documents dans une arborescence claire.</li>
  <li>Limitez les notifications et les onglets ouverts.</li>
</ul>
<p>Un espace numérique épuré est aussi important qu'un espace physique rangé pour votre concentration.</p>

<h2>Les essentiels BureauErgo</h2>
<p>Pour vous accompagner dans cette transformation, notre gamme de rangement propose des solutions adaptées : supports d'écran pour libérer de la surface, organiseurs de tiroirs, boîtiers de gestion de câbles et étagères murales. Faites de votre bureau un sanctuaire de productivité.</p>`,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

function getRelatedPosts(slug: string, count: number = 3): BlogPost[] {
  return posts.filter((p) => p.slug !== slug).slice(0, count);
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Article non trouvé" };
  }

  return {
    title: `${post.title} - Blog ${SITE_NAME}`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

  const formattedDate = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const categoryHref = `/categorie/${post.categorySlug}`;
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.date,
            description: post.excerpt,
            author: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          }),
        }}
      />

      <article className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="text-gray-300">·</span>
            <Link
              href={categoryHref}
              className="text-xs font-medium px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-gray-300">·</span>
            <span>{post.readTime} de lecture</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {post.title}
          </h1>

          {/* Article content */}
          <div
            className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-li:text-gray-700 prose-li:mb-1 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:font-medium"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Découvrez nos produits recommandés
              </h3>
              <p className="text-gray-600 mb-6">
                Trouvez le meilleur équipement pour votre confort au bureau
                parmi notre sélection soigneusement choisie.
              </p>
              <Link
                href={categoryHref}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Voir notre gamme {post.category.toLowerCase()}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {rp.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {rp.readTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(rp.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
