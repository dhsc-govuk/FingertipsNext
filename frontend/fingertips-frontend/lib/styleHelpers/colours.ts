export enum GovukColours {
  Red = '#D4351C',
  Yellow = '#FFDD00',
  Green = '#00703C',
  Blue = '#1D70B8',
  DarkBlue = '#003078',
  LightBlue = '#5694CA',
  Purple = '#4C2C92',
  Black = '#0B0C0C',
  DarkGrey = '#505A5F',
  MidGrey = '#B1B4B6',
  LightGrey = '#F3F2F1',
  White = '#FFFFFF',
  LightPurple = '#A285D1',
  BrightPurple = '#912B88',
  Pink = '#D53880',
  LightPink = '#F499BE',
  Orange = '#F46A25',
  Brown = '#B58840',
  LightGreen = '#85994B',
  Turquoise = '#28A197',
  DarkPink = '#801650',
  OtherLightPurple = '#6F72AF',
  CharcoalGray = '#3D3D3D',
  Female = '#5352BE',
  Male = '#57AEF8',
  DarkSlateGray = '#D7D7D7',
}

export enum TagColours {
  GreyText = '#303436',
  GreyBackground = '#E1E2E3',
  // benchmarks
  DarkRed = '#831504',
  LightBlue = '#AFCFE5', //chart-lower99
  // trends
  YellowBackground = '#FFF5BB',
  YellowText = '#514311',
  GreenBackground = '#C4DED3',
  GreenText = '#00502D',
  RedBackground = '#F6C6BF',
  RedText = '#270D0B',
  LightBlueBackground = '#E3EFF6',
}

export enum QuintileColours {
  Lowest = '#E4DDFF',
  Low = '#CBBEF4',
  Middle = '#AA90EC',
  High = '#8B60E2',
  Highest = '#6B33C3',
  Worst = '#D494C1',
  Worse = '#BC6AAA',
  MiddleWithValue = '#A44596',
  Better = '#812972',
  Best = '#561950',
}

export function getTextColour(backgroundColour: string) {
  switch (backgroundColour) {
    case GovukColours.Green:
    case GovukColours.Red:
    case GovukColours.LightBlue:
    case GovukColours.DarkBlue:
    case GovukColours.Blue:

    case TagColours.DarkRed:

    case QuintileColours.High:
    case QuintileColours.Highest:
    case QuintileColours.MiddleWithValue:
    case QuintileColours.Better:
    case QuintileColours.Best:
      return GovukColours.White;
  }
  return GovukColours.Black;
}
