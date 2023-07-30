import { EntryGetResponsePayload } from '@tamagotchi/types';
export const Leaderboard = (props: { entries: EntryGetResponsePayload[] }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between font-bold text-l mb-4">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Total Tries</div>
        <div className="w-1/3">Max Lifecycles</div>
      </div>
      {props.entries.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between py-2 ${
            index % 2 === 0 ? 'bg-gray-100' : ''
          }`}
        >
          <div className="w-1/3">{item.userName}</div>
          <div className="w-1/3">{item.retryCount}</div>
          <div className="w-1/3">{item.recordLifeCycles}</div>
        </div>
      ))}
    </div>
  );
};
