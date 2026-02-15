'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();

  const navigation = [
    { name: t('features'), href: `/${locale}/features` },
    { name: t('educators'), href: `/${locale}/for-educators` },
    { name: t('learners'), href: `/${locale}/for-learners` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container-custom flex items-center justify-between py-4">
        <a href="https://www.lokalingo.com/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="The Living Textbook" width={32} height={32} className="rounded" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary leading-tight">The Living Textbook</span>
            <span className="text-xs text-muted-foreground leading-tight">by LokaLingo</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-text hover:text-primary transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="accent" size="lg">
            <Link href="/login">{t('cta')}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 text-text"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container-custom py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-text hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text font-medium">{t('language')}</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text font-medium">{t('theme')}</span>
                <ThemeToggle />
              </div>
              <Button asChild variant="accent" className="w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  {t('cta')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
