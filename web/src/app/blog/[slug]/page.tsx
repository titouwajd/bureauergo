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
<p>Sur ErgoZone, nous avons sélectionné les meilleures chaises ergonomiques adaptées à chaque budget. Que vous cherchiez un modèle mesh respirant pour le télétravail ou un fauteuil en cuir pour votre bureau de direction, notre comparatif vous aide à faire le bon choix.</p>`,
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

<h2>Les essentiels ErgoZone</h2>
<p>Pour vous accompagner dans cette transformation, notre gamme de rangement propose des solutions adaptées : supports d'écran pour libérer de la surface, organiseurs de tiroirs, boîtiers de gestion de câbles et étagères murales. Faites de votre bureau un sanctuaire de productivité.</p>`,
  },
  {
    title: "Comparatif des meilleurs supports PC portables ergonomiques 2026",
    excerpt:
      "Aluminium, bambou ou plastique ? Découvrez notre comparatif complet des supports PC portables pour améliorer votre posture au travail.",
    date: "2026-07-01",
    slug: "comparatif-supports-pc-portables-ergonomiques-2026",
    category: "Accessoires",
    categorySlug: "accessoires-bureau",
    readTime: "7 min",
    content: `
Travailler sur un ordinateur portable sans support adapté, c'est la garantie de douleurs cervicales à moyen terme. Un support PC portable permet de surélever l'écran à hauteur des yeux, améliorant instantanément votre posture. Mais face à la multiplicité des modèles, comment choisir le bon ? Voici notre comparatif 2026.

<h2>Les matériaux : aluminium, bambou ou plastique ?</h2>

<h3>Support en aluminium</h3>
<p>L'aluminium est le matériau roi des supports PC. Robustes, légers et excellents conducteurs thermiques, les supports en aluminium dissipent la chaleur de votre ordinateur, évitant la surchauffe lors des sessions intensives. Leur design épuré s'intègre dans tous les environnements professionnels.</p>

<h3>Support en bambou</h3>
<p>Alternative écologique et chaleureuse, le bambou offre une excellente stabilité et une esthétique naturelle. Moins conducteur thermique que l'aluminium, il convient parfaitement pour un usage bureautique standard. Attention cependant au poids : les modèles en bambou sont souvent moins portables.</p>

<h3>Support en plastique</h3>
<p>Plus abordables mais moins durables, les supports en plastique conviennent pour un usage occasionnel ou un budget serré. Vérifiez la présence d'aérations et la stabilité avant achat.</p>

<h2>Les critères de choix indispensables</h2>
<ul>
  <li><strong>Réglage de la hauteur</strong> : privilégiez un support avec plusieurs niveaux (au minimum 3 à 6 positions) pour adapter l'angle de vue à votre morphologie.</li>
  <li><strong>Ventilation</strong> : un bon support doit laisser circuler l'air sous le PC. Les modèles à grille ajourée ou avec ventilateurs intégrés sont idéaux pour les PC puissants.</li>
  <li><strong>Portabilité</strong> : si vous vous déplacez régulièrement, optez pour un modèle pliable en aluminium, léger (moins de 500 g) et glissable dans une sacoche.</li>
  <li><strong>Compatibilité</strong> : vérifiez que le support accepte la taille de votre PC (de 10 à 17 pouces selon les modèles).</li>
</ul>

<h2>Notre top 5 des supports PC portables</h2>
<ul>
  <li><strong>Support aluminium pliable (20-30€)</strong> : le meilleur rapport qualité-prix. Léger, stable, 6 niveaux de hauteur. Idéal pour le télétravail nomade.</li>
  <li><strong>Support ventilé USB (25-40€)</strong> : deux ventilateurs silencieux intégrés. Parfait pour les PC gamers ou les stations de montage vidéo.</li>
  <li><strong>Support bambou fixe (30-45€)</strong> : design scandinave, excellente stabilité, idéal pour un bureau fixe à domicile.</li>
  <li><strong>Support vertical (15-25€)</strong> : pour ranger votre PC fermé et le connecter à un écran externe. Libère un maximum d'espace sur le bureau.</li>
  <li><strong>Support réglable premium (40-50€)</strong> : mécanisme à crémaillère, hauteur ajustable au millimètre. Le choix des professionnels exigeants.</li>
</ul>

<h2>Et après l'achat ?</h2>
<p>Une fois votre PC surélevé à hauteur des yeux, n'oubliez pas d'investir dans un clavier et une souris externes. Sans cela, vous échangerez vos douleurs cervicales contre des douleurs aux poignets ! Découvrez notre sélection d'<a href="/categorie/accessoires-bureau">accessoires de bureau</a> pour compléter votre installation.</p>`,
  },
  {
    title: "Lampe de bureau LED : comment bien choisir son éclairage ?",
    excerpt:
      "Température de couleur, luminosité, filtration lumière bleue : tout ce qu'il faut savoir pour choisir la lampe de bureau idéale.",
    date: "2026-07-03",
    slug: "lampe-bureau-led-bien-choisir-eclairage",
    category: "Éclairage",
    categorySlug: "eclairage-bureau",
    readTime: "6 min",
    content: `
Une bonne lampe de bureau, c'est l'accessoire que tout le monde néglige — jusqu'au premier mal de tête en fin de journée. L'éclairage impacte directement votre concentration, votre fatigue oculaire et même votre humeur. Voici comment choisir la lampe de bureau LED idéale pour votre espace de travail.

<h2>La température de couleur : un choix stratégique</h2>
<p>La température de couleur, mesurée en Kelvin (K), détermine l'ambiance lumineuse. Trois grandes familles existent :</p>
<ul>
  <li><strong>3000K — blanc chaud</strong> : lumière douce, légèrement jaune. Idéale pour la lecture détente ou un bureau dans une chambre. Moins adaptée au travail de précision.</li>
  <li><strong>4000K — blanc neutre</strong> : le compromis idéal pour un bureau. Ni trop froid ni trop chaud, il reproduit fidèlement les couleurs et maintient la vigilance sans agresser les yeux.</li>
  <li><strong>6000K — blanc froid</strong> : lumière bleutée qui stimule l'attention. Efficace le matin mais à éviter en soirée car elle perturbe la production de mélatonine et donc le sommeil.</li>
</ul>
<p>Notre recommandation : une lampe à température réglable (3000K-5000K) qui s'adapte à votre rythme circadien tout au long de la journée.</p>

<h2>La luminosité : combien de lumens ?</h2>
<p>Pour un bureau, visez entre 400 et 800 lumens pour l'éclairage d'appoint. En dessous, vous plisserez les yeux ; au-dessus, vous risquez l'éblouissement. Une lampe avec variateur d'intensité vous permettra d'ajuster la luminosité selon la lumière ambiante et l'heure de la journée.</p>

<h2>Filtration de la lumière bleue</h2>
<p>Certaines lampes LED intègrent un filtre anti-lumière bleue, bénéfique pour vos yeux lors des sessions de travail prolongées. Ce n'est pas un argument marketing : la lumière bleue à spectre élevé accélère la fatigue oculaire numérique. Les lampes certifiées « Low Blue Light » (RG0 ou RG1) sont à privilégier.</p>

<h2>Bras articulé et flexibilité</h2>
<p>Un bras articulé permet de positionner la lumière précisément là où vous en avez besoin — sur un document papier, un coin du clavier ou un plan de travail. Les modèles à double bras offrent une amplitude maximale. Vérifiez la qualité des articulations : elles doivent rester stables une fois positionnées, sans retomber.</p>

<h2>USB ou secteur ?</h2>
<p>Les lampes USB sont pratiques (alimentées directement par votre PC ou une batterie externe) mais souvent moins puissantes. Privilégiez une lampe sur secteur avec port USB intégré : vous pourrez y recharger votre téléphone tout en travaillant.</p>

<h2>Les meilleures lampes sous 50€ en 2026</h2>
<ul>
  <li><strong>Lampe LED à bras articulé (35-45€)</strong> : 3 modes de température, variateur tactile, port USB. Le meilleur rapport qualité-prix du marché.</li>
  <li><strong>Barre LED pour moniteur (25-35€)</strong> : se fixe au-dessus de l'écran, éclairage asymétrique sans reflets, idéale pour les petits bureaux.</li>
  <li><strong>Lampe d'architecte LED (40-50€)</strong> : design classique, large tête, parfaite pour couvrir un grand bureau.</li>
</ul>
<p>Découvrez toutes nos lampes recommandées dans notre catégorie <a href="/categorie/eclairage-bureau">éclairage de bureau</a>. Vos yeux vous remercieront !</p>`,
  },
  {
    title: "Télétravail : 7 erreurs qui ruinent votre dos (et comment les corriger)",
    excerpt:
      "Mauvaises postures, écran trop bas, chaise inadaptée : identifiez et corrigez les 7 erreurs qui abîment votre dos en télétravail.",
    date: "2026-07-05",
    slug: "teletravail-erreurs-dos-corriger",
    category: "Bien-être",
    categorySlug: "accessoires-bureau",
    readTime: "8 min",
    content: `
Le télétravail a conquis des millions de Français, mais nos dos, eux, n'ont pas signé le contrat. Travailler depuis son canapé, sa table de cuisine ou un bureau improvisé entraîne des douleurs qui peuvent devenir chroniques. Voici les sept erreurs les plus courantes — et comment les corriger simplement.

<h2>Erreur n°1 : l'écran trop bas</h2>
<p><strong>Le problème :</strong> quand vous baissez la tête pour regarder votre écran de PC portable, vos cervicales supportent une charge équivalente à 27 kg — contre 5 kg en position neutre. Résultat : raideurs, migraines et tensions chroniques.</p>
<p><strong>La solution :</strong> surélevez votre écran pour que le bord supérieur soit à hauteur de vos yeux. Un <a href="/categorie/accessoires-bureau">support PC portable</a> à 25€ suffit. Si vous utilisez un écran externe, un <a href="/categorie/supports-ecran">bras articulé</a> est encore plus efficace.</p>

<h2>Erreur n°2 : la chaise inadaptée</h2>
<p><strong>Le problème :</strong> une chaise de cuisine ou un tabouret sans accoudoirs ni soutien lombaire vous pousse à vous avachir, comprimant les disques intervertébraux.</p>
<p><strong>La solution :</strong> investissez dans une <a href="/categorie/sieges-bureau">chaise ergonomique</a> avec support lombaire réglable. En attendant, glissez un coussin dans le bas de votre dos et assurez-vous que vos pieds touchent le sol.</p>

<h2>Erreur n°3 : les pieds qui ne touchent pas le sol</h2>
<p><strong>Le problème :</strong> des pieds suspendus créent une pression sur l'arrière des cuisses, gênant la circulation sanguine et déséquilibrant votre bassin.</p>
<p><strong>La solution :</strong> utilisez un repose-pieds (dès 25€) ou une caisse solide. L'angle entre vos cuisses et vos mollets doit être de 90 degrés.</p>

<h2>Erreur n°4 : le clavier mal positionné</h2>
<p><strong>Le problème :</strong> taper sur un clavier trop haut ou trop bas force vos poignets en extension, favorisant les tendinites et le syndrome du canal carpien.</p>
<p><strong>La solution :</strong> vos avant-bras doivent être parallèles au sol, poignets dans le prolongement des bras. Un repose-poignet en mousse (15€) fait des miracles pour soulager la pression.</p>

<h2>Erreur n°5 : l'absence de pauses</h2>
<p><strong>Le problème :</strong> rester assis plus de deux heures d'affilée ralentit le métabolisme et comprime la colonne vertébrale.</p>
<p><strong>La solution :</strong> levez-vous 5 minutes toutes les heures. Marchez jusqu'à la cuisine, faites quelques étirements ou passez vos appels debout. Un minuteur ou une application de rappel vous y aidera.</p>

<h2>Erreur n°6 : la distance écran-yeux incorrecte</h2>
<p><strong>Le problème :</strong> un écran trop proche fatigue vos yeux ; trop éloigné, il vous force à vous pencher en avant.</p>
<p><strong>La solution :</strong> tendez le bras devant vous : le bout de vos doigts doit effleurer l'écran. Pour un moniteur 24-27 pouces, la distance idéale est de 50 à 70 cm.</p>

<h2>Erreur n°7 : travailler depuis le canapé</h2>
<p><strong>Le problème :</strong> le canapé, c'est le piège numéro un. Assis en tailleur ou avachi contre un accoudoir, votre colonne adopte une forme en C délétère.</p>
<p><strong>La solution :</strong> créez un poste de travail dédié, même dans un petit espace. Une table, une chaise correcte et un support d'écran suffisent. Votre dos vaut bien ces quelques mètres carrés.</p>

<h2>En résumé</h2>
<p>Ces sept corrections ne coûtent pas cher — certaines sont même gratuites. Le plus important est d'en prendre conscience et d'agir avant que la douleur ne s'installe. Pour vous équiper correctement, explorez notre sélection de <a href="/categorie/sieges-bureau">sièges ergonomiques</a> et d'<a href="/categorie/accessoires-bureau">accessoires de bureau</a>. Votre dos vous dira merci.</p>`,
  },
  {
    title: "Hub USB-C ou docking station : lequel choisir pour son bureau ?",
    excerpt:
      "Hub nomade ou station d'accueil complète ? Comparatif, besoins en connectique et recommandations pour ne pas se tromper.",
    date: "2026-07-07",
    slug: "hub-usb-c-vs-docking-station-bureau",
    category: "High-tech",
    categorySlug: "high-tech-bureau",
    readTime: "6 min",
    content: `
Vous avez un PC portable avec seulement deux ports USB-C et vous branchez-débranchez vos périphériques toute la journée ? Il est temps de simplifier votre vie. Hub USB-C et docking station résolvent ce problème, mais ils ne répondent pas aux mêmes besoins. Voici comment choisir le bon équipement.

<h2>Hub USB-C vs docking station : quelles différences ?</h2>
<p>Un <strong>hub USB-C</strong> est un petit répartiteur de ports, léger et nomade (50 à 150 g), qui se branche directement sur le port USB-C de votre PC. Il ajoute généralement 3 à 7 ports (USB-A, HDMI, lecteur SD, Ethernet).</p>
<p>Une <strong>docking station</strong> est un boîtier plus imposant, alimenté sur secteur, conçu pour rester sur votre bureau. Elle offre plus de ports, une alimentation Power Delivery jusqu'à 100W, le support multi-écrans et une connexion plus stable. C'est le choix sédentaire par excellence.</p>

<h2>Évaluez vos besoins en connectique</h2>
<p>Avant d'acheter, listez tout ce que vous branchez simultanément :</p>
<ul>
  <li><strong>Écran externe</strong> : vérifiez la résolution et la fréquence supportées par le hub. Un hub HDMI 2.0 gère le 4K@60Hz ; un HDMI 1.4 plafonne à 4K@30Hz.</li>
  <li><strong>Multi-écrans</strong> : si vous utilisez deux moniteurs externes, une docking station est quasi indispensable. Les hubs simples ne gèrent souvent qu'un seul écran.</li>
  <li><strong>Ethernet</strong> : pour une connexion filaire stable en visioconférence, le port RJ45 est un vrai plus.</li>
  <li><strong>Lecteur SD</strong> : indispensable pour les photographes et vidéastes.</li>
  <li><strong>Périphériques USB-A</strong> : clavier, souris, imprimante, clé USB, webcam... comptez le nombre de ports nécessaires.</li>
</ul>

<h2>La Power Delivery : ne négligez pas la recharge</h2>
<p>Si votre hub ne gère pas la Power Delivery (PD), vous devrez occuper un deuxième port USB-C pour recharger votre PC. Les bons hubs USB-C transmettent entre 60W et 100W, ce qui suffit pour la majorité des ultrabooks. Vérifiez la puissance maximale supportée et comparez-la à celle de votre chargeur d'origine.</p>

<h2>Budget : hub nomade ou dock premium ?</h2>
<ul>
  <li><strong>Hub USB-C portable (20-40€)</strong> : 4 à 6 ports, idéal pour le télétravail nomade et les déplacements. Léger, compact, branché en 3 secondes.</li>
  <li><strong>Hub USB-C avancé (40-70€)</strong> : plus de ports, Power Delivery, Ethernet, parfois double HDMI. Le bon compromis pour un bureau à domicile.</li>
  <li><strong>Docking station (80-200€)</strong> : la solution complète pour un poste de travail fixe. Multi-écrans 4K, PD 100W, 10+ ports, connexion sécurisée.</li>
</ul>

<h2>Nos recommandations 2026</h2>
<ul>
  <li><strong>Pour les nomades :</strong> un hub USB-C 6-en-1 avec HDMI 4K, PD 60W et lecteur SD. Budget : 25-35€.</li>
  <li><strong>Pour le bureau à domicile :</strong> un hub USB-C 8-en-1 avec Ethernet Gigabit, HDMI 4K@60Hz et PD 100W. Budget : 50-70€.</li>
  <li><strong>Pour les pros multi-écrans :</strong> une docking station Thunderbolt ou USB-C avec double HDMI/DisplayPort et 10+ ports. Budget : 120-180€.</li>
</ul>
<p>Quel que soit votre choix, un bon hub ou dock transforme radicalement votre expérience de travail. Découvrez notre sélection <a href="/categorie/high-tech-bureau">high-tech</a> pour équiper votre bureau.</p>`,
  },
  {
    title: "Guide : créer un espace de travail ergonomique pour moins de 200€",
    excerpt:
      "Support PC, clavier, lampe, gestion des câbles : voici comment aménager un bureau ergonomique complet avec un budget maîtrisé.",
    date: "2026-07-09",
    slug: "guide-espace-travail-ergonomique-moins-200-euros",
    category: "Accessoires",
    categorySlug: "accessoires-bureau",
    readTime: "9 min",
    content: `
Créer un poste de travail ergonomique ne coûte pas forcément une fortune. Avec un budget de 200€, vous pouvez constituer un environnement complet qui préserve votre santé et booste votre productivité. Voici notre guide pas à pas, poste de dépense par poste de dépense.

<h2>Support PC portable — 25€</h2>
<p>Premier achat, première priorité. Un support en aluminium pliable surélève votre écran à hauteur des yeux et dissipe la chaleur. À ce prix, vous aurez un modèle à 6 niveaux de réglage, léger et stable. C'est l'investissement le plus rentable de ce guide : vos cervicales vous remercieront dès le premier jour.</p>

<h2>Clavier + souris ergonomiques — 40€</h2>
<p>Taper sur le clavier d'un PC portable surélevé est une torture pour les poignets. Un ensemble clavier-souris sans fil correct coûte environ 40€. Privilégiez un clavier compact (sans pavé numérique) pour rapprocher la souris et réduire l'amplitude des mouvements. Les souris verticales, qui placent la main en position « handshake », sont de plus en plus accessibles (dès 20€) et soulagent efficacement le poignet.</p>

<h2>Lampe de bureau LED — 35€</h2>
<p>L'éclairage est le grand oublié des budgets ergonomiques. Une lampe LED à bras articulé avec température et intensité réglables coûte environ 35€. Placez-la du côté opposé à votre main dominante pour éviter les ombres portées. Une lumière bien positionnée réduit la fatigue oculaire et les maux de tête en fin de journée. Consultez notre sélection d'<a href="/categorie/eclairage-bureau">éclairage de bureau</a> pour trouver la lampe idéale.</p>

<h2>Gestion des câbles — 15€</h2>
<p>Un bureau envahi de câbles est visuellement stressant. Pour 15€, vous pouvez acquérir un kit de gestion de câbles : gaines en tissu, clips adhésifs sous le bureau, serre-câbles velcro et un boîtier cache-multiprise. Résultat : un espace de travail propre et apaisant.</p>

<h2>Repose-poignet — 15€</h2>
<p>Un repose-poignet en mousse à mémoire de forme maintient vos poignets dans l'alignement de vos avant-bras pendant la frappe et l'utilisation de la souris. À 15€, c'est un petit achat qui prévient les tendinites et le syndrome du canal carpien.</p>

<h2>Repose-pieds — 30€</h2>
<p>Si vos pieds ne touchent pas le sol quand vous êtes assis correctement, un repose-pieds est indispensable. Les modèles inclinables avec surface texturée (30€) soulagent la pression sous les cuisses et améliorent la circulation sanguine. Alternative gratuite : une caisse en bois solide ou un gros annuaire.</p>

<h2>Bras pour écran — 40€</h2>
<p>Si vous utilisez un écran externe, un <a href="/categorie/supports-ecran">bras articulé</a> à 40€ libère un espace considérable sur votre bureau et permet un positionnement parfait de l'écran. La plupart des modèles à ce prix supportent des écrans de 17 à 27 pouces et offrent une rotation à 360° ainsi qu'une fonction pivot (mode portrait).</p>

<h2>Récapitulatif du budget</h2>
<ul>
  <li>Support PC portable : <strong>25€</strong></li>
  <li>Clavier + souris : <strong>40€</strong></li>
  <li>Lampe LED : <strong>35€</strong></li>
  <li>Gestion câbles : <strong>15€</strong></li>
  <li>Repose-poignet : <strong>15€</strong></li>
  <li>Repose-pieds : <strong>30€</strong></li>
  <li>Bras écran : <strong>40€</strong></li>
</ul>
<p><strong>Total : 200€</strong> pour un poste de travail complet qui protège votre dos, vos yeux et vos poignets — bien moins cher qu'une seule séance chez l'ostéopathe par mois pendant un an.</p>

<h2>Par où commencer ?</h2>
<p>Si votre budget est vraiment serré, commencez par le support PC (25€) et le repose-poignet (15€). Ces deux achats corrigent les problèmes posturaux les plus urgents. Vous pourrez ensuite étoffer votre installation mois par mois. Pour chaque catégorie, consultez nos guides et comparatifs dans la rubrique <a href="/categorie/accessoires-bureau">accessoires de bureau</a>.</p>`,
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
