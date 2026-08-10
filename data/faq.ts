/**
 * data/faq.ts
 *
 * Frequently asked questions. Answers only contain verified or
 * clearly-labelled information.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: 'operating-hours',
    question: 'What are the Kanpur Metro operating hours?',
    answer: 'Trains run from 06:00 to 22:00 daily, as per publicly reported schedules. Exact frequency and holiday timings are not officially published — check at the station.',
  },
  {
    id: 'number-of-stations',
    question: 'How many stations does Kanpur Metro have?',
    answer: '14 stations are operational on Corridor 1, from IIT Kanpur to Kanpur Central. 7 more stations toward Naubasta are under construction.',
  },
  {
    id: 'fare-charges',
    question: 'How much does a Kanpur Metro ticket cost?',
    answer: 'Fares follow publicly reported UPMRC slabs based on the number of stops travelled. Use the Fare Calculator for an estimate and verify at the station before travel.',
  },
  {
    id: 'kanpur-central-connection',
    question: 'Does the metro connect to Kanpur Central Railway Station?',
    answer: 'Yes. Kanpur Central metro station is adjacent to the railway station concourse.',
  },
  {
    id: 'contact-upmrc',
    question: 'How do I contact Kanpur Metro authorities?',
    answer: 'Kanpur Metro is operated by UPMRC (Uttar Pradesh Metro Rail Corporation). This website is an independent travel guide and is not affiliated with, endorsed by, or connected to UPMRC.',
  },
];
