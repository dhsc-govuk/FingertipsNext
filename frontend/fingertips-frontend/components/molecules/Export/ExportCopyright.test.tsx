import React from 'react';
import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';

import {
  exportCopyrightText,
  exportAccessedDate,
  ExportCopyright,
} from './ExportCopyright';

describe('ExportCopyright', () => {
  describe('exportCopyrightText', () => {
    it('returns the correct copyright text with the current year', () => {
      const year = new Date().getFullYear();
      expect(exportCopyrightText()).toBe(
        `©Crown copyright ${year}. Office for Health Improvement & Disparities.`
      );
    });
  });

  describe('exportAccessedDate', () => {
    it('returns the correct accessed date in the expected format', () => {
      const formattedDate = format(new Date(), 'd MMMM yyyy');
      expect(exportAccessedDate()).toBe(
        `Public Health Profiles accessed on ${formattedDate} www.fingertips.phe.org.uk`
      );
    });
  });

  describe('ExportCopyright component', () => {
    it('renders the correct content', () => {
      render(<ExportCopyright />);

      const year = new Date().getFullYear();
      const regCopyright = RegExp(
        `©Crown copyright ${year}. Office for Health Improvement & Disparities.`
      );
      expect(screen.getByText(regCopyright)).toBeInTheDocument();

      const formattedDate = format(new Date(), 'd MMMM yyyy');
      const regAccessed = RegExp(
        `Public Health Profiles accessed on ${formattedDate} www.fingertips.phe.org.uk`
      );
      expect(screen.getByText(regAccessed)).toBeInTheDocument();
    });
  });
});
