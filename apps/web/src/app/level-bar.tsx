export const LevelBar = (props: { level: number; name: string }) => {
  return (
    <div className={'w-1/4'}>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700 ">
          {props.name}
        </span>
        <span className="text-sm font-medium text-blue-700 ">
          {props.level}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 ">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${props.level}%` }}
        />
      </div>
    </div>
  );
};
