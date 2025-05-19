import html2canvas from 'html2canvas';

export const getHtmlToImageCanvas = async (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;
  const parent = element.parentElement;

  if (!parent) return;
  parent.style.overflowX = 'visible';

  // const fontBold = await new FontFace(
  //   'gdsTransportFont',
  //   `url('/fonts/GDSTransportBold.ttf')`,
  //   { style: 'normal', weight: '700' }
  // ).load();
  //
  // const fontLight = await new FontFace(
  //   'gdsTransportFont',
  //   `url('/fonts/GDSTransportLight.ttf')`,
  //   { style: 'normal', weight: '400' }
  // ).load();

  const canvas = await html2canvas(element, {
    scale: 2.5,
    // onclone: async (document) => {
    //   console.log('Onclone');
    //   document.fonts.add(fontBold);
    //   document.fonts.add(fontLight);
    //   await document.fonts.ready;
    // },
  });
  parent.style.removeProperty('overflow-x');

  return canvas;
};
