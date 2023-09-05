import G6 from "@antv/g6";

export const renderGraph = (
  containerId: string,
  width: number | undefined,
  height: number | undefined,
  data: any,
  layout: string | null,
  staticGraph=false
) => {
  console.log('渲染', containerId)

  //设置布局
  let graphLayout = {};
  switch (layout){
    case 'force':
      graphLayout = {
        type: 'force',
        preventOverlap: true,
        nodeSize: 20,
        nodeStrength: -100
      };break;
    case 'radial':
      graphLayout = {
        type: 'radial',
        preventOverlap: true,
        nodeSize: 30,
      }
  }

  //设置和图的交互
  let modes = {}
  if(!staticGraph){
    modes = {
      default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
    }
  }

  const graph = new G6.Graph({
    container: containerId,
    width,
    height,

    fitCenter: true,
    layout: graphLayout,
    modes: modes
  });

  graph.data(data)
  graph.render()
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

//生成若干个尽可能容易分辨的颜色
export const generateDistinctColors = (numColors: number) => {
  const colors: string[] = [];
  const hueStep: number = 360 / numColors;

  for (let i = 0; i < numColors; i++) {
    const hue: number = i * hueStep;
    const saturation: number = 70 + Math.random() * 20; // 控制饱和度在70-90之间
    const lightness: number = 50 + Math.random() * 10; // 控制亮度在50-60之间

    const color: string = hslToHex(hue, saturation, lightness);
    colors.push(color);
  }

  return colors;
}




