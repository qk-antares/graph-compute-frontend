import './index.less';

export const DndNode = (props: any) => {
  return (
    <div className="react-node">
      <span>{props.data.label}</span>
    </div>
  );
};
