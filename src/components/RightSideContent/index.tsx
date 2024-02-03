import { ControlsContainer } from './ControlsContainer';
import { ScoreBox } from './ScoreBox';

interface IRightSideContentProps {
    score: number
}

export const RightSideContent: React.FunctionComponent<IRightSideContentProps> = props => {

    return (
        <div className='rightSideContent'>

            <ScoreBox score={props.score} />

            <ControlsContainer />

            {/* Spacer */}
            <div style={{ display: 'flex', flex: 1 }}></div>
        </div>
    )
}