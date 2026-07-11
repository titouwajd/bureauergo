import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez l'équipe ${SITE_NAME} pour toute question, suggestion ou demande de partenariat.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-gray-600 mb-6">
          Une question sur un produit ? Une suggestion ? Une demande de partenariat ?
          N&apos;hésitez pas à nous contacter.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" id="name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
            <select id="subject" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Question générale</option>
              <option>Proposition de partenariat</option>
              <option>Signaler une erreur</option>
              <option>Demande presse</option>
              <option>Autre</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea id="message" rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
