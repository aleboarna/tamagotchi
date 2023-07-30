import { ReactComponent as People } from '../assets/people.svg';
import { LifeStage } from './right-lifecycle';

const Message = (props: {
  text: string;
  delay: number;
  isVisible: boolean;
}) => {
  return (
    <p
      className={`text-xl font-bold italic ease-in-out duration-100 delay-${
        props.delay
      } ${props.isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {props.text}
    </p>
  );
};

const girlMessages = [
  { text: 'Stop making a mess', delay: 500 },
  { text: "Why aren't you listening", delay: 300 },
  { text: "You're a cry baby", delay: 100 },
  { text: 'You talk too much', delay: 0 },
  { text: "Why can't you be more like your sister", delay: 250 },
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
    <div className="absolute w-full flex justify-evenly">
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
    <div className={'relative bottom-0 flex flex-row w-full '}>
      <MessageList isVisible={props.isVisible} lifeStage={props.lifeStage} />
      <People />
      <People />
      <People />
      <People />
      <People />
      <People />
      <People />
    </div>
  );
};
