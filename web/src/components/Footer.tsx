import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION, FOOTER_LINKS } from "@/lib/constants";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪑</span>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">{SITE_DESCRIPTION}</p>
            <p className="text-xs text-gray-500">
              En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-3">Catégories</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Ressources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">
              Recevez nos guides et bons plans chaque semaine.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
