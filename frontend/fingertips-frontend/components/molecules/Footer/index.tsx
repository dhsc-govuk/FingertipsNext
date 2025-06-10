'use client';

import { contactEmailLink, GDSLink } from '@/lib/links';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { Footer, Link } from 'govuk-react';
import styled from 'styled-components';
import { ProjectVersion } from '@/components/atoms/ProjectVersion';

const FooterContainer = styled('ul')({
  padding: 0,
  marginBottom: 15,
});

const FooterListItem = styled('li')({
  display: 'inline-block',
  marginRight: 15,
  marginBottom: 5,
});

const FooterLink = styled(Link)({
  'fontWeight': 300,
  ':link': {
    color: GovukColours.Black,
  },
  ':visited': {
    color: GovukColours.Black,
  },
});

interface FTFooterProps {
  tag?: string;
  hash?: string;
  chartPage?: boolean;
}

export function FTFooter({ tag, hash, chartPage = false }: FTFooterProps) {
  return (
    <Footer
      className={chartPage ? 'chart-page-footer' : ''}
      meta={
        <FooterContainer>
          <FooterListItem>
            <FooterLink href="#">Help</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href="#">Privacy</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href="#">Cookies</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href="#">Accessibility statement</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href={contactEmailLink}>Contact</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href="#">Terms and conditions</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href="#">Rhestr o Wasanaethau Cymraeg</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink href={GDSLink}>Government Digital Service</FooterLink>
          </FooterListItem>
          <ProjectVersion tag={tag} hash={hash} />
        </FooterContainer>
      }
      copyright={{
        image: {
          height: 102,
          src: 'govuk-crest.svg',
          width: 125,
        },
        link: 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
        text: 'Crown copyright',
      }}
    />
  );
}
