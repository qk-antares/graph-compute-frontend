declare namespace DataSource {
  type DataSource = {
    name: string;
    id: string;
    url: string;
    createTime: Date;
    graphData?: Graph.GraphData;
  };
}
