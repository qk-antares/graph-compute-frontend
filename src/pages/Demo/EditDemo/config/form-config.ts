import type { NsGraph, NsNodeCmd } from '@antv/xflow';
import { NsJsonSchemaForm, XFlowNodeCommands } from '@antv/xflow';
import '@antv/xflow/dist/index.css';
import { set } from 'lodash';
import '../index.less';

export namespace NsJsonForm {
  /** ControlShape的Enum */
  const { ControlShape } = NsJsonSchemaForm;

  /** 保存form的values */
  export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async (args) => {
    const { values, commandService, targetData } = args;
    const updateNode = (node: NsGraph.INodeConfig) => {
      return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
        XFlowNodeCommands.UPDATE_NODE.id,
        { nodeConfig: node },
      );
    };
    console.log('formValueUpdateService  values:', values, args);
    const nodeConfig: NsGraph.INodeConfig = {
      ...targetData,
    };
    values.forEach((val) => {
      set(nodeConfig, val.name, val.value);
    });
    updateNode(nodeConfig);
  };

  /** 根据选中的节点更新formSchema */
  export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async (args) => {
    const { targetData } = args;
    console.log(`formSchemaService args:`, args);
    if (!targetData) {
      return {
        tabs: [
          {
            /** Tab的title */
            name: '画布配置',
            groups: [],
          },
        ],
      };
    }

    return {
      /** 配置一个Tab */
      tabs: [
        {
          /** Tab的title */
          name: '节点配置',
          groups: [
            {
              name: 'group1',
              controls: [
                {
                  name: 'label',
                  label: '节点Label',
                  shape: ControlShape.INPUT,
                  value: targetData.label,
                },
                {
                  name: 'x',
                  label: 'x',
                  shape: ControlShape.FLOAT,
                  value: targetData.x,
                },
                {
                  name: 'y',
                  label: 'y',
                  shape: ControlShape.FLOAT,
                  value: targetData.y,
                },
              ],
            },
          ],
        },
      ],
    };
  };
}
