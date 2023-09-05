import GED from "@/pages/Compute/ComputeList/GED";
import React from "react";
import Match from "@/pages/Compute/ComputeList/Match";
import PageRank from "@/pages/Compute/ComputeList/PageRank";
import Cluster from "@/pages/Compute/ComputeList/Cluster";

export type ComputeLogProps = {
  computeLog: Compute.Log
}

const ComputeLog: React.FC<ComputeLogProps> = ({computeLog})=>{
  return <>
    {computeLog.type === '编辑距离' && <GED computeLog={computeLog}/> ||
    computeLog.type === '模式匹配' && <Match computeLog={computeLog}/> ||
    computeLog.type === 'PageRank' && <PageRank computeLog={computeLog}/> ||
    computeLog.type === '社区发现' && <Cluster computeLog={computeLog}/>}
  </>
}

export default ComputeLog
