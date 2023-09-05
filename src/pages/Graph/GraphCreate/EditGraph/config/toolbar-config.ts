import {SaveOutlined} from '@ant-design/icons';
import {
  createToolbarConfig,
  IconStore,
  IModelService,
  IToolbarItemOptions,
  MODELS,
  NsGraphCmd,
  XFlowGraphCommands,
} from '@antv/xflow';
import {message} from "antd";

const SAVE_GRAPH_DATA = XFlowGraphCommands.SAVE_GRAPH_DATA.id;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace NSToolbarConfig {
  export const getDependencies = async (modelService: IModelService) => {
    return [
      await MODELS.SELECTED_NODES.getModel(modelService),
      await MODELS.GRAPH_ENABLE_MULTI_SELECT.getModel(modelService),
    ];
  };

  export const getToolbarItems = async () => {
    const toolbarGroup: IToolbarItemOptions[] = [];

    /** 保存数据 */
    toolbarGroup.push({
      tooltip: '保存',
      iconName: 'SaveOutlined',
      id: SAVE_GRAPH_DATA,
      onClick: async ({ commandService }) => {
        await commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(SAVE_GRAPH_DATA, {
          // @ts-ignore
          saveGraphDataService: (meta, graphData) => {
            console.log(graphData);

            if(graphData.nodes.length === 0){
              message.error('图中至少有一个节点！')
              return;
            }

            //转成需要的数据格式
            let jsonConvert: any = {
              nodes: graphData.nodes.map((node) => {
                return { id: node.id, label: node.label};
              }),
              edges: graphData.edges.map((edge) => {
                // @ts-ignore
                return { source: edge.source, target: edge.target };
              }),
            };

            meta.setVisible(true)
            meta.setGraphData(jsonConvert)
          },
        });
      },
    });
    return [
      {
        name: 'graphData',
        items: toolbarGroup,
      },
    ];
  };
}

export const useToolbarConfig = createToolbarConfig((toolbarConfig) => {
  //注册Icon
  IconStore.set('SaveOutlined', SaveOutlined);

  /** 生产 toolbar item */
  toolbarConfig.setToolbarModelService(async (toolbarModel, modelService, toDispose) => {
    const updateToolbarModel = async () => {
      const toolbarItems = await NSToolbarConfig.getToolbarItems();

      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    };
    const models = await NSToolbarConfig.getDependencies(modelService);
    const subscriptions = models.map((model) => {
      return model.watch(async () => {
        updateToolbarModel();
      });
    });
    toDispose.pushAll(subscriptions);
  });
});
