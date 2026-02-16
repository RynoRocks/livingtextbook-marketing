import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, getLocale, getMessages } from 'next-intl/server';
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { getFullBlogPost, blogPosts, BlogMessages, getLocalizedSlug, findSlugLocale } from '@/lib/blog';
import { siteConfig } from '@/lib/seo';
import { BlogContent } from '@/components/blog/BlogContent';
import { BlogHeroImage } from '@/components/blog/BlogHeroImage';
import { Button } from '@/components/ui/button';
import { locales } from '@/i18n';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.flatMap((post) =>
    locales.map((locale) => ({ locale, slug: getLocalizedSlug(post, locale) }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = await getMessages() as unknown as BlogMessages;
  const post = getFullBlogPost(slug, messages, locale);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | The Living Textbook`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
      languages: {
        en: `${siteConfig.url}/en/blog/${slug}`,
        ja: `${siteConfig.url}/ja/blog/${slug}`,
        ko: `${siteConfig.url}/ko/blog/${slug}`,
        'x-default': `${siteConfig.url}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/${locale}/blog/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.heroImage
        ? [{ url: post.heroImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: `${siteConfig.url}/logo.png`, width: 1200, height: 630, alt: siteConfig.name }],
    },
    authors: [{ name: post.author }],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const messages = await getMessages() as unknown as BlogMessages;
  const locale = await getLocale();
  const post = getFullBlogPost(slug, messages, locale);

  if (!post) {
    const match = findSlugLocale(slug);
    if (match && match.locale !== locale) {
      redirect(`/${match.locale}/blog/${slug}`);
    }
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.heroImage && { image: post.heroImage }),
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'The Living Textbook', url: siteConfig.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.url}/${locale}/blog/${slug}` },
    url: `${siteConfig.url}/${locale}/blog/${slug}`,
    inLanguage: locale,
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.url}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteConfig.url}/${locale}/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <section className="py-section bg-gradient-to-b from-white to-muted dark:from-background dark:to-muted">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToBlog')}
            </Link>

            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>

            <h1 className="text-h1 mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-text">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pb-8 bg-gradient-to-b from-muted to-background dark:from-muted dark:to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <BlogHeroImage
              src={post.heroImage}
              alt={post.title}
              category={post.category}
              priority
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <article className="max-w-3xl mx-auto prose prose-lg prose-headings:text-primary prose-p:text-text prose-strong:text-primary prose-a:text-accent hover:prose-a:text-primary prose-ul:text-text prose-ol:text-text prose-li:text-text dark:prose-invert">
            <BlogContent content={post.content} />
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section bg-gradient-to-b from-muted to-background dark:from-card dark:to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-h2 mb-8">{t('backToBlog')}</h2>
            <Button asChild variant="accent" size="xl">
              <Link href={`/${locale}/blog`}>
                {t('backToBlog')}<ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
