export const svgStringFromElement = (element: SVGSVGElement): string => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(element);
};
