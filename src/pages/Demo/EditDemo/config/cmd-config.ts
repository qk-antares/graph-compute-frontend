import { createCmdConfig, DisposableCollection } from '@antv/xflow';

export const useCmdConfig = createCmdConfig((config) => {
  let id = 1;

  config.setRegisterHookFn((hooks) => {
    const list = [
      //添加节点的回调
      hooks.addNode.registerHook({
        name: 'set node config',
        handler: async (args) => {
          console.log(args.nodeConfig);
          args.nodeConfig = {
            ...args.nodeConfig,
            id: id.toString(),
            label: id.toString(),
          };
          id += 1;
        },
      }),

      //添加边的回调
      hooks.addEdge.registerHook({
        name: 'set edge config',
        handler: async (args) => {
          console.log(args.edgeConfig);

          const { source, target } = args.edgeConfig;

          // @ts-ignore
          const flag = args.edgeConfig.source.cell < args.edgeConfig.target.cell;
          args.edgeConfig = {
            ...args.edgeConfig,
            // @ts-ignore
            source: flag ? source.cell || source : target.cell || target,
            // @ts-ignore
            target: flag ? target.cell || target : source.cell || source,
            sourcePortId: '',
            targetPortId: '',
            attrs: {
              line: {
                stroke: '#A2B1C3',
                targetMarker: null,
                strokeDasharray: '[0, 0]',
                strokeWidth: 1,
                sourceMarker: null
              },
            },
          };
        },
      }),
    ];

    const toDispose = new DisposableCollection();
    toDispose.pushAll(list);
    return toDispose;
  });
});
