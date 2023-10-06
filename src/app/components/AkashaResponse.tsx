import ReconstructingText from './ReconstructingText';

interface AkashaResponseProps {
  answer: string;
}

const AkashaResponse: React.FC<AkashaResponseProps> = ({ answer }) => {
  return (
    <div className='relative answerBubbleOpen overflow-hidden'>
      <div className="relative text-sm text-center">
        {/* <ReconstructingText targetString={answer} /> */}
        <span>{answer}</span>
      </div>
    </div>
  );
};

export default AkashaResponse;