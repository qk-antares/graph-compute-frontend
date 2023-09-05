//下载对象对应的json
export const downloadJson = (data: any) => {
  if (data) {
    const jsonData = JSON.stringify(data);
    // 创建一个Blob对象，并指定MIME类型为JSON
    const blob = new Blob([jsonData], { type: "application/json" });
    // 创建一个URL对象，用于生成下载链接
    const url = URL.createObjectURL(blob);
    // 创建一个虚拟的<a>元素
    const a = document.createElement("a");
    // 设置下载链接和下载文件名
    a.href = url;
    a.download = "graphs_data.json";
    // 触发虚拟<a>元素的点击事件，实现下载
    a.click();
    // 释放URL对象
    URL.revokeObjectURL(url);
  }
}
