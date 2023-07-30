import { ReactComponent as People } from '../assets/people.svg';
import { LifeStage } from './right-lifecycle';

const Message = (props: {
  text: string;
  delay: number;
  isVisible: boolean;
}) => {
  return (
    <p
      className={`text-xl font-bold italic opacity-0 transition-opacity ease-in-out duration-1000 delay-${
        props.delay
      }  ${props.isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {props.text}
    </p>
  );
};

const girlMessages = [
  { text: 'Stop making a mess', delay: 300 },
  { text: "Why aren't you listening", delay: 0 },
  { text: "You're a cry baby", delay: 200 },
  { text: 'You talk too much', delay: 300 },
  { text: "Why can't you be more like your sister", delay: 0 },
];
const womanMessages = [
  { text: 'You should lose weight', delay: 500 },
  { text: "Why aren't you married", delay: 300 },
  { text: 'Women should cook', delay: 100 },
  { text: 'You should be a mother', delay: 0 },
  { text: 'You sleep too much', delay: 250 },
];

const MessageList = (props: { isVisible: boolean; lifeStage: LifeStage }) => {
  const messages = [];
  if (props.lifeStage === LifeStage.girl) {
    messages.push(...girlMessages);
  } else {
    messages.push(...womanMessages);
  }
  return (
    <div className="w-full flex justify-evenly">
      {messages.map((message, index) => (
        <Message
          key={index}
          text={message.text}
          delay={message.delay}
          isVisible={props.isVisible}
        />
      ))}
    </div>
  );
};

export const TalkingCrowd = (props: {
  isVisible: boolean;
  lifeStage: LifeStage;
}) => {
  return (
    <div className={'flex flex-col w-full h-1/10 hidden sm:flex'}>
      <MessageList isVisible={props.isVisible} lifeStage={props.lifeStage} />
      <div className={'flex flex-row pt-10 '}>
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
        <People className={'object-contain w-full h-full'} />
      </div>
    </div>
  );
};
