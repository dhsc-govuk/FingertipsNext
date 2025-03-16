'use client';

import { GovukColours } from '@/lib/styleHelpers/colours';
import { Footer, Link } from 'govuk-react';
import styled from 'styled-components';

const FooterContainer = styled('div')({
  marginBottom: 15,
});

const FooterLink = styled(Link)({
  'fontWeight': 300,
  'marginRight': 15,
  ':link': {
    color: GovukColours.Black,
  },
  ':visited': {
    color: GovukColours.Black,
  },
});

export function FTFooter() {
  return (
    <Footer
      meta={
        <FooterContainer>
          <FooterLink href="#">Help</FooterLink>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Cookies</FooterLink>
          <FooterLink href="#">Accessibility statement</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
          <FooterLink href="#">Terms and conditions</FooterLink>
          <br />
          <FooterLink href="#">Rhestr o Wasanaethau Cymraeg</FooterLink>
          <FooterLink href="#">Government Digital Service</FooterLink>
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
