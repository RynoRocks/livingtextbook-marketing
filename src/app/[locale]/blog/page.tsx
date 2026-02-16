import type { Metadata } from 'next';
import { getTranslations, getLocale, getMessages } from 'next-intl/server';
import { getAllBlogPosts, type BlogMessages } from '@/lib/blog';
import { FadeIn } from '@/components/ui/animated-card';
import { siteConfig } from '@/lib/seo';
import { BlogPostList } from '@/components/blog/BlogPostList';

type Props = { params: Promise<{ locale: string }> };

const blogSeo: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Blog | The Living Textbook',
    description: 'Insights on language learning science, AI-powered education, teaching methods, and the future of EdTech from The Living Textbook team.',
  },
  ja: {
    title: 'ブログ | ザ・リビング テキストブック',
    description: '言語学習科学、AI教育、教授法、EdTechの未来に関するインサイト。',
  },
  ko: {
    title: '블로그 | 더 리빙 텍스트북',
    description: '언어 학습 과학, AI 교육, 교수법, EdTech의 미래에 대한 인사이트.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = blogSeo[locale] || blogSeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        en: `${siteConfig.url}/en/blog`,
        ja: `${siteConfig.url}/ja/blog`,
        ko: `${siteConfig.url}/ko/blog`,
        'x-default': `${siteConfig.url}/en/blog`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteConfig.url}/${locale}/blog`,
      siteName: siteConfig.name,
      type: 'website',
      images: [{ url: `${siteConfig.url}/logo.png`, width: 1200, height: 630, alt: siteConfig.name }],
    },
  };
}

export default async function BlogPage() {
  const t = await getTranslations('blog');
  const messages = await getMessages() as unknown as BlogMessages;
  const locale = await getLocale();
  const posts = getAllBlogPosts(messages);

  const translations = {
    allCategories: t('allCategories'),
    categories: {
      'Platform': t('categories.Platform'),
      'Learning Science': t('categories.Learning Science'),
      'AI': t('categories.AI'),
      'Teaching': t('categories.Teaching'),
      'Assessment': t('categories.Assessment'),
      'Technology': t('categories.Technology'),
      'Trending': t('categories.Trending'),
    },
    readMore: t('readMore'),
    noPostsInCategory: t('noPostsInCategory'),
    pagination: {
      previous: t('pagination.previous'),
      next: t('pagination.next'),
      page: t('pagination.page'),
    },
  };

  return (
    <>
      {/* Hero */}
      <section className="py-hero bg-gradient-to-b from-white to-muted dark:from-background dark:to-muted">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-h1 mb-6">{t('pageTitle')}</h1>
              <p className="text-xl text-text">{t('pageSubtitle')}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {posts.length > 0 ? (
              <BlogPostList posts={posts} locale={locale} translations={translations} />
            ) : (
              <FadeIn>
                <div className="text-center py-12">
                  <p className="text-text text-lg">{t('noPosts')}</p>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
