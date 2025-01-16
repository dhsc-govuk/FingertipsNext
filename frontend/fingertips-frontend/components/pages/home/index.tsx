'use client';

import { H3, H6, LeadParagraph } from 'govuk-react';

export const Home = () => {
  return(
    <>
      <H3>Access public health data</H3>
      <LeadParagraph>
        This is a free government service providing access to a wide range of public health data in England.
      </LeadParagraph>
      <H6>You can use this service to:</H6>
      <ul className="govuk-list govuk-list--bullet">
        <li>Identify and compare health trends and inequalities using data visualisations</li>
        <li>Download datasets and visualisations</li>
        <li>Access raw data via an application programming interface (API)</li>
      </ul>
      <p className="govuk-body">
        All data comes from trusted sources such as the NHS and Office of National Statistics (ONS).
        It is analysed to create a wide range of health and wellbeing data sets known as
        <a href="#" className="govuk-link"> indicators</a>, and themed topics known as
        <a href="#" className="govuk-link"> profiles</a>.</p>
      <H6>What are indicators and profiles</H6>
      <p className="govuk-body"> Indicators use data to show us how things are going and if there are any changes over
        time. For example if the number of people smoking in South West England has gone up or down in the last ten
        years. These indicators can be used to compare public heath by areas, and see how it is impacted by inequalities
        such as age, sex or ethnicity.</p>
      <p className="govuk-body">Indicators are used to create themed profiles that help build understanding of public
        health at a local, regional and national level. For example there will be multiple indicators for diabetes but a
        themed profile may combine other relevant indicators such as smoking or obesity to present a more rounded
        picture of the public health impact. </p>
      <H6>Who the service is for</H6>
      <p className="govuk-body">
        The service is free and available to everyone. Its primary role is to supports health professionals, policymakers, and researchers to monitor health trends, identify inequalities, and make informed decisions about public health in England.</p>
      </>
      )
      }