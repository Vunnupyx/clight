import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const Button = ({ children, href }) => {
  return (
    <div className="col col--2 margin-horiz--sm">
      <Link
        className="button button--outline button--primary button--lg"
        to={href}
      >
        {children}
      </Link>
    </div>
  );
};

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
      <header className={clsx('hero', styles.hero)}>
        <div className="container text--center">
          {/* <div className={styles.heroLogoWrapper}>
            <img
              className={styles.heroLogo}
              src={useBaseUrl('img/image.svg')}
              alt="Overview"
            />
          </div> */}
          <h2 className={clsx('hero__title', styles.heroTitle)}>
            {siteConfig.title}
          </h2>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={clsx(styles.heroButtons, 'name', 'margin-vert--md')}>
            <Button href={useBaseUrl('docs/')}>
              <Translate>Documentation</Translate>
            </Button>
            <Button href={useBaseUrl('docs/')}>
              <Translate>Quick Start Guide</Translate>
            </Button>
          </div>
        </div>
      </header>
    </Layout>
  );
}
