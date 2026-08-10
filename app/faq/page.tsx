import { buildMetadata } from '@/lib/metadata';
import { faqItems } from '@/services/metro';
import { FAQSection } from '@/components/faq/FAQSection';
import { absoluteUrl } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about the Kanpur Metro — timings, fares, stations and connectivity.',
  path: '/faq',
});

export default function FAQPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading">Aksar Puche Jane Wale Sawaal</h1>
      <p className="section-subheading">
        Everything you need to know about riding the Kanpur Metro.
      </p>
      <div className="mt-8 max-w-3xl">
        <FAQSection />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...faqLd, url: absoluteUrl('/faq') }) }}
      />
    </div>
  );
}
