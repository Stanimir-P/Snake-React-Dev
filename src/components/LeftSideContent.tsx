import Snake from '../media/snake.png';

export const LeftSideContent = () => {
    return (
        <div className='leftSideContent'>
            <img src={Snake} alt='rattlesnake' className='snake' />
        </div>
    );
}