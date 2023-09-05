declare namespace Compute {
  type Log = {
    name: string;
    id: string;
    type: string;
    entities: (DataSource.DataSource | Graph.Graph)[];
    startTime: Date;
    endTime: Date;
    status: string;
    timeUse: number;
  };

  // 编辑路径的计算结果
  type EditPath = {
    nodes: (string | null)[][];
    edges: (string[] | null)[][];
  }

  // 相似子图模式计算结果，是原图的一个子图
  type Match = {
    nodes: Graph.Node[];
    edges: Graph.Edge[];
  }

  // pageRank的计算结果是一个Map<string, number>，即节点id和节点分数的map

  // 社群计算结果（后期可以根据我们的需求更改）
  type ClusterEdge = {
    source: string;
    target: string;
    weight: number;
    count: number;
  }

  type ClusterNode = {
    id: string;
    clusterId: string;
  }

  type Cluster = {
    id: string;
    nodes: ClusterNode[];
    sumTot: number;
  }

  type ClusterResult = {
    clusterEdges: ClusterEdge[];
    clusters: Cluster[];
  }
}
