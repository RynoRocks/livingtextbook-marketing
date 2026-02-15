'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const footerLinks = {
    product: [
      { name: tNav('features'), href: `/${locale}/features` },
      { name: tNav('educators'), href: `/${locale}/for-educators` },
      { name: tNav('learners'), href: `/${locale}/for-learners` },
      { name: t('login'), href: '/login' },
    ],
    lokalingo: [
      { name: t('lokaSite'), href: 'https://lokalingo.com' },
      { name: t('blog'), href: 'https://lokalingo.com/en/blog' },
      { name: t('contact'), href: 'https://lokalingo.com/en/contact' },
    ],
    legal: [
      { name: t('privacy'), href: 'https://lokalingo.com/en/privacy' },
      { name: t('terms'), href: 'https://lokalingo.com/en/terms' },
      { name: t('cookies'), href: 'https://lokalingo.com/en/cookies' },
    ],
  };

  return (
    <footer className="bg-primary dark:bg-[hsl(230,60%,8%)] text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <a href="https://www.lokalingo.com/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="The Living Textbook" width={28} height={28} className="rounded" />
              <div>
                <span className="text-xl font-bold tracking-wide block leading-tight">The Living Textbook</span>
                <span className="text-white/70 text-xs block leading-tight">by LokaLingo</span>
              </div>
            </a>
            <p className="text-white/90 text-sm leading-relaxed">{t('tagline')}</p>
            <a
              href="mailto:ryan@lokalingo.com"
              className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-all inline-flex"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('productTitle')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/90 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LokaLingo */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('lokaTitleCol')}</h4>
            <ul className="space-y-3">
              {footerLinks.lokalingo.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('legalTitle')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/80 text-sm text-center">
            &copy; {new Date().getFullYear()} LokaLingo {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
