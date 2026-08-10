import { Accessibility, CreditCard, Info, Package, Phone, ShieldCheck } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { UPMRC_DISCLAIMER } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Travel Information',
  description: 'Kanpur Metro travel information — tickets, accessibility, safety, lost & found and contact details.',
  path: '/information',
});

const SECTIONS = [
  {
    icon: CreditCard,
    title: 'Tickets & Smart Cards',
    body: 'Single-journey tokens and rechargeable smart cards are available at every operational station. Smart card terms and top-up amounts are set by UPMRC — check the official counter for current details. // UNVERIFIED — do not publish specific card pricing',
  },
  {
    icon: ShieldCheck,
    title: 'Safety & Security',
    body: 'All stations have security screening at entry. Follow staff instructions and do not carry prohibited items. Emergency buttons and help points are available on platforms.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    body: 'Stations are equipped with lifts. If you need assistance, ask station staff at the ticket counter.',
  },
  {
    icon: Package,
    title: 'Lost & Found',
    body: 'If you lose an item on the metro, contact station staff at the nearest station or the UPMRC helpline. // UNVERIFIED — no public lost & found process published',
  },
  {
    icon: Phone,
    title: 'Customer Care',
    body: 'UPMRC operates official helplines for metro queries. This independent guide does not publish or operate a helpline — refer to official UPMRC channels.',
  },
] as const;

export default function InformationPage() {
  return (
    <div className="container-page pb-20 md:pb-0 py-10">
      <h1 className="section-heading flex items-center gap-3">
        <Info className="h-8 w-8 text-metro-blue" aria-hidden="true" />
        Travel Information
      </h1>
      <p className="section-subheading">
        Practical information for riding the Kanpur Metro. {UPMRC_DISCLAIMER}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <section key={title} className="card p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Icon className="h-5 w-5 text-metro-blue" aria-hidden="true" />
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
