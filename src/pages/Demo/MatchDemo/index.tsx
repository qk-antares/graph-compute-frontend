import React, {useEffect} from "react";
import G6 from "@antv/g6";
import {GADDI} from "@antv/algorithm";

const MatchDemo: React.FC = ()=>{
  const colors = [
    '#5F95FF',
    '#61DDAA',
    '#65789B',
    '#F6BD16',
    '#7262FD',
    '#78D3F8',
    '#9661BC',
    '#F6903D',
    '#008685',
    '#F08BB4',
  ];
  const colorSets = G6.Util.getColorSetsBySubjectColors(colors, '#fff', 'default', '#777');
  console.log('colorSet', colorSets)
  const colorMap = new Map();
  // 在初始化时放入一些键值对
  colorMap.set('C', colorSets[0]);
  colorMap.set('N', colorSets[1]);
  colorMap.set('H', colorSets[2]);
  colorMap.set('O', colorSets[3]);
  colorMap.set('S', colorSets[4]);

  const data = require('./mock.json')

  useEffect(()=>{
    const button = document.createElement('button');
    button.innerHTML = `点此开始匹配`;
    document.getElementById('container')?.appendChild(button);

    const container = document.getElementById('container');
    const width = container?.scrollWidth;
    const height = (container?.scrollHeight || 500) - 20;

    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      fitView: true,
      layout: {
        type: 'gForce',
        nodeStrength: 100,
        minMovement: 0.1,
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
    });

    const legendDataMap = {}

    data.nodes.forEach((node, i) => {
      const colorSet = colorMap.get(node.label)
      node.style = {
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
      }
      if (!legendDataMap[node.label]) {
        legendDataMap[node.label] = {
          shape: 'circle',
          r: 6,
          text: node.label,
          fill: colorSet.mainFill,
          stroke: colorSet.mainStroke,
        }
      }
    })
    data.edges.forEach((edge, i) => {
      const colorSet = colorSets[0];
      edge.style = {
        stroke: colorSet.mainStroke,
        lineWidth: 2,
        opacity: 0.3,
      }
    })
    graph.data(data);
    graph.render();


    const pattern = {
      "nodes": [
        {
          "id": "1",
          "label": "C"
        },
        {
          "id": "2",
          "label": "O"
        },
        {
          "id": "3",
          "label": "O"
        },
        {
          "id": "4",
          "label": "H"
        }
      ],
      "edges": [
        {
          "source": "1",
          "target": "2"
        },
        {
          "source": "1",
          "target": "3"
        },
        {
          "source": "3",
          "target": "4"
        }
      ]
    }

    // draw pattern graph
    pattern.nodes.forEach(pNode => {
      const colorSet = colorMap.get(pNode.label);
      pNode.style = {
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
      }
    });
    pattern.edges.forEach(pEdge => {
      const colorSet = colorSets[0];
      pEdge.style = {
        stroke: colorSet.mainStroke,
      }
    });
    const patternGraphWidth = Math.max(width / 5, 100);
    const patternGraphHeight = Math.max(height / 5, 100);
    const patternGraph = new G6.Graph({
      container: 'container',
      width: patternGraphWidth,
      height: patternGraphHeight,
      fitView: true,
      layout: {
        type: 'circular'
      }
    })
    patternGraph.data(pattern);
    patternGraph.render();
    const patternCanvas = patternGraph.get('canvas');
    const patternCanvasEl = patternCanvas.get('el');
    patternCanvasEl.style.position = 'absolute';
    patternCanvasEl.style.top = '50px';
    patternCanvasEl.style.left = '15px';
    patternCanvasEl.style.backgroundColor = '#eee';
    patternCanvasEl.style.opacity = 0.7;
    patternCanvas.addShape('text', {
      attrs: {
        text: 'Pattern',
        x: patternGraphWidth - 55,
        y: patternGraphHeight - 10,
        fill: '#000',
        fontWeight: 500
      }
    })


    // draw legend
    const legendGroup = graph.get('canvas').addGroup({
      attrs: {
        opacity: 0.7
      }
    });
    const legendBack = legendGroup.addShape('rect', {
      attrs: {
        height: 10,
        width: 10,
        x: 5,
        y: -10,
        fill: '#eee'
      }
    })
    legendGroup.addShape('text', {
      attrs: {
        text: 'Legend',
        x: 40,
        y: 5,
        fill: '#000',
        fontWeight: 500
      }
    })

    Object.keys(legendDataMap).forEach((cluster, i) => {
      const lData = legendDataMap[cluster];
      legendGroup.addShape(lData.shape, {
        attrs: {
          x: 20,
          y: 20 + i * 25,
          x1: 13,
          x2: 28,
          y1: 20 + i * 25,
          y2: 20 + i * 25,
          ...lData
        }
      })
      legendGroup.addShape('text', {
        attrs: {
          x: 35,
          y: 20 + i * 25,
          text: lData.text,
          fill: '#000',
          textBaseline: 'middle'
        }
      })
    })
    const legendBBox = legendGroup.getBBox();
    legendBack.attr({
      width: legendBBox.width + 10,
      height: legendBBox.height + 10
    })
    legendGroup.setMatrix([1, 0, 0, 0, 1, 0, -10, patternGraphHeight + 40, 1])


    // click the button to run GADDI graph pattern matching
    // and the result will be marked with hull
    button.addEventListener('click', (e) => {
      const matches = GADDI(
        data,
        pattern,
        false,
        undefined,
        undefined,
        'label',
        undefined
      );

      console.log('匹配结果', matches)

      // const jsonData = JSON.stringify(matches, null, 2); // Convert object to JSON string with indentation (2 spaces)
      // const blob = new Blob([jsonData], { type: 'application/json' });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'ans.json';
      // a.click();
      // URL.revokeObjectURL(url);


      matches.forEach((match, i) => {
        graph.createHull({
          id: `match-${i}`,
          members: match.nodes.map(node => node.id),
          style: {
            fill: '#008685'
          }
        })
      });
      button.innerHTML = `The results are marked with hulls 结果已用轮廓标记`;
      button.disabled = true;
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight - 20);
      };
  }, [])

  return (<div id='container' style={{width: 800, height: 500}}>

  </div>)
}

export default MatchDemo
