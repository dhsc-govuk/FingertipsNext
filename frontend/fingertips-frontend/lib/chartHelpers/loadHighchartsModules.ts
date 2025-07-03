export async function loadHighchartsModules(callback: () => void) {
  await import('highcharts/modules/exporting');
  await import('highcharts/modules/map');
  await import('highcharts/highcharts-more').then(callback);
}
