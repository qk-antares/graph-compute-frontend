declare namespace Graph {
  type Node = {
    id: string;
    label: string;
    style?: any;
  };

  type Edge = {
    source: string;
    target: string;
    style?: any;
  };

  type Graph = {
    id: string;
    name: string;
    createTime: Date;
    graphData?: GraphData;
  };

  type GraphData = {
    nodes: Node[];
    edges: Edge[];
  };
}
